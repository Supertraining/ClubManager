import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import PropTypes from 'prop-types';
import { useAxiosInstance } from '../../hooks';
import { useClub } from '../club/useClub';
import 'react-datepicker/dist/react-datepicker.css';
import './ClubCourts.css';

const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const allowedDurations = [30, 60, 90, 120, 150, 180, 210, 240];
const clockText = minutes => Math.floor((minutes % 1440) / 60).toString().padStart(2, '0') + ':' + (minutes % 60).toString().padStart(2, '0');
const minutesOf = value => {
  if (!/^\d{2}:\d{2}$/.test(value)) return NaN;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const ReservationDateButton = forwardRef(function ReservationDateButton({ value, id, onClick, onKeyDown }, ref) {
  return (
    <button ref={ref} id={id} type='button' className='form-control d-flex justify-content-between align-items-center'
      onClick={onClick} onKeyDown={onKeyDown} aria-label={'Día de la reserva, ' + value}>
      <span>{value}</span>
      <i className='bi bi-calendar-event' aria-hidden='true' />
    </button>
  );
});

ReservationDateButton.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};
const errorText = (error, fallback) => typeof error.response?.data === 'string'
  ? error.response.data
  : error.response?.data?.message ?? fallback;

function CourtEditor({ court, onSave, onCancel }) {
  const { register, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      slug: court?.slug ?? '',
      displayName: court?.displayName ?? '',
      sport: court?.sport ?? '',
      surface: court?.surface ?? '',
      durationOptionsMin: (court?.durationOptionsMin ?? [60, 90, 120]).map(String),
      hours: weekdays.map((_, weekday) => {
        const schedule = court?.hours.find(row => row.weekday === weekday);
        return { enabled: Boolean(schedule), opens: clockText(schedule?.openMin ?? 540), closes: clockText(schedule?.closeMin ?? 1320) };
      }),
    },
  });

  const save = fields => {
    const hours = fields.hours.flatMap(({ enabled, opens, closes }, weekday) => {
      if (!enabled) return [];
      const closeMin = minutesOf(closes);
      return [{ weekday, openMin: minutesOf(opens), closeMin: closeMin === 0 ? 1440 : closeMin }];
    });
    return onSave({ ...fields, durationOptionsMin: fields.durationOptionsMin.map(Number), hours });
  };

  return (
    <form onSubmit={handleSubmit(save)} className='club-courts__panel row g-3'>
      <h2>{court ? 'Editar ' + court.displayName : 'Agregar cancha'}</h2>
      {[
        ['slug', 'Identificador para el enlace'], ['displayName', 'Nombre visible'],
        ['sport', 'Deporte'], ['surface', 'Superficie'],
      ].map(([field, label]) => (
        <div className='col-12 col-md-6' key={field}>
          <label htmlFor={'court-' + field} className='form-label'>{label}</label>
          <input id={'court-' + field} className='form-control' maxLength={field === 'slug' ? 63 : 100}
            pattern={field === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined} required={field !== 'surface'}
            readOnly={field === 'slug' && Boolean(court)} {...register(field)} />
        </div>
      ))}
      <fieldset className='col-12'>
        <legend className='fs-6'>Duraciones disponibles en minutos</legend>
        <div className='d-flex flex-wrap gap-3'>
          {allowedDurations.map(duration => <label key={duration} className='club-courts__check'>
            <input type='checkbox' value={duration} {...register('durationOptionsMin')} /> {duration}
          </label>)}
        </div>
      </fieldset>
      <fieldset className='col-12'>
        <legend className='fs-6'>Horarios semanales</legend>
        {weekdays.map((day, weekday) => (
          <div className='club-courts__hours' key={day}>
            <label className='club-courts__check'>
              <input type='checkbox' {...register('hours.' + weekday + '.enabled')} /> {day}
            </label>
            <label>Apertura
              <input type='time' step='1800' className='form-control' disabled={!watch('hours.' + weekday + '.enabled')}
                {...register('hours.' + weekday + '.opens')} />
            </label>
            <label>Cierre
              <input type='time' step='1800' className='form-control' disabled={!watch('hours.' + weekday + '.enabled')}
                {...register('hours.' + weekday + '.closes')} />
            </label>
          </div>
        ))}
        <p className='small mt-2 mb-0'>Marcá los días de apertura. Usá 00:00 para cerrar al final del día.</p>
      </fieldset>
      <div className='d-flex flex-wrap gap-2'>
        <button type='submit' className='btn btn-success' disabled={isSubmitting}>Guardar cancha</button>
        <button type='button' className='btn btn-outline-secondary' onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

CourtEditor.propTypes = { court: PropTypes.object, onSave: PropTypes.func.isRequired, onCancel: PropTypes.func.isRequired };

function CourtReservations({ court, onNotice }) {
  const { club } = useClub();
  const api = useAxiosInstance();
  const [bookings, setBookings] = useState(null);
  const [members, setMembers] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const { control, register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: {
    localDate: new Intl.DateTimeFormat('sv-SE', { timeZone: club.timezone }).format(new Date()),
    durationMin: court.durationOptionsMin[0],
  } });
  const refresh = useCallback(async (signal) => {
    try {
      const { data } = await api.get('/courts/' + court.slug, { signal });
      if (!signal?.aborted) setBookings(Object.values(data).flat().sort((a, b) => Date.parse(a.initialTime) - Date.parse(b.initialTime)));
    } catch (error) {
      if (!signal?.aborted) onNotice({ error: true, text: errorText(error, 'No pudimos cargar las reservas.') });
    }
  }, [api, court.slug, onNotice]);
  useEffect(() => {
    const query = new AbortController();
    refresh(query.signal);
    api.get('/users/getAll', { signal: query.signal }).then(({ data }) => {
      if (!query.signal.aborted) setMembers(data);
    }).catch(error => {
      if (!query.signal.aborted) onNotice({ error: true, text: errorText(error, 'No pudimos cargar el padrón.') });
    });
    return () => query.abort();
  }, [api, refresh, onNotice]);
  const reserve = async ({ localDate, time, durationMin, memberId, permanent }) => {
    try {
      await api.put('/courts/reserve', {
        courtSlug: court.slug, localDate, startMin: minutesOf(time), durationMin: Number(durationMin),
        memberId: memberId || null, permanent: Boolean(permanent),
      });
      onNotice({ text: 'Reserva confirmada.' });
      await refresh();
    } catch (error) {
      onNotice({ error: true, text: errorText(error, 'No pudimos confirmar la reserva.') });
    }
  };
  const cancel = async id => {
    try {
      await api.delete('/users/reserves/' + id);
      onNotice({ text: 'Reserva cancelada.' });
      setCancelId(null);
      await refresh();
    } catch (error) {
      onNotice({ error: true, text: errorText(error, 'No pudimos cancelar la reserva.') });
    }
  };
  const formatter = new Intl.DateTimeFormat('es-AR', { timeZone: club.timezone, dateStyle: 'short', timeStyle: 'short' });

  return (
    <section className='club-courts__panel'>
      <h2>Reservas de {court.displayName}</h2>
      {club.bookingEnabled && <form className='row g-3 mb-4' onSubmit={handleSubmit(reserve)}>
        <div className='col-12 col-md-4'>
          <label className='d-block' htmlFor='reservation-local-date'>Día</label>
          <Controller name='localDate' control={control} render={({ field }) => (
            <DatePicker
              id='reservation-local-date'
              selected={parseISO(field.value)}
              onChange={day => { if (day) field.onChange(format(day, 'yyyy-MM-dd')); }}
              dateFormat='dd/MM/yyyy'
              locale={es}
              wrapperClassName='w-100'
              customInput={<ReservationDateButton />}
            />
          )} />
        </div>
        <label className='col-12 col-md-4'>Inicio<input type='time' step='1800' className='form-control' required {...register('time')} /></label>
        <label className='col-12 col-md-4'>Duración
          <select className='form-select' {...register('durationMin')}>
            {court.durationOptionsMin.map(duration => <option key={duration} value={duration}>{duration} min</option>)}
          </select>
        </label>
        <label className='col-12 col-md-8'>A nombre de
          <select className='form-select' {...register('memberId')}>
            <option value=''>Mi cuenta</option>
            {members.map(member => <option key={member.id} value={member.id}>{member.first_name} {member.last_name} ({member.email})</option>)}
          </select>
        </label>
        <label className='col-12 col-md-4 club-courts__check'><input type='checkbox' {...register('permanent')} /> Permanente</label>
        <div><button type='submit' className='btn btn-success' disabled={isSubmitting}>Confirmar reserva</button></div>
      </form>}
      {!bookings ? <p role='status'>Cargando reservas…</p> : bookings.length === 0 ? <p>Sin reservas para los próximos días.</p> : (
        <ul className='list-group'>
          {bookings.map(booking => {
            const member = members.find(person => person.id === booking.user);
            return <li key={booking.id} className='list-group-item d-flex flex-wrap gap-2 justify-content-between align-items-center'>
              <span>{formatter.format(new Date(booking.initialTime))}{member ? ' · ' + member.first_name + ' ' + member.last_name : ''}{booking.permanent ? ' · Permanente' : ''}</span>
              {cancelId === booking.id
                ? <span className='d-flex gap-2'><button type='button' className='btn btn-danger' onClick={() => cancel(booking.id)}>Confirmar cancelación</button>
                  <button type='button' className='btn btn-outline-secondary' onClick={() => setCancelId(null)}>Volver</button></span>
                : <button type='button' className='btn btn-outline-danger' onClick={() => setCancelId(booking.id)}>Cancelar reserva</button>}
            </li>;
          })}
        </ul>
      )}
    </section>
  );
}

