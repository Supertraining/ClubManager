import { Logger } from '../../../utils/logger.js';
import { createUserClient } from '../../../config/supabaseClient.js';
import { throwClubDbError } from '../../../utils/clubDbError.js';
import { CustomError } from '../../../utils/customError.Utils.js';

let instance;

function parseDate(value) {
  const parsed = new Date(value);
  if (!value || Number.isNaN(parsed.getTime())) throw CustomError.badRequest('Ingresá una fecha y hora válidas para el evento.');
  return parsed.toISOString();
}

function mapFields(data) {
  const row = {
    type: data.type ?? data.evento,
    client_first_name: data.client_first_name ?? data.nombre,
    client_last_name: data.client_last_name ?? data.apellido,
    client_phone: data.client_phone ?? data.telefono,
    adults: data.adults ?? data.adultos,
    kids: data.kids ?? data.menores,
    start_time: data.start_time ?? data.date ?? data.horaInicia,
    end_time: data.end_time ?? data.horaFinaliza,
    service_option: data.service_option ?? data.opcion,
    extra_hours: data.extra_hours ?? data.horasAdicional,
    extra_staff: data.extra_staff ?? data.camareraAdicional,
    comments: data.comments ?? data.comentarios,
    deposit: data.deposit ?? data.seña,
    status: data.status ?? (typeof data.saldado === 'boolean' ? (data.saldado ? 'saldado' : 'pendiente') : undefined),
    calendar_data: data.calendar_data ?? data.calendarData,
  };
  for (const field of ['start_time', 'end_time']) {
    if (row[field] !== undefined) row[field] = parseDate(row[field]);
  }
  for (const field of ['adults', 'kids']) {
    if (row[field] === '') delete row[field];
  }
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined));
}

export default class EventDAO {
  async getAllEvents(clubId, token) {
    const { data, error } = await createUserClient(token).from('events')
      .select('*').eq('club_id', clubId).order('start_time');
    if (error) throwClubDbError(error);
    return data;
  }

  async getEventById(id, clubId, token) {
    const { data, error } = await createUserClient(token).from('events')
      .select('*').eq('club_id', clubId).eq('id', id).maybeSingle();
    if (error) throwClubDbError(error);
    return data;
  }

  async insertEvent(event, clubId, token) {
    const { data, error } = await createUserClient(token).from('events')
      .insert({ service_option: '', ...mapFields(event), club_id: clubId }).select().single();
    if (error) throwClubDbError(error);
    return data;
  }

  async updateEvent(event, clubId, token) {
    const { data, error } = await createUserClient(token).from('events')
      .update(mapFields(event)).eq('club_id', clubId).eq('id', event.id).select().maybeSingle();
    if (error) throwClubDbError(error);
    return data;
  }

  async deleteEvent(id, clubId, token) {
    const { data, error } = await createUserClient(token).from('events')
      .delete().eq('club_id', clubId).eq('id', id).select('id').maybeSingle();
    if (error) throwClubDbError(error);
    return { deletedCount: data ? 1 : 0 };
  }

  static getInstance() {
    if (!instance) {
      instance = new EventDAO();
      Logger.level().info('EventDAO instance created');
    }
    return instance;
  }
}
