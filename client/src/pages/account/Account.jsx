import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReservesAPI, useNotifications } from '../../hooks';
import { userStore as useUserStore } from '../../stores';
import ConfirmDialog from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { useClub } from '../../components/club/useClub';
import { clubClock } from '../../components/booking/helpers';
import PasswordForm from './PasswordForm';
import './Account.css';

const COURT_LABELS = {
  futbol: 'Fútbol',
  paddle: 'Paddle',
  squash: 'Squash',
  paleta: 'Paleta',
};

/**
 * Normaliza una fila de `reservations` a la vista que usa el componente.
 *
 * El server devuelve las columnas tal cual (snake_case) más
 * `court: { name, display_name }`. Antes se leía r.endTime / r.startTime /
 * r.initialTime, que nunca existieron: `new Date(undefined)` es Invalid Date,
 * la comparación contra `now` daba false y TODAS las reservas caían en
 * "Historial" en vez de "Próximas". Normalizar una sola vez evita volver a
 * adivinar nombres de campo.
 */
const toReserveView = (r) => {
  const start = new Date(r.start_time).getTime();
  const end = new Date(r.end_time).getTime();
  return {
    id: r.id,
    start: Number.isNaN(start) ? 0 : start,
    end: Number.isNaN(end) ? 0 : end,
    courtLabel: r.court?.display_name || COURT_LABELS[r.court?.name] || r.court?.name || 'Cancha',
    permanent: Boolean(r.permanent),
  };
};

const formatDate = (date, timeZone) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone });
};

const Account = () => {
  const { club } = useClub();
  const timeZone = club.timezone;
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user?.user);
  const { getMyReserves, deleteReserve } = useReservesAPI();
  const { notifySuccess } = useNotifications();
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [cancelling, setCancelling] = useState(null);
  const [cancellingBusy, setCancellingBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?next=/account', { replace: true });
      return;
    }
    (async () => {
      setLoading(true);
      const list = await getMyReserves();
      setReserves(list);
      setLoading(false);
    })();
  }, [user, getMyReserves, navigate]);

  if (!user) return null;

  const now = Date.now();
  const views = reserves.map(toReserveView);
  const upcoming = views.filter((r) => r.end > now).sort((a, b) => a.start - b.start);
  const past = views.filter((r) => r.end <= now).sort((a, b) => b.start - a.start);

  const visible = filter === 'upcoming' ? upcoming : past;

  // Cancelar es destructivo y libera el turno para otra familia, así que pide
  // confirmación explícita en un diálogo propio. Decir QUÉ se está cancelando
  // importa: con varias reservas en pantalla, "confirmar" a secas es ambiguo.
  const requestCancel = (reserve) => setCancelling(reserve);

  const confirmCancel = async () => {
    if (!cancelling) return;
    setCancellingBusy(true);
    try {
      const ok = await deleteReserve(cancelling.id);
      // El hook ya notificó el error si lo hubo; no cerramos sobre un fallo.
      if (!ok) {
        setCancelling(null);
        return;
      }
      const after = await getMyReserves();
      setReserves(after);
      setCancelling(null);
      notifySuccess('Tu reserva se canceló. Ese horario ya está disponible para otra familia.');
    } finally {
      setCancellingBusy(false);
    }
  };

  const initials = (user.email || 'U').slice(0, 1).toUpperCase();

  return (
    <div className='account-page'>
      <div className='container-xl account-page__inner'>
        {/* Profile card */}
        <header className='account-profile card-soft'>
          <div className='account-profile__avatar' aria-hidden='true'>{initials}</div>
          <div className='account-profile__copy'>
            <span className='eyebrow eyebrow--brand'>— Mi cuenta</span>
            <h1 className='account-profile__email'>{user.email}</h1>
            <p className='account-profile__hint'>Tus reservas, datos y configuración del club.</p>
          </div>
        </header>

        <PasswordForm />

        {/* Stats row */}
        <div className='account-stats'>
          <div className='account-stat card-soft'>
            <div className='account-stat__value'>{upcoming.length}</div>
            <div className='account-stat__label'>Próximas</div>
          </div>
          <div className='account-stat card-soft'>
            <div className='account-stat__value'>{past.length}</div>
            <div className='account-stat__label'>Historial</div>
          </div>
        </div>

        {/* Reserves list */}
        <section className='account-reserves card-soft'>
          <div className='account-reserves__head'>
            <h2 className='account-reserves__title'>Tus reservas</h2>
            <div className='account-reserves__filter' role='tablist'>
              <button
                type='button'
                role='tab'
                aria-selected={filter === 'upcoming'}
                className={`account-filter${filter === 'upcoming' ? ' account-filter--active' : ''}`}
                onClick={() => setFilter('upcoming')}>
                Próximas ({upcoming.length})
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={filter === 'past'}
                className={`account-filter${filter === 'past' ? ' account-filter--active' : ''}`}
                onClick={() => setFilter('past')}>
                Historial ({past.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className='account-loading'>
              <div className='account-loading__spinner' aria-hidden='true'></div>
              <p>Cargando tus reservas…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className='account-empty'>
              <i className='bi bi-calendar2-x' aria-hidden='true'></i>
              {filter === 'upcoming' ? (
                <>
                  <p>No tenés reservas próximas.</p>
                  <small>Probá reservando una cancha desde la página de canchas.</small>
                  <Link to='/reserves' className='btn btn--primary btn--pill'>
                    Reservar una cancha
                    <i className='bi bi-arrow-right' aria-hidden='true'></i>
                  </Link>
                </>
              ) : (
                <>
                  <p>Tu historial está vacío.</p>
                  <small>Las reservas pasadas van a aparecer acá.</small>
                </>
              )}
            </div>
          ) : (
            <ul className='account-list'>
              {visible.map((r) => (
                <li key={r.id} className='account-list__item'>
                  <div className='account-list__date'>
                    <span className='account-list__day'>
                      {new Date(r.start).toLocaleDateString('es-AR', { day: 'numeric', timeZone })}
                    </span>
                    <span className='account-list__month'>
                      {new Date(r.start).toLocaleDateString('es-AR', { month: 'short', timeZone })}
                    </span>
                  </div>
                  <div className='account-list__copy'>
                    <h3 className='account-list__court'>
                      {r.courtLabel}
                      {r.permanent && <span className='tag tag--mustard'>Permanente</span>}
                    </h3>
                    <p className='account-list__when'>
                      {formatDate(r.start, timeZone)} · {clubClock(r.start, timeZone)}
                      {' – '}
                      {clubClock(r.end, timeZone)}
                    </p>
                  </div>
                    {filter === 'upcoming' && (
                      <button
                        type='button'
                        className='btn btn--ghost btn--sm'
                        onClick={() => requestCancel(r)}>
                        <i className='bi bi-x-circle' aria-hidden='true'></i>
                        Cancelar
                      </button>
                    )}
                  </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(cancelling)}
        title='¿Cancelar la reserva?'
        confirmLabel='Sí, cancelar'
        cancelLabel='Mantener reserva'
        destructive
        busy={cancellingBusy}
        onConfirm={confirmCancel}
        onCancel={() => setCancelling(null)}>
        {cancelling && (
          <>
            Vas a liberar{' '}
            <strong>
              {cancelling.courtLabel} ·{' '}
              {formatDate(cancelling.start, timeZone)}{' '}
              {clubClock(cancelling.start, timeZone)}
            </strong>
            . Queda disponible para otra familia y no vas a poder recuperarla desde acá.
          </>
        )}
      </ConfirmDialog>
    </div>
  );
};

export default Account;
