import { CustomError } from '../../../utils/customError.Utils.js';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const uuidPattern = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;
const durationOptions = [30, 60, 90, 120, 150, 180, 210, 240];

function toMinutes(time) {
  if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return NaN;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function parseCourtPatch(body, previousSlug) {
  const { slug = body.name, sport = previousSlug ? undefined : slug, displayName = body.display_name ?? (previousSlug ? undefined : slug),
    surface, durationOptionsMin, hours } = body;
  if (!previousSlug && (typeof slug !== 'string' || slug.length > 63 || !slugPattern.test(slug))) {
    throw CustomError.badRequest('Ingresá un identificador de cancha válido.');
  }
  const patch = previousSlug ? {} : { name: slug };
  for (const [column, value] of Object.entries({ sport, display_name: displayName })) {
    if (value === undefined) continue;
    if (typeof value !== 'string' || !value.trim() || value.trim().length > 100) throw CustomError.badRequest('Revisá el nombre y el deporte de la cancha.');
    patch[column] = value.trim();
  }
  if (surface !== undefined) {
    if (surface !== null && (typeof surface !== 'string' || surface.length > 100)) throw CustomError.badRequest('Ingresá una superficie de hasta 100 caracteres.');
    patch.surface = surface;
  }
  if (durationOptionsMin !== undefined) {
    if (!Array.isArray(durationOptionsMin) || !durationOptionsMin.length || durationOptionsMin.some(value => !durationOptions.includes(value))) {
      throw CustomError.badRequest('Elegí duraciones de 30 a 240 minutos en pasos de 30.');
    }
    patch.duration_options_min = [...new Set(durationOptionsMin)].sort((a, b) => a - b);
  }
  if (hours !== undefined) {
    if (!Array.isArray(hours) || hours.length > 7) throw CustomError.badRequest('Ingresá hasta siete horarios semanales.');
    const weekdays = new Set();
    patch.hours = hours.map(entry => {
      const { weekday, openMin, closeMin } = entry ?? {};
      if (![weekday, openMin, closeMin].every(Number.isInteger) || weekday < 0 || weekday > 6 || weekdays.has(weekday) ||
        openMin < 0 || closeMin > 1440 || openMin >= closeMin || openMin % 30 || closeMin % 30) {
        throw CustomError.badRequest('Revisá los horarios. Usá un intervalo por día, en pasos de 30 minutos.');
      }
      weekdays.add(weekday);
      return { weekday, open_min: openMin, close_min: closeMin };
    });
  }
  return patch;
}

function parseReservation(body) {
  const legacy = body.selectedDates;
  let startMin = body.startMin;
  let durationMin = body.durationMin;
  if (legacy) {
    startMin = toMinutes(legacy.initialTime);
    const legacyEnd = toMinutes(legacy.finalTime);
    durationMin = (legacyEnd === 0 ? 1440 : legacyEnd) - startMin;
  }
  const court = body.courtSlug ?? body.name;
  const localDate = body.localDate ?? legacy?.date;
  const member = body.memberId ?? body.onBehalfOfUserId ?? null;
  const permanent = body.permanent ?? legacy?.permanent ?? false;
  if (typeof court !== 'string' || !slugPattern.test(court) || typeof localDate !== 'string' || !datePattern.test(localDate)
    || !Number.isInteger(startMin) || startMin < 0 || startMin >= 1440 || !durationOptions.includes(durationMin)
    || (member !== null && (typeof member !== 'string' || !uuidPattern.test(member))) || typeof permanent !== 'boolean') {
    throw CustomError.badRequest('Elegí una cancha, una fecha y un turno válidos.');
  }
  return { p_slug: court, p_date: localDate, p_start_min: startMin, p_duration_min: durationMin, p_member_id: member, p_permanent: permanent };
}

export default class CourtServices {
  constructor(courtsDAO) {
    this.courtsDAO = courtsDAO;
  }

  save = (body, clubId, accessToken, slug = null) =>
    this.courtsDAO.save(clubId, slug, parseCourtPatch(body, slug), accessToken);

  getAll = async (clubId) => (await this.courtsDAO.getAll(clubId)).map(({ duration_options_min, hours, ...court }) => ({
    ...court,
    slug: court.name,
    displayName: court.display_name,
    durationOptionsMin: duration_options_min,
    hours: hours.map(({ weekday, open_min, close_min }) => ({ weekday, openMin: open_min, closeMin: close_min })).sort((a,b) => a.weekday - b.weekday),
  }));

  deleteCourtById = async (id, clubId, accessToken) => {
    const result = await this.courtsDAO.deleteById(id, clubId, accessToken);
    if (!result.deletedCount) throw CustomError.notFound('Cancha no encontrada.');
    return result;
  };

  availability = async (name, { from, days = '7' }, clubId, accessToken) => {
    const range = Number(days);
    if ((from !== undefined && (typeof from !== 'string' || !datePattern.test(from))) || !Number.isInteger(range) || range < 1 || range > 14) {
      throw CustomError.badRequest('Ingresá una fecha y un rango de 1 a 14 días.');
    }
    const slots = await this.courtsDAO.slots(clubId, name, from ?? null, range, accessToken, false);
    return slots.map(row => ({ startTime: row.start_time, endTime: row.end_time, mine: row.mine }));
  };

  getUnavailableDatesByName = async (name, clubId, accessToken) => {
    const reservations = await this.courtsDAO.slots(clubId, name, null, 14, accessToken, true);
    const byWeekday = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const row of reservations) {
      byWeekday[row.weekday].push({
        id: row.reservation_id, date: row.reservation_date, initialTime: row.start_time, finalTime: row.end_time,
        weekday: row.weekday, user: row.member_id, permanent: row.permanent,
      });
    }
    return byWeekday;
  };

  reserveDate = (body, clubId, accessToken) => this.courtsDAO.book(clubId, parseReservation(body), accessToken);

  deleteReserveById = async (id, clubId, accessToken) => {
    if (!id) throw CustomError.badRequest('Elegí una reserva para cancelar.');
    const result = await this.courtsDAO.deleteReservation(id, clubId, accessToken);
    if (!result.deletedCount) throw CustomError.notFound('Reserva no encontrada.');
    return result;
  };

  deleteOldReserves = (clubId, accessToken) => this.courtsDAO.deleteOldReservations(clubId, accessToken);

  deleteUserReserves = async () => ({ deletedCount: 0, note: 'Usá DELETE /users/reserves/:id.' });

  updateReservesUser = async () => ({ matchedCount: 0, modifiedCount: 0 });
}
