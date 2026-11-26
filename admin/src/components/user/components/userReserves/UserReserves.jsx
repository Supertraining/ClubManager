import './userReserve.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAxiosInstance } from '../../../../hooks/useAxiosInstance.jsx';
import { useClub } from '../../../club/useClub';

const formatTime = (iso, timeZone) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleTimeString('es-AR', { timeStyle: 'short', timeZone }); } catch { return iso; }
};

const formatDate = (iso, timeZone) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'numeric', timeZone });
  } catch { return iso; }
};

const UserReserves = ({ selectedUser, handleDeleteReserve }) => {
  const api = useAxiosInstance();
  const { club } = useClub();
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fault, setFault] = useState(false);

  useEffect(() => {
    if (!selectedUser?.id) {
      setReserves([]);
      return;
    }
    const query = new AbortController();
    const load = async () => {
      setLoading(true);
      setFault(false);
      try {
        const { data } = await api.get('/users/user/' + selectedUser.id + '/reserves', { signal: query.signal });
        if (!query.signal.aborted) setReserves(data);
      } catch {
        if (!query.signal.aborted) setFault(true);
      } finally {
        if (!query.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => query.abort();
  }, [selectedUser?.id, api]);

  return (
    <div>
      <h3 className='fs-5 fw-semibold my-2 px-3'>Reservas</h3>

      {loading && <p className='text-muted px-3'>Cargando reservas...</p>}

      {fault && <p role='alert'>No pudimos cargar las reservas del socio.</p>}

      {!loading && !fault && reserves.length === 0 && (
        <p className='text-muted px-3'>Este socio no tiene reservas activas.</p>
      )}

      {!loading && !fault && reserves.length > 0 && (
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
                <td>{res.court?.display_name || '—'}</td>
                <td>{formatDate(res.start_time, club.timezone)}</td>
                <td>{formatTime(res.start_time, club.timezone)}</td>
                <td>{formatTime(res.end_time, club.timezone)}</td>
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
                    aria-label='Cancelar reserva'
                    onClick={async () => {
                      const deleted = await handleDeleteReserve(res.id);
                      if (deleted) setReserves(current => current.filter(row => row.id !== res.id));
                    }}>
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