CourtReservations.propTypes = { court: PropTypes.object.isRequired, onNotice: PropTypes.func.isRequired };

export default function ClubCourts() {
  const api = useAxiosInstance();
  const [courts, setCourts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [notice, setNotice] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const reload = useCallback(async signal => {
    try {
      const { data } = await api.get('/courts', { signal });
      if (!signal?.aborted) setCourts(data);
    } catch (error) {
      if (!signal?.aborted) setNotice({ error: true, text: errorText(error, 'No pudimos cargar las canchas.') });
    }
  }, [api]);
  useEffect(() => {
    const query = new AbortController();
    reload(query.signal);
    return () => query.abort();
  }, [reload]);
  const save = async fields => {
    try {
      if (editing.slug === null) await api.post('/courts/createCourt', fields);
      else await api.put('/courts/' + editing.slug, fields);
      setNotice({ text: 'Cancha guardada.' });
      setEditing(null);
      await reload();
    } catch (error) {
      setNotice({ error: true, text: errorText(error, 'Revisá los datos de la cancha.') });
    }
  };
  const remove = async court => {
    try {
      await api.delete('/courts/delete/' + court.id);
      if (viewing === court.slug) setViewing(null);
      if (editing?.slug === court.slug) setEditing(null);
      setNotice({ text: 'Cancha eliminada.' });
      setDeleting(null);
      await reload();
    } catch (error) {
      setNotice({ error: true, text: errorText(error, 'No pudimos eliminar la cancha.') });
    }
  };
  const editedCourt = courts?.find(court => court.slug === editing?.slug);
  const viewedCourt = courts?.find(court => court.slug === viewing);

  return (
    <main className='container py-3 club-courts'>
      <header className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3'>
        <h1>Canchas</h1>
        <button type='button' className='btn btn-success' onClick={() => setEditing({ slug: null })}>Agregar cancha</button>
      </header>
      {notice && <p role={notice.error ? 'alert' : 'status'}>{notice.text}</p>}
      {!courts ? !notice && <p role='status'>Cargando canchas…</p> : courts.length === 0 ? <p>Agregá la primera cancha del club.</p> : (
        <ul className='list-group mb-3'>
          {courts.map(court => <li key={court.id} className='list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2'>
            <span><strong>{court.displayName}</strong> · {court.sport}</span>
            <span className='d-flex flex-wrap gap-2'>
              <button type='button' className='btn btn-outline-success' onClick={() => setViewing(court.slug)}>Ver reservas</button>
              <button type='button' className='btn btn-outline-secondary' onClick={() => setEditing({ slug: court.slug })}>Editar</button>
              {deleting === court.id
                ? <><button type='button' className='btn btn-danger' onClick={() => remove(court)}>Confirmar eliminación</button>
                  <button type='button' className='btn btn-outline-secondary' onClick={() => setDeleting(null)}>Volver</button></>
                : <button type='button' className='btn btn-outline-danger' onClick={() => setDeleting(court.id)}>Eliminar</button>}
            </span>
          </li>)}
        </ul>
      )}
      {editing && <CourtEditor key={editing.slug ?? '_new'} court={editedCourt} onSave={save} onCancel={() => setEditing(null)} />}
      {viewedCourt && <CourtReservations key={viewedCourt.id} court={viewedCourt} onNotice={setNotice} />}
    </main>
  );
}
