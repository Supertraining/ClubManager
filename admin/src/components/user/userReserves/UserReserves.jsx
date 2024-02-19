import './userReserve.css'
import PropTypes from 'prop-types'

const UserReserves = ({ user, handleDeleteReserve }) => {

  return (

    <div>

      <h3 className='text-primary fw-bold my-2 px-3'>
        @Reservas
      </h3>

      <table
        className='table table-responsive w-100 bg-transparent'>

        <thead
          className='bg-dark text-white text-center'>

          <tr>

            <th
              scope='col'
              className='text-center user-reserves-th'>
              Actividad
            </th>

            <th
              scope='col'
              className='text-center user-reserves-th'>
              fecha
            </th>

            <th
              scope='col'
              className='text-center user-reserves-th'>
              Inicia
            </th>

            <th
              scope='col'
              className='text-center user-reserves-th'>
              Finaliza
            </th>

            <th
              scope='col'
              className='text-center user-reserves-th'>
              Fijo
            </th>

            <th
              scope='col'
              className='text-center user-reserves-th'>
              Anular
            </th>

          </tr>

        </thead>

        <tbody>
          {user?.reserves?.map((res) => (
            <tr
              key={res.id}
              className='text-center text-dark'>

              <td>
                {res.court}
              </td>

              <td>
                {res.date}
              </td>

              <td>
                {new Date(res.initialTime).toLocaleTimeString(
                  [], { timeStyle: 'short' }
                )}
              </td>

              <td>
                {new Date(res.finalTime).toLocaleTimeString(
                  [], { timeStyle: 'short' }
                )}
              </td>

              <td>
                {res.permanent
                  ? <i className="bi bi-check-circle-fill text-success"></i>
                  : <i className="bi bi-x-circle-fill text-danger"></i>}
              </td>

              <td>

                <button
                  className='alert alert-danger m-0 px-2 py-0'
                  onClick={() => handleDeleteReserve(res.court, res.weekday, res.id, user._id)}>

                  <i
                    className="bi bi-exclamation-triangle">
                  </i>

                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

UserReserves.propTypes = { 
  user: PropTypes.object, 
  handleDeleteReserve: PropTypes.func
}

export default UserReserves

