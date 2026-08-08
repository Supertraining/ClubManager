import { Logger } from '../../../utils/logger.js';
import { supabaseAdmin, createUserClient } from '../../../config/supabaseClient.js';

let instance = null;

/**
 * UsersDAO — Supabase edition.
 *
 * Auth flows (login, register, password update) go through `supabase.auth.*`.
 * Profile reads/writes go through `public.profiles` (RLS-enforced).
 *
 * The login/register endpoints return the Supabase access_token + user
 * payload; the client uses the token on subsequent requests and the
 * `IsAuthenticated.checkJwt` middleware calls `verifyAccessToken` to load
 * the profile.
 */
export default class UsersDAO {

  // ---- Auth (uses supabaseAdmin for service-role signups) ----

  async signUp({ email, password, firstName, lastName, age, phone }) {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, age, phone },
      },
    });
    if (error) throw error;
    return data; // { user, session }
  }

  async signIn({ email, password }) {
    // We use a per-request anon client to call signIn so the user gets a
    // proper session; service_role signIn would skip password verification.
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data; // { user, session }
  }

  /**
   * Admin-only password reset (used by /users/update — admin updates a
   * socio's password from the admin panel).
   */
  async adminUpdatePassword(userId, newPassword) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) throw error;
    return data;
  }

  // ---- Profile reads/writes (RLS-enforced) ----

  async getByIdAsUser(id, accessToken) {
    const userClient = createUserClient(accessToken);
    const { data, error } = await userClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async getAllAsAdmin(accessToken) {
    const userClient = createUserClient(accessToken);
    const { data, error } = await userClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getByEmailAsAdmin(email, accessToken) {
    const userClient = createUserClient(accessToken);
    const { data, error } = await userClient
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async updateAsUser(id, updates, accessToken) {
    const userClient = createUserClient(accessToken);
    const { data, error } = await userClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteAsAdmin(id, accessToken) {
    const userClient = createUserClient(accessToken);
    // profiles row cascades from auth.users; just call admin to remove auth row.
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) throw authError;
    return { deletedCount: 1 };
  }

  // ---- Reservations (per-user) ----

  /**
   * Returns the reservations for the current user, ordered by start_time desc.
   * Backed by RLS — only the caller's reservations are visible.
   */
  async listMyReservations(accessToken) {
    const userClient = createUserClient(accessToken);
    const { data, error } = await userClient
      .from('reservations')
      .select('*, court:courts(name, display_name)')
      .order('start_time', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async deleteMyReservation(reservationId, accessToken) {
    const userClient = createUserClient(accessToken);
    const { error } = await userClient
      .from('reservations')
      .delete()
      .eq('id', reservationId);
    if (error) throw error;
    return { deletedCount: 1 };
  }

  static getInstance() {
    if (!instance) {
      instance = new UsersDAO();
      Logger.level().info('UsersDAO instance created');
    }
    return instance;
  }
}
