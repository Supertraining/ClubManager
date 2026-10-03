import { addMinutes, SLOT_DURATION_MIN, toDateKey } from './courtConfig';

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

/** Does any reservation overlap with the slot [start, end] on `dateKey`? */
export const isSlotOccupied = (reserves, dateKey, slotStart) => {
  const slotEndMin = (() => {
    const [h, m] = slotStart.split(':').map(Number);
    return h * 60 + m + SLOT_DURATION_MIN;
  })();

  return reserves.some((r) => {
    if (r.date !== dateKey) return false;
    const [ih, im] = toHHmm(r.initialTime).split(':').map(Number);
    const [fh, fm] = toHHmm(r.finalTime).split(':').map(Number);
    const rStart = ih * 60 + im;
    const rEnd = fh * 60 + fm;
    return rStart < slotEndMin && rEnd > (() => {
      const [h, m] = slotStart.split(':').map(Number);
      return h * 60 + m;
    })();
  });
};

/** Find a reservation that occupies this slot, if any. */
export const findReservationForSlot = (reserves, dateKey, slotStart) => {
  const slotStartMin = toMinutes(slotStart);
  const slotEndMin = slotStartMin + SLOT_DURATION_MIN;
  return reserves.find((r) => {
    if (r.date !== dateKey) return false;
    const rStart = toMinutes(toHHmm(r.initialTime));
    const rEnd = toMinutes(toHHmm(r.finalTime));
    return rStart < slotEndMin && rEnd > slotStartMin;
  }) || null;
};

/** Returns a friendly end time string for a slot start. */
export const slotEnd = (slotStart) => addMinutes(slotStart, SLOT_DURATION_MIN);

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

export const formatDayShort = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return {
    weekday: WEEKDAYS[d.getDay()],
    weekdayShort: WEEKDAYS_SHORT[d.getDay()],
    day: d.getDate(),
    month: d.getMonth() + 1,
    monthShort: d.toLocaleDateString('es-AR', { month: 'short' }),
    isToday: isSameDay(d, new Date()),
  };
};

export const isSameDay = (a, b) => {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
};

export { toDateKey, toHHmm };
