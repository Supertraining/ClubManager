import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import './UserData.css';
import PropTypes from 'prop-types';

const UserData = ({ user, handleUpdateUser, handleDeleteUser, setConfirmDelete, confirmDelete }) => {

  const [ credentials, setCredentials ] = useState(
    {
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      edad: user.edad,
      telefono: user.telefono,
      admin: user.admin
    })

  const [ showForm, setShowForm ] = useState(false)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [ e.target.name ]: e.target.value
    })
  }
 
  return (

    <>

      <div>

        <ToastContainer />

      </div>

      <h3
        className='text-primary fw-bold my-2'>
        @User Data
      </h3>

      <div className='d-flex flex-column flex-md-row align-items-center'>

        <ul
          className='list-unstyled mb-4 col-12 col-md-6 d-flex flex-column align-items-center'>

          <li className='col-12'>

            <i
              className="bi bi-envelope-at "
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1 user-data'>
              Usuario:
            </b>

            <span className='mx-1 fw-bold user-data'>
              { user.username }
            </span>

          </li>

          <li className='col-12'>

            <i
              className="bi bi-person-check"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1 user-data'>
              Nombre:
            </b>

            <span className='mx-1 fw-bold user-data'>
              { user.nombre }
            </span>

          </li>

          <li className='col-12'>

            <i
              className="bi bi-person-check"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1 user-data'>
              Apellido:
            </b>

            <span className='mx-1 fw-bold user-data'>
              { user.apellido }
            </span>

          </li>

          <li className='col-12'>

            <i
              className="bi bi-calendar-date"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1 user-data'>
              Edad:
            </b>

            <span className='mx-1 fw-bold user-data'>
              { user.edad }
            </span>

          </li>

          <li className='col-12'>

            <i
              className="bi bi-phone"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1 user-data'>
              Telefono:
            </b>

            <span className='mx-1 fw-bold user-data'>
              { user.telefono }
            </span>

          </li>

          <li className='col-12'>

            <i
              className="bi bi-sunglasses">
            </i>

            <b
              className='text-success mx-1 user-data'>
              Admin:
            </b>

            <span className='mx-1 fw-bold user-data'>
              { user.admin ? 'Si' : 'No' }
            </span>

          </li>

        </ul>

        { showForm && (
          <>

            <form className='text-center col-12 col-md-6'>

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="username"
                id="username"
                placeholder='Usuario'
                onChange={ handleChange }
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="nombre"
                id="nombre"
                placeholder='Nombre'
                onChange={ handleChange }
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="apellido"
                id="apellido"
                placeholder='Apellido'
                onChange={ handleChange }
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="edad"
                id="edad"
                placeholder='Edad'
                onChange={ handleChange }
              />

              <input
                className='mx-2 mt-3 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="telefono"
                id="telefono"
                placeholder='Telefono'
                onChange={ handleChange }
              />

              <div className='d-flex justify-content-center border-primary m-2 mt-2'>
                <label htmlFor="admin">Admin</label>
                <select name="admin" id="admin" onChange={ handleChange } className='col-3 mx-2 border'>

                  <option>

                  </option>

                  <option value={ true } >
                    Si
                  </option>

                  <option value={ false } >
                    No
                  </option>

                </select>
                {/* 
                <input
                  className=' text-warning text-center mx-2'
                  type="radio"
                  value={ true }
                  name="admin"
                  id="adminTrue"
                  onChange={ handleChange }
                />
                <input
                  className=' text-warning text-center mx-2'
                  type="radio"
                  value={ false }
                  name="admin"
                  id="adminFalse"
                  onChange={ handleChange }
                /> */}
              </div>



              <div className='d-flex flex-row justify-content-evenly'>

                <input
                  type='submit'
                  value='Actualizar'
                  className='btn btn-sm btn-outline-danger m-1'
                  onClick={ (e) => handleUpdateUser(e, credentials, user._id) }
                />

                <button
                  className='btn btn-sm btn-outline-success m-1'
                  onClick={ () => setShowForm(false) }>
                  Cancelar
                </button>

              </div>

            </form>

          </>
        ) }

      </div>

      <div className='d-flex justify-content-evenly'>

        { (!showForm && !confirmDelete) && (

          <button
            className='btn btn-success'
            onClick={ () => setShowForm(true) }>
            Editar
          </button>

        ) }

        { (!confirmDelete && !showForm) && (

          <button
            className='btn btn-danger'
            onClick={ () => setConfirmDelete(true) }>
            Eliminar
          </button>
        ) }

      </div>

      { confirmDelete && (

        <div
          className='alert alert-danger d-flex flex-column align-items-center p-1 m-0'>

          <div>
            ¿Estas seguro?
          </div>

          <div className='d-flex mt-3 justify-content-evenly col-6'>

            <button
              className='btn btn-sm btn-danger mx-1'
              onClick={ () => handleDeleteUser(user) }>
              Confirmar
            </button>

            <button
              className='btn btn-sm btn-success mx-1'
              onClick={ () => setConfirmDelete(false) }>
              Cancelar
            </button>
          </div>

        </div>
      ) }

    </>

  )
}

UserData.propTypes = {
  user: PropTypes.oneOfType([ PropTypes.bool, PropTypes.object ]),
  handleUpdateUser: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  setConfirmDelete: PropTypes.func,
  confirmDelete: PropTypes.bool
}

export default UserData