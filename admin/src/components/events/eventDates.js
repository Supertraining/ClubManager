export function localEventInstant(date, time, timeZone) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error('Elegí una fecha y una hora válidas para el evento.');
  }
  const wallTime = date + 'T' + time + ':00';
  const guess = new Date(wallTime + 'Z');
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone, hour: '2-digit', timeZoneName: 'longOffset',
  }).formatToParts(guess).find(part => part.type === 'timeZoneName').value;
  return new Date(wallTime + (offset.replace('GMT', '') || 'Z')).toISOString();
}

export function eventForPanel(event, timeZone) {
  const formatDate = new Intl.DateTimeFormat('es-AR', { timeZone, dateStyle: 'short' });
  const formatTime = new Intl.DateTimeFormat('es-AR', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return {
    _id: event.id,
    evento: event.type,
    nombre: event.client_first_name,
    apellido: event.client_last_name,
    telefono: event.client_phone,
    adultos: event.adults,
    menores: event.kids,
    date: formatDate.format(new Date(event.start_time)),
    horaInicia: formatTime.format(new Date(event.start_time)),
    horaFinaliza: formatTime.format(new Date(event.end_time)),
    opcion: event.service_option,
    horasAdicional: event.extra_hours,
    camareraAdicional: event.extra_staff,
    comentarios: event.comments,
    seña: event.deposit,
    saldado: event.status === 'saldado',
    calendarData: Array.isArray(event.calendar_data) ? event.calendar_data : event.calendar_data ? [event.calendar_data] : [],
  };
}
