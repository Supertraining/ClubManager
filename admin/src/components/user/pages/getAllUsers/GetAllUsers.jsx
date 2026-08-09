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
                      <th scope='col'>Email</th>
                      <th scope='col'>Nombre</th>
                      <th scope='col'>Apellido</th>
                      <th scope='col'>Edad</th>
                      <th scope='col'>Teléfono</th>
                      <th scope='col'>Rol</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allUsers.map((user, i) => (
                      <tr key={user.id} className='text-center'>
                        <td>
                          <div className='text-dark'>{i + 1}</div>
                        </td>

                        <td>
                          <button
                            className='text-primary'
                            onClick={() => {
                              setIsUserSelected(true);
                              setSelectedUser(user);
                            }}>
                            {user.email}
                          </button>
                        </td>

                        <td>
                          <div className='text-dark'>{user.first_name}</div>
                        </td>

                        <td>
                          <div className='text-dark'>{user.last_name}</div>
                        </td>

                        <td>
                          <div className='text-dark'>{user.age}</div>
                        </td>

                        <td>
                          <div className='text-dark'>{user.phone}</div>
                        </td>

                        <td>
                          <div className='text-dark'>
                            {user.role === 'admin' ? (
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
