import './menu.css'
import { Link } from 'react-router-dom'


const Menu = ({ menu, handleGetAllUsers, handleGetAllCourts, handleCloseSession, handleMenuClick }) => {

  return (

    <div
      className="menu-container d-flex align-items-center justify-content-center col-3">

      <ul
        className='options-wrapper'>

        <li
          className='d-flex align-items-center'>

          <Link
            to='/createUser'
            className={menu.createUser
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              handleMenuClick('createUser')
            }}>
            Crear usuario
          </Link>

          <i
            className={menu.createUser
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>

        </li>

        <li
          className='d-flex align-items-center'>

          <Link
            to={'/getAllUsers'}
            className={menu.getAllUsers
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              handleMenuClick('getAllUsers'),
                handleGetAllUsers()
            }}>
            Todos los usuarios
          </Link>

          <i
            className={menu.getAllUsers
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>

        </li>

        <li
          className='d-flex align-items-center'>

          <Link
            to={'/courts'}
            className={menu.getAllCourts
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              handleMenuClick('getAllCourts'),
                handleGetAllCourts()
            }}>
            Canchas
          </Link>

          <i
            className={menu.getAllCourts
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>

        </li>

        <li
          className='d-flex align-items-center'>

          <Link
            to={'/events'}
            className={menu.events
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              handleMenuClick('events')
            }}>
            Eventos
          </Link>

          <i className={menu.events
            ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
            : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>

        </li>


        <li
          className='d-flex align-items-center'>

          <Link
            to={'/oldReservesDeleted'}
            className={menu.deleteReserves
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              handleMenuClick('deleteReserves')
            }}>
            Borrar historial de reservas
          </Link>

          <i
            className={menu.deleteReserves
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>

        </li>

        <li
          className='d-flex align-items-center'>
          <button className='btn btn-danger m-auto' onClick={handleCloseSession}>
            Cerrar sesión
          </button>

        </li>

      </ul>

    </div>

  )
}

export default Menu