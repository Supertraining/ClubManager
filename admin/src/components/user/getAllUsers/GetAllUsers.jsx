import { Link } from 'react-router-dom'
import './getAllUsers.css'
import User from '../User'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

const GetAllUsers = ({handleMenuClick,  allUsers, handleGetAllUsers, handleDeleteReserve, user, setUser, handleUpdateUser, handleDeleteUser, setConfirmDelete, confirmDelete }) => {

  useEffect(() => {
    handleGetAllUsers()
  }, [allUsers, handleGetAllUsers])
  
 
  return (

    <div
      className="col-12 p-1">

      { !user
        ? <>

          <div
            className='my-3'>

            <Link
              to={ '/' }
              className='btn btn-close border border-dark p-2'
              onClick={ () =>  handleMenuClick('main')  }>
            </Link>

          </div>

          <table
            className="table bg-white table-responsive">

            <thead>

              <tr
                className="text-center text-dark">

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

              { allUsers.length === 0

                ? <tr
                  className="spinner-grow text-success m-5"
                  role="status">
                </tr>

                : allUsers.map((user, i) => (

                  <tr
                    key={ user._id }
                    className="text-center">

                    <td>
                      <div className='text-dark'>
                        { i + 1 }
                      </div>
                    </td>

                    <td>

                      <button
                        className='text-primary'
                        onClick={ () => setUser(user) }>
                        { user.username }
                      </button>

                    </td>

                    <td>
                      <div className='text-dark'>
                        { user.nombre }
                      </div>
                    </td>

                    <td>
                      <div className='text-dark'>
                        { user.apellido }
                      </div>
                    </td>

                    <td>
                      <div className='text-dark'>
                        { user.edad }
                      </div>
                    </td>

                    <td>
                      <div className='text-dark'>
                        { user.telefono }
                      </div>
                    </td>

                    { user.reserves.length === 0
                      ? <td>
                        <div className='text-danger fw-bold'>
                          Sin reservas
                        </div>
                      </td>
                      : <td>
                        <div className='text-success fw-bold'>
                          Reservas activas
                        </div>
                      </td> }

                    <td>
                      <div className='text-dark'>
                        @actividades
                      </div>
                    </td>

                    <td>
                      <div className='text-dark'>
                        { user.admin
                          ? <i className="bi bi-check-circle-fill text-success"></i>
                          : <i className="bi bi-x-circle-fill text-danger"></i>
                        }
                      </div>
                    </td>

                  </tr>

                )) }
            </tbody>

          </table>

        </>
        : <User setUser={ setUser } user={ user } handleDeleteReserve={ handleDeleteReserve } handleUpdateUser={ handleUpdateUser } handleDeleteUser={ handleDeleteUser } setConfirmDelete={ setConfirmDelete } confirmDelete={ confirmDelete } />
      }

      <div>

        <ToastContainer />

      </div>

    </div>

  )

}

export default GetAllUsers