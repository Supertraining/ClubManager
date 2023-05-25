import './menu.css'
import { Link } from 'react-router-dom'


const Menu = (props) => {

  return (
    <div className="menu-container d-flex align-items-center justify-content-center col-3">

      <ul className='options-wrapper'>

        <li className='d-flex align-items-center'>
          <Link
            to='/createUser'
            className={props.showCreateUser
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              props.setShowCreateUser(true),
                props.setShowGetAll(false)
            }}>
            Create user
          </Link>
          <i
            className={props.showCreateUser
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>
        </li>

        <li className='d-flex align-items-center'>
          <Link
            to={'/getAllUsers'}
            className={props.showGetAll
              ? 'btn btn-success'
              : 'btn btn-success bg-transparent'}
            onClick={() => {
              props.setShowGetAll(true),
                props.setShowCreateUser(false),
                props.getAllUsers()
            }}>
            All Users
          </Link>
          <i
            className={props.showGetAll
              ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}>
          </i>
        </li>

        <li className='d-flex align-items-center'>
          <Link className='btn btn-success bg-transparent' onClick={() => setOpen(true)}>Read user</Link>
          <i className={open ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}></i>
        </li>

        <li className='d-flex align-items-center'>
          <Link className='btn btn-success bg-transparent' onClick={() => setOpen(true)}>Update user</Link>
          <i className={open ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}></i>
        </li>

        <li className='d-flex align-items-center'>
          <Link className='btn btn-success bg-transparent' onClick={() => setOpen(true)}>Delete User</Link>
          <i className={open ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}></i>
        </li>


        <li className='d-flex align-items-center'>
          <Link className='btn btn-success bg-transparent' onClick={() => setOpen(true)}>Ver Todas las reservas</Link>
          <i className={open ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success' : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'}></i>
        </li>

      </ul>

    </div>

  )
}

export default Menu