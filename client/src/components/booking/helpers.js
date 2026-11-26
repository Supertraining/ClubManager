import {
  addMinutes,
  DEFAULT_DURATION_MIN,
  toDateKey,
} from './courtConfig';

/**
 * Convert a reserves payload (the response from /courts/:name) into a
 * flat list of reservations for the current week.
 *
 * The server's response shape (per the legacy Booking.jsx) is:
 *   { lunes: [...], martes: [...], miercoles: [...], ... }
 *
 * Each entry is { id, user, initialTime, finalTime, permanent, date } where
 * `date` is a 'YYYY-MM-DD' string.
 */
export const flattenReserves = (courtReserves) => {
  if (!courtReserves) return [];
  return Object.values(courtReserves).flat().filter(Boolean);
};

/**
 * Does any reservation overlap the range [slotStart, slotStart + durationMin)?
 *
 * The duration matters: with 1 h selected, a slot at 18:00 is free even if
 * somebody holds 17:00-17:30, but the same slot is taken for a 2 h booking.
 * Passing DEFAULT_DURATION_MIN keeps the old fixed-length behaviour.
 */
export const isSlotOccupied = (reserves, dateKey, slotStart, durationMin = DEFAULT_DURATION_MIN) => {
  const slotStartMin = toMinutes(slotStart);
  const slotEndMin = slotStartMin + durationMin;

  return reserves.some((r) => {
    if (r.date !== dateKey) return false;
    const rStart = toMinutes(toHHmm(r.initialTime));
    const rEnd = toMinutes(toHHmm(r.finalTime));
    return rStart < slotEndMin && rEnd > slotStartMin;
  });
};

/** Find a reservation that overlaps this slot for the chosen duration, if any. */
export const findReservationForSlot = (
  reserves,
  dateKey,
  slotStart,
  durationMin = DEFAULT_DURATION_MIN,
) => {
  const slotStartMin = toMinutes(slotStart);
  const slotEndMin = slotStartMin + durationMin;
  return reserves.find((r) => {
    if (r.date !== dateKey) return false;
    const rStart = toMinutes(toHHmm(r.initialTime));
    const rEnd = toMinutes(toHHmm(r.finalTime));
    return rStart < slotEndMin && rEnd > slotStartMin;
  }) || null;
};

/** End time for a slot start at the chosen duration. */
export const slotEnd = (slotStart, durationMin = DEFAULT_DURATION_MIN) =>
  addMinutes(slotStart, durationMin);

/**
 * Has this slot's start already passed? Only ever true for today — a slot on
 * any future date is bookable no matter what time of day it is.
 *
 * Shared by SlotGrid (to disable the button) and CourtPage (to count available
 * slots per range), because counting slots that are actually disabled shows a
 * number the member cannot act on.
 */
export const clubDateKey = (value, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(value));
  const calendar = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return [calendar.year, calendar.month, calendar.day].join('-');
};

export const clubToday = (timeZone) => {
  const [year, month, day] = clubDateKey(new Date(), timeZone).split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const clubClock = (value, timeZone) => new Intl.DateTimeFormat('es-AR', {
  timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).format(new Date(value));

export const isSlotPast = (slotStart, dateKey, timeZone) => {
  if (!dateKey) return false;
  const now = new Date();
  const today = clubDateKey(now, timeZone);
  return dateKey < today || (dateKey === today && slotStart <= clubClock(now, timeZone));
};

const toHHmm = (date) => {
  if (!date) return '';
  // If it's already 'HH:mm', return as-is
  if (typeof date === 'string' && /^\d{2}:\d{2}/.test(date) && !date.includes('T')) {
    return date.slice(0, 5);
  }
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Generate 7 days starting from today. */
export const getWeekDays = (start = new Date()) => {
  const days = [];
  const base = new Date(start);
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d);
  }
  return days;
};

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const formatDayShort = (date, today = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  return {
    weekday: WEEKDAYS[d.getDay()],
    weekdayShort: WEEKDAYS_SHORT[d.getDay()],
    day: d.getDate(),
    month: d.getMonth() + 1,
    monthShort: d.toLocaleDateString('es-AR', { month: 'short' }),
    isToday: isSameDay(d, today),
  };
};

export const isSameDay = (a, b) => {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
};

export { toDateKey, toHHmm, toMinutes };
