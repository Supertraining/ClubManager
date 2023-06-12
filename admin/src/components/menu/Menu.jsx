import './menu.css'
import { Link } from 'react-router-dom'


const Menu = ({ menu, setMenu, handleGetAllUsers, handleGetAllCourts, handleCloseSession }) => {

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
              setMenu({
                createUser: true,
                getAllUsers: false,
                deleteReserves: false,
                getAllCourts: false,
                main: false
              })
            }}>
            Create user
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
              setMenu({
                createUser: false,
                getAllUsers: true,
                deleteReserves: false,
                getAllCourts: false,
                main: false
              }),
                handleGetAllUsers()
            }}>
            All Users
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
              setMenu({
                createUser: false,
                getAllUsers: false,
                deleteReserves: false,
                getAllCourts: true,
                main: false
              }),
                handleGetAllCourts()
            }}>
            All Courts
          </Link>

          <i
            className={menu.getAllCourts
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>

        </li>

        <li
          className='d-flex align-items-center'>

          <Link
            className='btn btn-success bg-transparent'
          >
            Delete User
          </Link>

          <i className={open
            ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
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
              setMenu({
                createUser: false,
                getAllUsers: false,
                deleteReserves: true,
                getAllCourts: false,
                main: false
              })
            }}>
            Delete reserves history
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