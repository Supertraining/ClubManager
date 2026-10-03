import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReservesAPI, useNotifications } from '../../hooks';
import { userStore } from '../../stores';
import './Account.css';

const COURT_LABELS = {
  futbol: 'Fútbol',
  paddle: 'Paddle',
  squash: 'Squash',
  paleta: 'Paleta',
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
};

const Account = () => {
  const navigate = useNavigate();
  const user = userStore((s) => s.user?.user);
  const { getMyReserves, deleteReserve } = useReservesAPI();
  const { notifySuccess } = useNotifications();
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

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

  const now = new Date();
  const upcoming = reserves
    .filter((r) => new Date(r.endTime || r.finalTime || r.startTime) > now)
    .sort((a, b) => new Date(a.startTime || a.initialTime) - new Date(b.startTime || b.initialTime));
  const past = reserves
    .filter((r) => new Date(r.endTime || r.finalTime || r.startTime) <= now)
    .sort((a, b) => new Date(b.startTime || b.initialTime) - new Date(a.startTime || a.initialTime));

  const visible = filter === 'upcoming' ? upcoming : past;

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar tu reserva? Tu lugar se libera para otra familia.')) return;
    await deleteReserve(id);
    const after = await getMyReserves();
    setReserves(after);
    notifySuccess('Tu reserva se canceló. Tu lugar se libera para otra familia.');
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
              {visible.map((r) => {
                const start = r.startTime || r.initialTime;
                const end = r.endTime || r.finalTime;
                const court = r.court || r.name || r.court_name;
                return (
                  <li key={r.id} className='account-list__item'>
                    <div className='account-list__date'>
                      <span className='account-list__day'>
                        {new Date(start).toLocaleDateString('es-AR', { day: 'numeric' })}
                      </span>
                      <span className='account-list__month'>
                        {new Date(start).toLocaleDateString('es-AR', { month: 'short' })}
                      </span>
                    </div>
                    <div className='account-list__copy'>
                      <h3 className='account-list__court'>
                        {COURT_LABELS[court] || court}
                        {r.permanent && <span className='tag tag--mustard'>Permanente</span>}
                      </h3>
                      <p className='account-list__when'>
                        {formatDate(start)} · {new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' – '}
                        {new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {filter === 'upcoming' && (
                      <button
                        type='button'
                        className='btn btn--ghost btn--sm'
                        onClick={() => handleCancel(r.id)}>
                        <i className='bi bi-x-circle' aria-hidden='true'></i>
                        Cancelar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Account;
