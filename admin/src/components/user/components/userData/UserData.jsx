import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import './UserData.css';
import PropTypes from 'prop-types';

const UserData = ({
  selectedUser,
  handleUpdateUser,
  handleDeleteUser,
  setConfirmDelete,
  confirmDelete,
}) => {
  const [credentials, setCredentials] = useState({
    email: selectedUser.email,
    first_name: selectedUser.first_name,
    last_name: selectedUser.last_name,
    age: selectedUser.age,
    phone: selectedUser.phone,
    role: selectedUser.role,
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>

      <h3 className='text-primary fw-bold my-2'>@User Data</h3>

      <div className='d-flex flex-column flex-md-row align-items-center'>
        <ul className='list-unstyled mb-4 col-12 col-md-6 d-flex flex-column align-items-center'>
          <li className='col-12'>
            <i className='bi bi-envelope-at' id='basic-addon1'></i>
            <b className='text-success mx-1 selectedUser-data'>Email:</b>
            <span className='mx-1 fw-bold selectedUser-data'>{selectedUser.email}</span>
          </li>

          <li className='col-12'>
            <i className='bi bi-person-check' id='basic-addon1'></i>
            <b className='text-success mx-1 selectedUser-data'>Nombre:</b>
            <span className='mx-1 fw-bold selectedUser-data'>{selectedUser.first_name}</span>
          </li>

          <li className='col-12'>
            <i className='bi bi-person-check' id='basic-addon1'></i>
            <b className='text-success mx-1 selectedUser-data'>Apellido:</b>
            <span className='mx-1 fw-bold selectedUser-data'>{selectedUser.last_name}</span>
          </li>

          <li className='col-12'>
            <i className='bi bi-calendar-date' id='basic-addon1'></i>
            <b className='text-success mx-1 selectedUser-data'>Edad:</b>
            <span className='mx-1 fw-bold selectedUser-data'>{selectedUser.age}</span>
          </li>

          <li className='col-12'>
            <i className='bi bi-phone' id='basic-addon1'></i>
            <b className='text-success mx-1 selectedUser-data'>Telefono:</b>
            <span className='mx-1 fw-bold selectedUser-data'>{selectedUser.phone}</span>
          </li>

          <li className='col-12'>
            <i className='bi bi-sunglasses'></i>
            <b className='text-success mx-1 selectedUser-data'>Rol:</b>
            <span className='mx-1 fw-bold selectedUser-data'>{selectedUser.role}</span>
          </li>
        </ul>

        {showForm && (
          <>
            <form className='text-center col-12 col-md-6'>
              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type='email'
                name='email'
                id='email'
                placeholder='Email'
                value={credentials.email ?? ''}
                onChange={handleChange}
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type='text'
                name='first_name'
                id='first_name'
                placeholder='Nombre'
                value={credentials.first_name ?? ''}
                onChange={handleChange}
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type='text'
                name='last_name'
                id='last_name'
                placeholder='Apellido'
                value={credentials.last_name ?? ''}
                onChange={handleChange}
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type='number'
                min={12}
                max={99}
                name='age'
                id='age'
                placeholder='Edad'
                value={credentials.age ?? ''}
                onChange={handleChange}
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type='text'
                name='phone'
                id='phone'
                placeholder='Telefono'
                value={credentials.phone ?? ''}
                onChange={handleChange}
              />

              <div className='d-flex justify-content-center border-primary m-2 mt-2'>
                <label htmlFor='role'>Rol</label>
                <select
                  name='role'
                  id='role'
                  value={credentials.role ?? 'socio'}
                  onChange={handleChange}
                  className='col-3 mx-2 border'>
                  <option value='socio'>socio</option>
                  <option value='admin'>admin</option>
                </select>
              </div>

              <div className='d-flex flex-row justify-content-evenly'>
                <input
                  type='submit'
                  value='Actualizar'
                  className='btn btn-sm btn-outline-danger m-1'
                  onClick={(e) => handleUpdateUser(e, credentials, selectedUser.id)}
                />

                <button
                  className='btn btn-sm btn-outline-success m-1'
                  onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <div className='d-flex justify-content-evenly'>
        {!showForm && !confirmDelete && (
          <button
            className='btn btn-success'
            onClick={() => setShowForm(true)}>
            <i className='bi bi-pencil mx-1'></i>
            Editar
          </button>
        )}

        {!confirmDelete && !showForm && (
          <button
            className='btn btn-danger'
            onClick={() => setConfirmDelete(true)}>
            <i className='bi bi-trash mx-1'></i>
            Eliminar
          </button>
        )}
      </div>

      {confirmDelete && (
        <div className='alert alert-danger d-flex flex-column align-items-center p-1 m-0'>
          <div>¿Estas seguro?</div>

          <div className='d-flex mt-3 justify-content-evenly col-6'>
            <button
              className='btn btn-sm btn-danger mx-1'
              onClick={() => handleDeleteUser(selectedUser)}>
              Confirmar
            </button>

            <button
              className='btn btn-sm btn-success mx-1'
              onClick={() => setConfirmDelete(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

UserData.propTypes = {
  selectedUser: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  handleUpdateUser: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  setConfirmDelete: PropTypes.func,
  confirmDelete: PropTypes.bool,
};

export default UserData;
