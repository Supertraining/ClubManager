import { Link } from 'react-router-dom'
import './getAllUsers.css'
import User from '../user/User'
import { ToastContainer } from 'react-toastify';

const GetAllUsers = ({ setMenu, menu, allUsers, handleDeleteReserve, user, setUser, handleUpdateUser, handleDeleteUser, setConfirmDelete, confirmDelete }) => {

  return (

    <div
      className="col-9 p-1">

      {!user
        ? <>

          <div
            className='my-3'>

            <Link
              to={'/'}
              className='btn btn-close border border-dark p-2'
              onClick={() => setMenu({ ...menu, main: true, getAllUsers: false })}>
            </Link>

          </div>

          <table
            className="table table-responsive">

            <thead>

              <tr
                className="text-center ">

                <th
                  scope="col">
                  #
                </th>

                <th
                  scope="col">
                  UserName
                </th>

                <th
                  scope="col">
                  Nombre
                </th>

                <th
                  scope="col">
                  Apellido
                </th>

                <th
                  scope="col">
                  edad
                </th>

                <th
                  scope="col">
                  telefono
                </th>

                <th
                  scope="col">
                  reservas
                </th>

                <th
                  scope="col">
                  actividades
                </th>

                <th
                  scope="col">
                  admin
                </th>

              </tr>

            </thead>

            <tbody>

              {allUsers.length === 0

                ? <tr
                  className="spinner-grow text-success m-5"
                  role="status">
                </tr>

                : allUsers.map((user, i) => (

                  <tr
                    key={user._id}
                    className="text-center">

                    <td>
                      <div className='btn'>
                        {i + 1}
                      </div>
                    </td>

                    <td>

                      <button
                        className='btn text-primary'
                        onClick={() => setUser(user)}>
                        {user.username}
                      </button>

                    </td>

                    <td>
                      <div className='btn'>
                        {user.nombre}
                      </div>
                    </td>

                    <td>
                      <div className='btn'>
                        {user.apellido}
                      </div>
                    </td>

                    <td>
                      <div className='btn'>
                        {user.edad}
                      </div>
                    </td>

                    <td>
                      <div className='btn'>
                        {user.telefono}
                      </div>
                    </td>

                    {user.reserves.length === 0
                      ? <td>
                        <div className='btn text-danger fw-bold'>
                          Sin reservas
                        </div>
                      </td>
                      : <td>
                        <div className='btn text-success fw-bold'>
                          Reservas activas
                        </div>
                      </td>}

                    <td>
                      <div className='btn'>
                        @actividades
                      </div>
                    </td>

                    <td>
                      <div className='btn'>
                        {user.admin.toString()}
                      </div>
                    </td>

                  </tr>

                ))}
            </tbody>

          </table>

        </>
        : <User setUser={setUser} user={user} handleDeleteReserve={handleDeleteReserve} handleUpdateUser={handleUpdateUser} handleDeleteUser={handleDeleteUser} setConfirmDelete={setConfirmDelete} confirmDelete={confirmDelete} />
      }

      <div>

        <ToastContainer />

      </div>

    </div>

  )

}

export default GetAllUsers