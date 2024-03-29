import { Link } from 'react-router-dom';
import './getAllUsers.css';
import { User } from '../user/User';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../../spinner/Spinner';
export const GetAllUsers = ({
  handleMenuClick,
  menu,
  allUsers,
  handleGetAllUsers,
  handleDeleteReserve,
  handleUpdateUser,
  handleDeleteUser,
  setConfirmDelete,
  confirmDelete,
  selectedUser,
  setSelectedUser,
  isUserSelected,
  setIsUserSelected,
}) => {
  useEffect(() => {
    handleGetAllUsers();
  }, [handleGetAllUsers]);

  useEffect(() => {
    handleMenuClick('getAllUsers');
  }, [handleMenuClick]);
  
  return (
    <>
      {menu.getAllUsers && (
        <div className='col-12 p-1'>
          {!isUserSelected ? (
            <>
              <div className='my-3'>
                <Link
                  to={'/'}
                  className='btn btn-close border border-dark p-2'
                  onClick={() => handleMenuClick('main')}></Link>
              </div>

              {allUsers.length === 0 ? (
                <Spinner
                  type={'grow'}
                  color={'text-success'}
                  text={'Cargando aguarde unos momentos por favor'}
                  textColor={'text-success'}
                  textSize={'fs-5'}
                />
              ) : (
                <table className='table bg-white table-responsive'>
                  <thead>
                    <tr className='text-center text-dark'>
                      <th scope='col'>#</th>

                      <th scope='col'>UserName</th>

                      <th scope='col'>Nombre</th>

                      <th scope='col'>Apellido</th>

                      <th scope='col'>edad</th>

                      <th scope='col'>telefono</th>

                      <th scope='col'>reservas</th>

                      <th scope='col'>actividades</th>

                      <th scope='col'>admin</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allUsers.map((user, i) => (
                      <tr
                        key={user._id}
                        className='text-center'>
                        <td>
                          <div className='text-dark'>{i + 1}</div>
                        </td>

                        <td>
                          <button
                            className='text-primary'
                            onClick={() => {
                              setIsUserSelected(true), setSelectedUser(user);
                            }}>
                            {user.username}
                          </button>
                        </td>

                        <td>
                          <div className='text-dark'>{user.nombre}</div>
                        </td>

                        <td>
                          <div className='text-dark'>{user.apellido}</div>
                        </td>

                        <td>
                          <div className='text-dark'>{user.edad}</div>
                        </td>

                        <td>
                          <div className='text-dark'>{user.telefono}</div>
                        </td>

                        {user.reserves.length === 0 ? (
                          <td>
                            <div className='text-danger fw-bold'>Sin reservas</div>
                          </td>
                        ) : (
                          <td>
                            <div className='text-success fw-bold'>Reservas activas</div>
                          </td>
                        )}

                        <td>
                          <div className='text-dark'>@actividades</div>
                        </td>

                        <td>
                          <div className='text-dark'>
                            {user.admin ? (
                              <i className='bi bi-check-circle-fill text-success'></i>
                            ) : (
                              <i className='bi bi-x-circle-fill text-danger'></i>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <User
              setIsUserSelected={setIsUserSelected}
              isUserSelected={isUserSelected}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              handleDeleteReserve={handleDeleteReserve}
              handleUpdateUser={handleUpdateUser}
              handleDeleteUser={handleDeleteUser}
              setConfirmDelete={setConfirmDelete}
              confirmDelete={confirmDelete}
            />
          )}

          <div>
            <ToastContainer />
          </div>
        </div>
      )}
    </>
  );
};

GetAllUsers.propTypes = {
  handleMenuClick: PropTypes.func,
  menu: PropTypes.object,
  allUsers: PropTypes.array,
  handleGetAllUsers: PropTypes.func,
  handleDeleteReserve: PropTypes.func,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  setUser: PropTypes.func,
  handleUpdateUser: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  setConfirmDelete: PropTypes.func,
  confirmDelete: PropTypes.bool,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
  isUserSelected: PropTypes.bool,
  setIsUserSelected: PropTypes.func,
};
