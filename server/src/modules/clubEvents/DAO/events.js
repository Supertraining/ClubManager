import { Logger } from '../../../utils/logger.js';
import { supabaseAdmin } from '../../../config/supabaseClient.js';

let instance = null;

/**
 * EventsDAO — Supabase edition.
 *
 * Events are admin-only data (see RLS in 02_rls.sql). The public app does
 * not list them. We use supabaseAdmin (service_role) here.
 */
export default class EventDAO {

  async getAllEvents() {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getEventById(id) {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async insertEvent(data) {
    const row = this._mapFromLegacy(data);
    const { data: inserted, error } = await supabaseAdmin
      .from('events')
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return inserted;
  }

  async updateEvent(data) {
    const { id, ...rest } = data;
    const row = this._mapFromLegacy(rest);
    const { data: updated, error } = await supabaseAdmin
      .from('events')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  }

  async deleteEvent(id) {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { deletedCount: 1 };
  }

  /**
   * Map the legacy Mongoose field names → Supabase column names.
   * The old client posts camelCase Spanish field names; we accept both.
   */
  _mapFromLegacy(data) {
    if (!data) return {};
    const get = (...keys) => {
      for (const k of keys) if (data[k] !== undefined) return data[k];
      return undefined;
    };
    return {
      type: get('type', 'evento'),
      client_first_name: get('client_first_name', 'nombre'),
      client_last_name: get('client_last_name', 'apellido'),
      client_phone: get('client_phone', 'telefono'),
      adults: Number(get('adults', 'adultos', 0)),
      kids: Number(get('kids', 'menores', 0)),
      start_time: this._parseDateTime(get('start_time', 'date', 'horaInicia')),
      end_time: this._parseDateTime(get('end_time', 'horaFinaliza')),
      service_option: get('service_option', 'opcion') ?? '',
      extra_hours: get('extra_hours', 'horasAdicional'),
      extra_staff: get('extra_staff', 'camareraAdicional'),
      comments: get('comments', 'comentarios'),
      deposit: get('deposit', 'seña'),
      status: get('status') ?? (data.saldado ? 'saldado' : 'pendiente'),
      calendar_data: get('calendar_data', 'calendarData') ?? [],
    };
  }

  _parseDateTime(v) {
    if (!v) return null;
    if (v instanceof Date) return v.toISOString();
    // Accept ISO strings or "YYYY-MM-DD HH:mm" / "YYYY-MM-DDTHH:mm"
    const s = String(v).replace(' ', 'T');
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  static getInstance() {
    if (!instance) {
      instance = new EventDAO();
      Logger.level().info('EventDAO instance created');
    }
    return instance;
  }
}
