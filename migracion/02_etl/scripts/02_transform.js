// 02_transform.js
// Convierte dump.json al shape de Postgres/Supabase.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import unidecode from 'unidecode';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COURT_KIND_TO_NAME = {
  futbol: 'futbol',
  paddle: 'paddle',
  squash: 'squash',
  paleta: 'paleta',
};

const WEEKDAY_NUM = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sábado: 6,
};

const slugifyEmail = (s) => String(s || '').trim().toLowerCase();

function parseDateToUTC(dateStr, hhmm) {
  // dateStr examples: "lunes, 5/8", "5/8/2024", "2024-08-05"
  // hhmm examples: "20:30", "08:00"
  if (!dateStr || !hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  // Try to parse the date heuristically. If it has a year, use it; else
  // assume current year. If it doesn't parse, return today as fallback.
  const now = new Date();
  const year = now.getFullYear();
  const day = /\d+/.exec(dateStr)?.[0];
  const month = /\/\s*(\d+)/.exec(dateStr)?.[1];
  if (!day || !month) return null;
  const d = new Date(Date.UTC(year, Number(month) - 1, Number(day), h, m, 0));
  return d.toISOString();
}

function toISOTimestamp(unix) {
  if (!unix) return null;
  return new Date(Number(unix)).toISOString();
}

function main() {
  console.log('[transform] Reading dump.json...');
  const dumpPath = join(__dirname, '..', 'dump.json');
  const dump = JSON.parse(readFileSync(dumpPath, 'utf8'));

  const transformed = {
    users: [],
    courts: [],
    activities: [],
    activity_categories: [],
    reservations: [],
    events: [],
    // Map legacy username → email (used to look up auth user id later)
    emailToId: {},
  };

  // ---- USERS ----
  console.log(`[transform] Processing ${dump.users.length} users...`);
  for (const u of dump.users) {
    const email = slugifyEmail(u.username);
    const isAdmin = Boolean(u.admin);
    transformed.users.push({
      email,
      first_name: u.nombre || '',
      last_name: u.apellido || '',
      age: Number(u.edad) || 18,
      phone: u.telefono || '',
      role: isAdmin ? 'admin' : 'socio',
      // The password hash from MongoDB is not portable. We mark these users
      // for password reset on first login. The Supabase admin createUser
      // call will need to set a temp password or trigger a reset email.
      _legacyMongoId: u._id,
      _legacyUsername: u.username,
    });
  }

  // ---- COURTS ----
  console.log(`[transform] Processing ${dump.courts.length} courts...`);
  for (const c of dump.courts) {
    transformed.courts.push({
      name: c.name,
      display_name: c.display_name || c.name,
      description: c.description ?? null,
      surface: c.surface ?? null,
      price_cents: c.price_cents ?? null,
      _legacyMongoId: c._id,
    });
  }

  // Build a court name → _legacyId map for later
  const courtNameToLegacyId = {};
  for (const c of transformed.courts) {
    courtNameToLegacyId[c.name] = c._legacyMongoId;
  }

  // ---- ACTIVITIES + CATEGORIES ----
  console.log(`[transform] Processing ${dump.activities.length} activities...`);
  for (const a of dump.activities) {
    transformed.activities.push({
      name: a.activity,
      description: a.description || '',
      image_url: a.img || null,
      image_alt: a.imgText || null,
      data_target: a.data_target || null,
      _legacyMongoId: a._id,
    });
    if (Array.isArray(a.category)) {
      a.category.forEach((cat, i) => {
        transformed.activity_categories.push({
          _legacyActivityMongoId: a._id,
          name: cat.name,
          age_range: cat.age_range,
          days: cat.days,
          schedule: cat.schedule,
          display_order: i,
        });
      });
    }
  }

  // ---- RESERVATIONS ----
  // Two sources: user.reserves[] and court.unavailableDates.{weekday}[].
  // Dedup by court + start_time to avoid creating the same reservation twice.
  const seen = new Set();

  console.log(`[transform] Processing reservations from user.reserves[]...`);
  for (const u of dump.users) {
    if (!Array.isArray(u.reserves)) continue;
    for (const r of u.reserves) {
      const courtName = r.court;
      const courtMongoId = courtNameToLegacyId[courtName];
      if (!courtMongoId) continue;

      const startISO = toISOTimestamp(r.initialTime);
      const endISO = toISOTimestamp(r.finalTime);
      if (!startISO || !endISO) continue;

      const key = `${courtName}|${startISO}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const startDate = new Date(startISO);
      transformed.reservations.push({
        _legacyCourtName: courtName,
        _legacyUsername: u.username,
        weekday: startDate.getUTCDay(),
        reservation_date: startISO.slice(0, 10),
        start_time: startISO,
        end_time: endISO,
        permanent: Boolean(r.permanent),
        info: r.info ?? null,
        _dedupKey: key,
      });
    }
  }

  console.log(`[transform] Processing reservations from court.unavailableDates...`);
  for (const c of dump.courts) {
    if (!c.unavailableDates) continue;
    for (const [weekday, list] of Object.entries(c.unavailableDates)) {
      if (!Array.isArray(list)) continue;
      const wd = WEEKDAY_NUM[unidecode(weekday).toLowerCase()];
      if (wd == null) continue;
      for (const r of list) {
        const startISO = toISOTimestamp(r.initialTime);
        const endISO = toISOTimestamp(r.finalTime);
        if (!startISO || !endISO) continue;
        const key = `${c.name}|${startISO}`;
        if (seen.has(key)) continue;
        seen.add(key);

        transformed.reservations.push({
          _legacyCourtName: c.name,
          _legacyUsername: r.user,
          weekday: wd,
          reservation_date: startISO.slice(0, 10),
          start_time: startISO,
          end_time: endISO,
          permanent: Boolean(r.permanent),
          info: r.info ?? null,
        });
      }
    }
  }

  // ---- EVENTS ----
  console.log(`[transform] Processing ${dump.events.length} events...`);
  for (const ev of dump.events) {
    transformed.events.push({
      type: ev.evento,
      client_first_name: ev.nombre || '',
      client_last_name: ev.apellido || '',
      client_phone: ev.telefono || '',
      adults: Number(ev.adultos) || 0,
      kids: Number(ev.menores) || 0,
      start_time: parseDateToUTC(ev.date, ev.horaInicia),
      end_time: parseDateToUTC(ev.date, ev.horaFinaliza),
      service_option: ev.opcion || '',
      extra_hours: ev.horasAdicional || null,
      extra_staff: ev.camareraAdicional || null,
      comments: ev.comentarios || null,
      deposit: ev.seña || null,
      status: ev.saldado ? 'saldado' : 'pendiente',
      calendar_data: Array.isArray(ev.calendarData) ? ev.calendarData : [],
    });
  }

  // Drop the temp dedup key
  transformed.reservations.forEach((r) => delete r._dedupKey);

  const outPath = join(__dirname, '..', 'transformed.json');
  writeFileSync(outPath, JSON.stringify(transformed, null, 2), 'utf8');
  console.log(`[transform] Wrote ${outPath}`);
  console.log(`[transform] Summary:`);
  console.log(`  users:               ${transformed.users.length}`);
  console.log(`  courts:              ${transformed.courts.length}`);
  console.log(`  activities:          ${transformed.activities.length}`);
  console.log(`  activity_categories: ${transformed.activity_categories.length}`);
  console.log(`  reservations:        ${transformed.reservations.length}`);
  console.log(`  events:              ${transformed.events.length}`);
}

main().catch((err) => {
  console.error('[transform] FAILED:', err);
  process.exit(1);
});
