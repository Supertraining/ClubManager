import './userReserve.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useReservesAPI } from '../../../../hooks/useReservesAPI.jsx';
import { useNotifications } from '../../../../hooks/useNotifications.jsx';

const COURT_KINDS = ['futbol', 'paddle', 'squash', 'paleta'];

const formatTime = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleTimeString([], { timeStyle: 'short' }); } catch { return iso; }
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'numeric' });
  } catch { return iso; }
};

const UserReserves = ({ selectedUser, handleDeleteReserve }) => {
  const { getReservationsForCourt } = useReservesAPI();
  const { notifyWarning } = useNotifications();
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedUser?.id) {
      setReserves([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        // The server has no "list reservations for a user" endpoint yet, so
        // we hit /courts/:name for each kind and filter by user_id. The
        // admin's RLS role bypasses the user_id filter, so we get all rows.
        const all = [];
        for (const kind of COURT_KINDS) {
          try {
            const result = await getReservationsForCourt(kind);
            const list = result?.reservations ?? (Array.isArray(result) ? result : []);
            all.push(...list.filter((r) => r.user_id === selectedUser.id));
          } catch {
            // one court failing shouldn't block the others
          }
        }
        if (!cancelled) {
          all.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
          setReserves(all);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          notifyWarning('No se pudieron cargar las reservas del socio');
          setLoading(false);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedUser?.id, getReservationsForCourt, notifyWarning]);

  return (
    <div>
      <h3 className='text-primary fw-bold my-2 px-3'>@Reservas</h3>

      {loading && <p className='text-muted px-3'>Cargando reservas...</p>}

      {!loading && reserves.length === 0 && (
        <p className='text-muted px-3'>Este socio no tiene reservas activas.</p>
      )}

      {!loading && reserves.length > 0 && (
        <table className='table table-responsive w-100 bg-transparent'>
          <thead className='bg-dark text-white text-center'>
            <tr>
              <th scope='col' className='text-center selectedUser-reserves-th'>Cancha</th>
              <th scope='col' className='text-center selectedUser-reserves-th'>Fecha</th>
              <th scope='col' className='text-center selectedUser-reserves-th'>Inicia</th>
              <th scope='col' className='text-center selectedUser-reserves-th'>Finaliza</th>
              <th scope='col' className='text-center selectedUser-reserves-th'>Fijo</th>
              <th scope='col' className='text-center selectedUser-reserves-th'>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {reserves.map((res) => (
              <tr key={res.id} className='text-center text-dark'>
                <td>{res.court?.name || '—'}</td>
                <td>{formatDate(res.start_time || res.reservation_date)}</td>
                <td>{formatTime(res.start_time)}</td>
                <td>{formatTime(res.end_time)}</td>
                <td>
                  {res.permanent ? (
                    <i className='bi bi-check-circle-fill text-success'></i>
                  ) : (
                    <i className='bi bi-x-circle-fill text-danger'></i>
                  )}
                </td>
                <td>
                  <button
                    className='m-0 px-2 py-0'
                    onClick={() => handleDeleteReserve(res.id, selectedUser)}>
                    <i className='bi bi-trash-fill text-danger'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

UserReserves.propTypes = {
  selectedUser: PropTypes.object,
  handleDeleteReserve: PropTypes.func,
};

export default UserReserves;
