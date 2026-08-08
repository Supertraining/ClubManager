import { supabaseAdmin } from '../../config/supabaseClient.js';

/**
 * Base DAO for Supabase tables.
 *
 * Use `supabaseAdmin` for trusted server operations (cron jobs, admin-only
 * endpoints that need to bypass RLS). For per-user operations, build a
 * per-request client with `createUserClient(accessToken)` from supabaseClient.js
 * — see modules/users/DAO/users.js for an example.
 *
 * The methods here return plain JS objects (Supabase rows). Validation,
 * mapping, and business rules live in the service layer.
 */
export default class SupabaseDao {
  /**
   * @param {string} table - the Supabase table name (e.g. 'profiles', 'courts').
   */
  constructor(table) {
    if (!table) {
      throw new Error('SupabaseDao requires a table name.');
    }
    this.table = table;
    this.client = supabaseAdmin;
  }

  /**
   * Build a per-request client bound to the user's JWT. Use this from handlers
   * so RLS policies apply. Subclass and override `client` or just pass a
   * different one to the methods that need it.
   */
  asUser(accessToken) {
    // Lazy import to avoid a circular dep at boot.
    // eslint-disable-next-line global-require
    return import('../../config/supabaseClient.js').then(({ createUserClient }) => ({
      client: createUserClient(accessToken),
      table: this.table,
    }));
  }

  async getAll(select = '*', order = null) {
    let q = this.client.from(this.table).select(select);
    if (order) q = q.order(order.column, { ascending: order.ascending ?? true });
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  }

  async getOne(filter, select = '*') {
    const { data, error } = await this.client
      .from(this.table)
      .select(select)
      .match(filter)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async getById(id, select = '*') {
    const { data, error } = await this.client
      .from(this.table)
      .select(select)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async insert(row) {
    const { data, error } = await this.client
      .from(this.table)
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.client
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.client
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { deletedCount: 1 };
  }
}
