import './userReserve.css';
import PropTypes from 'prop-types';

const UserReserves = ({ setSelectedUser, selectedUser, handleDeleteReserve }) => {
  return (
    <div>
      <h3 className='text-primary fw-bold my-2 px-3'>@Reservas</h3>

      <table className='table table-responsive w-100 bg-transparent'>
        <thead className='bg-dark text-white text-center'>
          <tr>
            <th
              scope='col'
              className='text-center selectedUser-reserves-th'>
              Actividad
            </th>

            <th
              scope='col'
              className='text-center selectedUser-reserves-th'>
              fecha
            </th>

            <th
              scope='col'
              className='text-center selectedUser-reserves-th'>
              Inicia
            </th>

            <th
              scope='col'
              className='text-center selectedUser-reserves-th'>
              Finaliza
            </th>

            <th
              scope='col'
              className='text-center selectedUser-reserves-th'>
              Fijo
            </th>

            <th
              scope='col'
              className='text-center selectedUser-reserves-th'>
              Eliminar
            </th>
          </tr>
        </thead>

        <tbody>
          {selectedUser?.reserves?.map((res) => (
            <tr
              key={res.id}
              className='text-center text-dark'>
              <td>{res.court}</td>

              <td>{res.date}</td>

              <td>{new Date(res.initialTime).toLocaleTimeString([], { timeStyle: 'short' })}</td>

              <td>{new Date(res.finalTime).toLocaleTimeString([], { timeStyle: 'short' })}</td>

              <td>
                {res.permanent ? (
                  <i className='bi bi-check-circle-fill text-success'></i>
                ) : (
                  <i className='bi bi-x-circle-fill text-danger'></i>
                )}
              </td>

              <td>
                <button
                  className='alert alert-danger m-0 px-2 py-0'
                  onClick={async () => {
                    const updatedUser = await handleDeleteReserve(
                      res.court,
                      res.weekday,
                      res.id,
                      selectedUser._id,
                      selectedUser.username
                    );

                    setSelectedUser(updatedUser);
                  }}>
                  <i className='bi bi-trash'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserReserves.propTypes = {
  selectedUser: PropTypes.object,
  handleDeleteReserve: PropTypes.func,
  setSelectedUser: PropTypes.func,
};

export default UserReserves;
