import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import './UserData.css'
const UserData = ({ user, handleUpdateUser, handleDeleteUser, setConfirmDelete, confirmDelete }) => {

  const [credentials, setCredentials] = useState(
    {
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      edad: user.edad,
      telefono: user.telefono,
      admin: user.admin
    })

  const [showForm, setShowForm] = useState(false)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>

      <div>

        <ToastContainer />

      </div>

      <h3>@User Data</h3>
      <div className='d-flex'>

        <ul
          className='list-unstyled mb-4 col-6'>

          <li className='border-bottom'>

            <i
              className="bi bi-envelope-at"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1'>
              Usuario:
            </b>

            <span className='mx-1 fw-bold'>
              {user.username}
            </span>

          </li>

          <li className='border-bottom'>

            <i
              className="bi bi-person-check"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1'>
              Nombre:
            </b>

            <span className='mx-1 fw-bold'>
              {user.nombre}
            </span>

          </li>

          <li className='border-bottom'>

            <i
              className="bi bi-person-check"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1'>
              Apellido:
            </b>

            <span className='mx-1 fw-bold'>
              {user.apellido}
            </span>

          </li>

          <li className='border-bottom'>

            <i
              className="bi bi-calendar-date"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1'>
              Edad:
            </b>

            <span className='mx-1 fw-bold'>
              {user.edad}
            </span>

          </li>

          <li className='border-bottom'>

            <i
              className="bi bi-phone"
              id="basic-addon1">
            </i>

            <b
              className='text-success mx-1'>
              Telefono:
            </b>

            <span className='mx-1 fw-bold'>
              {user.telefono}
            </span>

          </li>

          <li className='border-bottom'>

            <i
              className="bi bi-sunglasses">
            </i>

            <b
              className='text-success mx-1'>
              Admin:
            </b>

            <span className='mx-1 fw-bold'>
              {`${user.admin}`}
            </span>

          </li>

        </ul>
        {showForm && (
          <>

            <form className='text-center col-6'>

              <input
                className='mx-2 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="username"
                id="username"
                placeholder='Usuario'
                onChange={handleChange}
              />

              <input
                className='mx-2 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="nombre"
                id="nombre"
                placeholder='Nombre'
                onChange={handleChange}
              />

              <input
                className='mx-2 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="apellido"
                id="apellido"
                placeholder='Apellido'
                onChange={handleChange}
              />

              <input
                className='mx-2 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="edad"
                id="edad"
                placeholder='Edad'
                onChange={handleChange}
              />

              <input
                className='mx-2 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="telefono"
                id="telefono"
                placeholder='Telefono'
                onChange={handleChange}
              />

              <input
                className='mx-2 text-warning text-center border-0 border-bottom border-primary col-12'
                type="text"
                name="admin"
                id="admin"
                placeholder='true/false'
                onChange={handleChange}
              />



              <div className='d-flex justify-content-evenly'>

                <input
                  type='submit'
                  value='Actualizar'
                  className='btn btn-sm btn-outline-danger m-1'
                  onClick={(e) => handleUpdateUser(e, credentials, user._id)}
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
      {!showForm && (
        <div
          className='d-flex justify-content-evenly mt-2'>

          <button
            className='btn btn-dark'
            onClick={() => setShowForm(true)}>
            Editar
          </button>

          {!confirmDelete

            ? <button
              className='btn btn-danger'
              onClick={() => setConfirmDelete(true)}>
              Eliminar
            </button>

            : <div
              className='alert alert-danger d-flex p-1 m-0'>

              <button
                className='btn btn-sm btn-danger mx-1'
                onClick={() => handleDeleteUser(user)}>
                Confirmar
              </button>

              <button
                className='btn btn-sm btn-success mx-1'
                onClick={() => setConfirmDelete(false)}>
                Cancelar
              </button>

            </div>
          }

        </div>
      )}

    </div>
  )
}

export default UserData