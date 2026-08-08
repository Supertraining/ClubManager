import { Logger } from '../../../utils/logger.js';
import { supabaseAdmin, createUserClient } from '../../../config/supabaseClient.js';

let instance = null;

/**
 * CourtsDAO — Supabase edition.
 *
 * - Courts are public-read (anon can list).
 * - Writes are admin-only (RLS).
 * - Reservations live in their own table; the old "unavailableDates" array
 *   on the court doc is gone. Use `getReservationsForCourt` to power the
 *   week-board.
 */
export default class CourtsDAO {

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('courts')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getByName(name) {
    const { data, error } = await supabaseAdmin
      .from('courts')
      .select('*')
      .eq('name', name)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('courts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(court) {
    const { data, error } = await supabaseAdmin
      .from('courts')
      .insert(court)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteById(id) {
    const { error } = await supabaseAdmin
      .from('courts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { deletedCount: 1 };
  }

  /**
   * Returns the reservations for a court between two dates. Same shape as the
   * legacy /courts/:name endpoint, but rows come from `reservations` instead
   * of `unavailableDates`.
   */
  async getReservationsForCourtByName(name, fromIso, toIso) {
    const { data: court, error: courtError } = await supabaseAdmin
      .from('courts')
      .select('id, name, display_name')
      .eq('name', name)
      .maybeSingle();
    if (courtError) throw courtError;
    if (!court) return { court: null, reservations: [] };

    const { data, error } = await supabaseAdmin
      .from('reservations')
      .select('id, weekday, reservation_date, start_time, end_time, user_id, permanent, info')
      .eq('court_id', court.id)
      .gte('start_time', fromIso ?? new Date().toISOString())
      .lte('end_time', toIso ?? new Date(Date.now() + 14 * 86400000).toISOString())
      .order('start_time', { ascending: true });
    if (error) throw error;
    return { court, reservations: data ?? [] };
  }

  /**
   * Create a reservation via the server-side RPC. RLS + EXCLUDE constraint
   * enforce ownership and double-booking protection.
   */
  async createReservation({ courtId, startTime, endTime, permanent = false, info = null }, accessToken) {
    const userClient = createUserClient(accessToken);
    const { data, error } = await userClient.rpc('create_reservation', {
      p_court_id: courtId,
      p_start_time: startTime,
      p_end_time: endTime,
      p_permanent: permanent,
      p_info: info,
    });
    if (error) throw error;
    return data;
  }

  async deleteReservation(reservationId, accessToken) {
    const userClient = createUserClient(accessToken);
    const { error } = await userClient
      .from('reservations')
      .delete()
      .eq('id', reservationId);
    if (error) throw error;
    return { deletedCount: 1 };
  }

  async deleteOldReservations() {
    // RPC defined in 03_rpc.sql — security definer, runs as service_role.
    const { data, error } = await supabaseAdmin.rpc('delete_old_reservations');
    if (error) throw error;
    return { deletedCount: data ?? 0 };
  }

  static getInstance() {
    if (!instance) {
      instance = new CourtsDAO();
      Logger.level().info('CourtsDAO instance created');
    }
    return instance;
  }
}
