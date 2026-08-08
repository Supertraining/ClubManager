// 03_load_postgres.js
// Lee transformed.json y hace bulk insert en Supabase.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Strategy: use the public Supabase REST endpoints + service_role key.
 * For users, we use auth.admin.createUser so the trigger creates the
 * profile row automatically. For everything else, direct table inserts.
 */

async function loadUsers(users) {
  console.log(`[load] Creating ${users.length} users via auth.admin.createUser...`);
  const emailToId = {};
  let created = 0;
  let failed = 0;

  for (const u of users) {
    // Use a random password the user will have to reset on first login.
    // (You can also call supabase.auth.resetPasswordForEmail(email) for each.)
    const tempPassword = 'Club' + Math.random().toString(36).slice(2, 10) + '!2026';
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: u.first_name,
        last_name: u.last_name,
        age: u.age,
        phone: u.phone,
        role: u.role,
      },
    });
    if (error) {
      console.error(`[load]   ✗ ${u.email}: ${error.message}`);
      failed++;
      continue;
    }
    emailToId[u.email] = data.user.id;
    created++;
    if (created % 50 === 0) console.log(`[load]   ...${created} users created`);
  }
  console.log(`[load] Users done: ${created} created, ${failed} failed.`);
  return emailToId;
}

async function loadCourts(courts) {
  console.log(`[load] Inserting ${courts.length} courts...`);
  // Skip if a court with the same name already exists.
  const { data: existing } = await supabase.from('courts').select('id, name');
  const existingNames = new Set((existing ?? []).map((c) => c.name));
  const nameToId = Object.fromEntries((existing ?? []).map((c) => [c.name, c.id]));

  const toInsert = courts
    .filter((c) => !existingNames.has(c.name))
    .map(({ _legacyMongoId, ...rest }) => rest);

  if (toInsert.length === 0) {
    console.log('[load]   No new courts to insert.');
    // Reload name → id map including existing ones
    const { data: all } = await supabase.from('courts').select('id, name');
    for (const c of all ?? []) nameToId[c.name] = c.id;
    return nameToId;
  }

  const { data, error } = await supabase.from('courts').insert(toInsert).select('id, name');
  if (error) {
    console.error('[load]   ✗ insert failed:', error.message);
    throw error;
  }
  for (const c of data ?? []) nameToId[c.name] = c.id;
  console.log(`[load]   Inserted ${data.length} new courts.`);
  return nameToId;
}

async function loadActivities(activities, activityCategories, courtNameToId) {
  console.log(`[load] Inserting ${activities.length} activities...`);
  const legacyIdToNewId = {};

  for (const a of activities) {
    const row = {
      name: a.name,
      description: a.description,
      image_url: a.image_url,
      image_alt: a.image_alt,
      data_target: a.data_target,
    };
    const { data, error } = await supabase
      .from('activities')
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error(`[load]   ✗ ${a.name}: ${error.message}`);
      continue;
    }
    legacyIdToNewId[a._legacyMongoId] = data.id;
  }

  // Categories
  const categoriesToInsert = activityCategories
    .map((c) => ({
      activity_id: legacyIdToNewId[c._legacyActivityMongoId],
      name: c.name,
      age_range: c.age_range,
      days: c.days,
      schedule: c.schedule,
      display_order: c.display_order,
    }))
    .filter((c) => c.activity_id);

  if (categoriesToInsert.length) {
    const { error } = await supabase
      .from('activity_categories')
      .insert(categoriesToInsert);
    if (error) console.error('[load]   ✗ categories insert:', error.message);
    else console.log(`[load]   Inserted ${categoriesToInsert.length} categories.`);
  }

  return legacyIdToNewId;
}

async function loadReservations(reservations, emailToId, courtNameToId) {
  console.log(`[load] Inserting ${reservations.length} reservations...`);
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  // Group by user to batch nicely
  for (const r of reservations) {
    const userId = emailToId[slugifyEmail(r._legacyUsername)];
    const courtId = courtNameToId[r._legacyCourtName];
    if (!userId || !courtId) {
      skipped++;
      continue;
    }

    const row = {
      court_id: courtId,
      user_id: userId,
      weekday: r.weekday,
      reservation_date: r.reservation_date,
      start_time: r.start_time,
      end_time: r.end_time,
      permanent: r.permanent,
      info: r.info,
      created_by: userId,
    };

    const { error } = await supabase.from('reservations').insert(row);
    if (error) {
      if (error.code === '23P01') {
        // EXCLUDE violation — slot already taken. Skip silently.
        skipped++;
      } else {
        failed++;
        if (failed < 5) console.error(`[load]   ✗ ${r._legacyCourtName} ${r.start_time}: ${error.message}`);
      }
      continue;
    }
    inserted++;
    if (inserted % 100 === 0) console.log(`[load]   ...${inserted} reservations inserted`);
  }
  console.log(`[load] Reservations done: ${inserted} inserted, ${skipped} skipped, ${failed} failed.`);
}

async function loadEvents(events) {
  console.log(`[load] Inserting ${events.length} events...`);
  let inserted = 0;
  let skipped = 0;

  for (const ev of events) {
    if (!ev.start_time || !ev.end_time) {
      skipped++;
      continue;
    }
    const { error } = await supabase.from('events').insert(ev);
    if (error) {
      console.error(`[load]   ✗ ${ev.type}: ${error.message}`);
      continue;
    }
    inserted++;
  }
  console.log(`[load] Events done: ${inserted} inserted, ${skipped} skipped.`);
}

function slugifyEmail(s) {
  return String(s || '').trim().toLowerCase();
}

async function main() {
  const path = join(__dirname, '..', 'transformed.json');
  console.log(`[load] Reading ${path}...`);
  const t = JSON.parse(readFileSync(path, 'utf8'));

  // 1. Users
  const emailToId = await loadUsers(t.users);
  console.log(`[load] users → emailToId map size: ${Object.keys(emailToId).length}`);

  // 2. Courts
  const courtNameToId = await loadCourts(t.courts);

  // 3. Activities + categories
  await loadActivities(t.activities, t.activity_categories, courtNameToId);

  // 4. Reservations
  await loadReservations(t.reservations, emailToId, courtNameToId);

  // 5. Events
  await loadEvents(t.events);

  console.log('[load] Done.');
}

main().catch((err) => {
  console.error('[load] FAILED:', err);
  process.exit(1);
});
