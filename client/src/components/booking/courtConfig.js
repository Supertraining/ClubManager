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
 * Reservation timing. These used to be a single 90-minute constant doing two
 * jobs at once, so every booking was exactly 90 minutes. They are separate now:
 *
 *   - SLOT_STEP_MIN       how often a slot can START. This is the grid density.
 *   - DURATION_OPTIONS    how long a booking can be, chosen per reservation.
 *
 * Durations are enforced again on the server (dataValidator.courtReservation);
 * these constants are the UI-side truth, not the only guard.
 *
 * Hours are interpreted in the club's local timezone (America/Argentina/Buenos_Aires).
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

/**
 * How often a slot can start. This is grid density, not booking length.
 *
 * 30 minutes, not 60: a booking can end at any half hour (19:00-20:30 is
 * legal), so with an hourly grid the slot right after a booking is either
 * unusable or blocked, and the true free boundary (20:30) is not
 * representable at all. Half-hour steps make every free boundary reachable.
 */
export const SLOT_STEP_MIN = 30;

/** A booking can be between 1 and 2 hours, in half-hour steps. */
export const MIN_DURATION_MIN = 60;
export const MAX_DURATION_MIN = 120;
export const DURATION_OPTIONS = [60, 90, 120];

/**
 * 60 minutes by default. Defaulting to the longest booking made the grid
 * look fuller than it is: with 90 minutes selected, the 18:00 slot overlaps a
 * 19:00-20:30 booking and reads as taken even though 18:00-19:00 is free.
 * The default is the shortest booking so the grid shows everything that can
 * actually be reserved, and the member opts into longer.
 */
export const DEFAULT_DURATION_MIN = 60;

/** "90" -> "1 h 30 min" */
export const formatDuration = (min) => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

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

/**
 * Open/close for a court on a given day, in minutes from midnight.
 * Saturday closes at "00:00", which means midnight, so it becomes 1440.
 * Returns null when the court is closed that day.
 */
export const getCourtHours = (courtName, date) => {
  const court = COURTS[courtName];
  if (!court || !date) return null;

  const wh = court.hours[date.getDay()]; // 0 = Sunday
  if (!wh) return null;

  const [ch, cm] = wh.close.split(':').map(Number);
  const [oh, om] = wh.open.split(':').map(Number);
  return {
    openMin: oh * 60 + om,
    closeMin: ch * 60 + cm === 0 ? 24 * 60 : ch * 60 + cm,
  };
};

/** Return slot start times for a given day+court, broken into range keys. */
export const getSlotsForDay = (courtName, date) => {
  const hours = getCourtHours(courtName, date);
  if (!hours) return { manana: [], tarde: [], noche: [] };
  const { openMin, closeMin } = hours;

  const slots = [];
  // A slot is offered as long as the SHORTEST booking fits, so the last hour
  // of court time stays sellable. Longer durations are gated in BookingPanel
  // against the same closeMin, which is why a 22:00 slot on a court that shuts
  // at 23:00 offers 1 h but not 2 h.
  for (let m = openMin; m + MIN_DURATION_MIN <= closeMin; m += SLOT_STEP_MIN) {
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
