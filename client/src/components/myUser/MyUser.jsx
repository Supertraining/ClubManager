import { AuthContext } from '../context/AuthContext';
import './myUser.css';
import React, { useContext } from 'react'
import { useInView } from 'react-intersection-observer';



const MyUser = ({handleDeleteAccount, delAccountMssg }) => {

  const { user } = useContext(AuthContext);
  const { ref, inView } = useInView({
    threshold: 0,
  })

  return (
    <div ref={ref} className={inView ? 'myUserContainer rounded p-2' : undefined} >

      <h6 className='text-white'>Datos de mi cuenta:</h6 >

      <ul>

        <li>
          <i className="bi bi-caret-right-fill text-info"></i>
          <b className='text-success'>Usuario: </b><span className='text-white'>{user.username}</span> </li>

        <li>
          <i className="bi bi-caret-right-fill text-info"></i>
          <b className='text-success'>Nombre: </b><span className='text-white'>{user.nombre}</span>
        </li>

        <li>
          <i className="bi bi-caret-right-fill text-info"></i>
          <b className='text-success'>Apellido: </b><span className='text-white'>{user.apellido}</span>
        </li>

        <li>
          <i className="bi bi-caret-right-fill text-info"></i>
          <b className='text-success'>Teléfono: </b><span className='text-white'>{user.telefono}</span>
        </li>

      </ul>

      <div className="navbar-nav align-items-center p-2">
          <button className='btn btn-danger' onClick={handleDeleteAccount}>
          Eliminar mi cuenta
          <i className="bi bi-exclamation-triangle mx-1"></i>
          </button>
      </div>
      
        {delAccountMssg &&
          <div className='alert alert-danger text-center'>
            Su cuenta ha sido eliminada
          </div>
        }

    </div>
  )
}

export default MyUser
