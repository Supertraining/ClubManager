/**
 * courtConfig — single source of truth for the 4 courts.
 *
 * Each court has:
 *   - displayName:  shown in the UI
 *   - image:        hero image
 *   - surface:      short tag (Césped sintético, Cristal, etc.)
 *   - pills:        small features list (shown on Home card and in the header)
 *   - weekdayHours: open hours per weekday. `null` means closed.
 *
 * Slot duration is 90 minutes (the max allowed by the existing
 * `isReserveDateAvailable` helper). Hours are interpreted in the club's
 * local timezone (America/Argentina/Buenos_Aires).
 */

import futbolImg from '../../assets/football/footballCourt.webp';
import paddleImg from '../../assets/paddle/paddle-min.webp';
import squashImg from '../../assets/squash/squash-min.webp';
import paletaImg from '../../assets/paleta/CanchaPaleta.webp';

const DEFAULT_WEEK = {
  1: { open: '08:00', close: '23:00' }, // lunes
  2: { open: '08:00', close: '23:00' },
  3: { open: '08:00', close: '23:00' },
  4: { open: '08:00', close: '23:00' },
  5: { open: '08:00', close: '23:00' }, // viernes
  6: { open: '09:00', close: '00:00' }, // sábado
  0: { open: '09:00', close: '20:00' }, // domingo
};

export const COURTS = {
  futbol: {
    name: 'futbol',
    displayName: 'Fútbol',
    image: futbolImg,
    surface: 'Césped sintético',
    pills: ['Césped sintético', 'Luz LED', 'Vestuarios', 'Arcos reglamentarios'],
    hours: DEFAULT_WEEK,
  },
  paddle: {
    name: 'paddle',
    displayName: 'Paddle',
    image: paddleImg,
    surface: 'Cristal',
    pills: ['Cristal templado', 'Césped artificial', 'Indoor', '4 jugadores'],
    hours: DEFAULT_WEEK,
  },
  squash: {
    name: 'squash',
    displayName: 'Squash',
    image: squashImg,
    surface: 'Cristal',
    pills: ['Cristal templado', 'Parquet', 'Marcación profesional'],
    hours: DEFAULT_WEEK,
  },
  paleta: {
    name: 'paleta',
    displayName: 'Paleta',
    image: paletaImg,
    surface: 'Pared rápida',
    pills: ['Frontón', 'Vestuarios', 'Outdoor', 'Horario extendido'],
    hours: DEFAULT_WEEK,
  },
};

export const COURT_LIST = Object.values(COURTS);

export const getCourt = (name) => COURTS[name] || null;

export const SLOT_DURATION_MIN = 90;

/** Format a Date (or string) to 'HH:mm' in 24h local time. */
export const toHHmm = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

/** Format 'HH:mm' to friendly '19:00'. */
export const fmtTime = (hhmm) => hhmm;

/** Add `min` minutes to an 'HH:mm' string, returning another 'HH:mm'. */
export const addMinutes = (hhmm, min) => {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + min;
  const hh = Math.floor((total / 60) % 24).toString().padStart(2, '0');
  const mm = (total % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

/** Return slot start times for a given day+court, broken into range keys. */
export const getSlotsForDay = (courtName, date) => {
  const court = COURTS[courtName];
  if (!court || !date) return { manana: [], tarde: [], noche: [] };

  // `date` is a Date object set to the user's selected day.
  const dow = date.getDay(); // 0 = Sunday
  const wh = court.hours[dow];
  if (!wh) return { manana: [], tarde: [], noche: [] };

  // Saturday close can be "00:00" (midnight) — treat as 24:00 for math
  const closeMin = (() => {
    const [h, m] = wh.close.split(':').map(Number);
    return h * 60 + m === 0 ? 24 * 60 : h * 60 + m;
  })();
  const [oh, om] = wh.open.split(':').map(Number);
  const openMin = oh * 60 + om;

  const slots = [];
  for (let m = openMin; m + SLOT_DURATION_MIN <= closeMin; m += SLOT_DURATION_MIN) {
    const hh = Math.floor(m / 60).toString().padStart(2, '0');
    const mm = (m % 60).toString().padStart(2, '0');
    slots.push(`${hh}:${mm}`);
  }

  const manana = slots.filter((s) => Number(s.slice(0, 2)) < 12);
  const tarde = slots.filter((s) => {
    const h = Number(s.slice(0, 2));
    return h >= 12 && h < 18;
  });
  const noche = slots.filter((s) => Number(s.slice(0, 2)) >= 18);

  return { manana, tarde, noche };
};

/** Slot label like "Mañana" / "Tarde" / "Noche". */
export const RANGE_LABELS = {
  manana: 'Mañana',
  tarde: 'Tarde',
  noche: 'Noche',
};

/** Format a date as 'YYYY-MM-DD' (local). */
export const toDateKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};
