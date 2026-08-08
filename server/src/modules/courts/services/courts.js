import { CustomError } from "../../../utils/customError.Utils.js";

export default class CourtServices {
  constructor(courtsDAO) {
    this.courtsDAO = courtsDAO;
  }

  save = async (court) => {
    return this.courtsDAO.create(court);
  };

  getAll = async () => {
    return this.courtsDAO.getAll();
  };

  deleteCourtById = async (id) => {
    const result = await this.courtsDAO.deleteById(id);
    if (result.deletedCount === 0) {
      throw CustomError.notFound('the court does not exists');
    }
    return result;
  };

  getUnavailableDatesByName = async (name) => {
    const { court, reservations } = await this.courtsDAO.getReservationsForCourtByName(name);
    if (!court) throw CustomError.notFound(`Court ${name} no existe`);
    // The legacy endpoint returned a dict { lunes: [...], martes: [...] } keyed by weekday.
    // Keep that shape for backward compatibility with the existing client.
    const byWeekday = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const r of reservations) {
      const w = Number(r.weekday);
      if (byWeekday[w]) byWeekday[w].push({
        id: r.id,
        date: r.reservation_date,
        initialTime: r.start_time,
        finalTime: r.end_time,
        weekday: w,
        user: r.user_id,
        permanent: r.permanent,
        info: r.info,
      });
    }
    return byWeekday;
  };

  reserveDate = async (reserve, accessToken) => {
    const { name, selectedDates } = reserve;
    if (!name || !selectedDates) throw CustomError.badRequest('Faltan datos de la reserva');
    const court = await this.courtsDAO.getByName(name);
    if (!court) throw CustomError.notFound(`Court ${name} no existe`);

    const { date, initialTime, finalTime, permanent } = selectedDates;
    const start = new Date(`${date}T${initialTime}:00-03:00`); // Argentina tz
    const end = new Date(`${date}T${finalTime}:00-03:00`);

    return this.courtsDAO.createReservation({
      courtId: court.id,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      permanent: Boolean(permanent),
    }, accessToken);
  };

  deleteReserveById = async (reserveId, accessToken) => {
    if (!reserveId) throw CustomError.badRequest('Falta reserveId');
    return this.courtsDAO.deleteReservation(reserveId, accessToken);
  };

  deleteOldReserves = async () => {
    return this.courtsDAO.deleteOldReservations();
  };

  /**
   * Backward-compat shim. The old "delete user reserves" used to scan every
   * court's unavailableDates array. In Supabase, the RLS policy already
   * scopes deletes to the caller's reservations, so this is a no-op that
   * returns success. New clients should DELETE /users/reserves/:id.
   */
  deleteUserReserves = async (_user, _accessToken) => {
    return { deletedCount: 0, note: 'Use DELETE /users/reserves/:id; RLS scopes to your own reservations.' };
  };

  /**
   * Backward-compat shim. The old "update reserves user" renamed a user
   * across the courts.unavailableDates array. In Supabase, reservations
   * carry a user_id (uuid) and there's no username to rename.
   */
  updateReservesUser = async (_payload) => {
    return { matchedCount: 0, modifiedCount: 0, note: 'No-op: reservations reference user_id, not username.' };
  };
}
