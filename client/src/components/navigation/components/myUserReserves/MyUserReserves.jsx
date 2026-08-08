import './myUserReserves.css';
import PropTypes from 'prop-types';

const formatTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { timeStyle: 'short' });
  } catch {
    return iso;
  }
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
    });
  } catch {
    return iso;
  }
};

const MyUserReserves = (props) => {
  const groups = [
    { name: 'futbol',  list: props?.futbolReserves,  cls: 'text-success', border: 'border-success', icon: 'bi-trash' },
    { name: 'paddle',  list: props?.paddleReserves,  cls: 'text-primary', border: 'border-primary', icon: 'bi-exclamation-triangle' },
    { name: 'squash',  list: props?.squashReserves,  cls: 'text-info',    border: 'border-info',    icon: 'bi-exclamation-triangle' },
    { name: 'paleta',  list: props?.paletaReserves,  cls: 'text-warning', border: 'border-warning', icon: 'bi-exclamation-triangle' },
  ];

  return (
    <div className='bg-dark'>
      <h6 className='text-success fw-bold p-2 m-0'>Mis reservas:</h6>

      <div className='d-flex flex-column align-items-center border border-dark p-1 my-2'>
        <table className='table table-responsive bg-transparent w-100'>
          <thead className='bg-dark text-white text-center'>
            <tr>
              <th scope='col' className='text-center fw-light p-0'>Cancha</th>
              <th scope='col' className='text-center fw-light p-0'>Fecha</th>
              <th scope='col' className='text-center fw-light p-0'>Inicia</th>
              <th scope='col' className='text-center fw-light p-0'>Finaliza</th>
              <th scope='col' className='text-center fw-light p-0'>Anular</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ name, list, cls, border, icon }) =>
              (list || []).map((res) => (
                <tr
                  key={res.id}
                  className={`my-1 ${cls} text-center border ${border} tableData-text`}>
                  <td className='tableData'>{res.court?.display_name || name}</td>
                  <td className='tableData'>{formatDate(res.start_time || res.reservation_date)}</td>
                  <td className='tableData'>{formatTime(res.start_time)}</td>
                  <td className='tableData'>{formatTime(res.end_time)}</td>
                  <td className='tableData'>
                    <button
                      className='btn m-0 px-2 py-0'
                      onClick={() => props.handleDeleteReserve(res.id)}>
                      <i className={`bi ${icon} text-danger`}></i>
                    </button>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

MyUserReserves.propTypes = {
  futbolReserves: PropTypes.array,
  handleDeleteReserve: PropTypes.func.isRequired,
  paddleReserves: PropTypes.array,
  paletaReserves: PropTypes.array,
  squashReserves: PropTypes.array,
};

export default MyUserReserves;
