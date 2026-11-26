import { Logger } from '../../../utils/logger.js';
import { createUserClient } from '../../../config/supabaseClient.js';
import { clubRpc } from '../../clubs/DAO/clubs.js';
import { throwClubDbError } from '../../../utils/clubDbError.js';

let instance;

export default class CourtsDAO {
  async getAll(clubId) {
    const { data, error } = await createUserClient().from('courts')
      .select('id,name,sport,display_name,surface,duration_options_min,hours:court_schedules(weekday,open_min,close_min)')
      .eq('club_id', clubId).eq('active', true).order('name');
    if (error) throwClubDbError(error);
    return data;
  }

  save(clubId, slug, patch, accessToken) {
    return clubRpc(accessToken, 'save_club_court', { p_club_id: clubId, p_slug: slug, p_changes: patch });
  }

  async deleteById(id, clubId, accessToken) {
    const { data, error } = await createUserClient(accessToken).from('courts')
      .delete().eq('club_id', clubId).eq('id', id).select('id').maybeSingle();
    if (error) throwClubDbError(error);
    return { deletedCount: data ? 1 : 0 };
  }

  slots(clubId, slug, from, days, accessToken, legacy) {
    return clubRpc(accessToken, legacy ? 'club_court_slots' : 'club_court_availability', {
      p_club_id: clubId, p_slug: slug, p_from: from, p_days: days,
    });
  }

  book(clubId, reservation, accessToken) {
    return clubRpc(accessToken, 'book_club_court', { p_club_id: clubId, ...reservation });
  }

  async deleteReservation(reservationId, clubId, accessToken) {
    const { data, error } = await createUserClient(accessToken).from('reservations')
      .delete().eq('club_id', clubId).eq('id', reservationId).select('id').maybeSingle();
    if (error) throwClubDbError(error);
    return { deletedCount: data ? 1 : 0 };
  }

  async deleteOldReservations(clubId, accessToken) {
    const { count, error } = await createUserClient(accessToken).from('reservations')
      .delete({ count: 'exact' }).eq('club_id', clubId).lt('end_time', new Date().toISOString());
    if (error) throwClubDbError(error);
    return { deletedCount: count ?? 0 };
  }

  static getInstance() {
    if (!instance) {
      instance = new CourtsDAO();
      Logger.level().info('CourtsDAO instance created');
    }
    return instance;
  }
}
