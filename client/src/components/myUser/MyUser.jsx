import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import './myUser.css';
import React, { useContext, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const MyUser = (props) => {
  const { user } = useContext(AuthContext);

  const [ showForm, setShowForm ] = useState(false);
  const [ confirmDelete, setConfirmDelete ] = useState(false);
  const [ credentials, setCredentials ] = useState({
    username: '',
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const handleChange = (e) => {
    setCredentials({
      ...user,
      [ e.target.name ]: e.target.value,
    });
  };

  return (
    user && (
      <div ref={ ref } className={ inView ? 'myUserContainer rounded p-2' : undefined }>
        <h6 className='text-white'>Datos de mi cuenta:</h6>

        <ul>
          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Usuario: </b>
            <span className='text-white'>{ user?.username }</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Nombre: </b>
            <span className='text-white'>{ user?.nombre }</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Apellido: </b>
            <span className='text-white'>{ user?.apellido }</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Edad: </b>
            <span className='text-white'>{ user?.edad } años</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Teléfono: </b>
            <span className='text-white'>{ user?.telefono }</span>
          </li>
        </ul>

        { showForm && (
          <>
            <form className='text-center d-flex flex-column align-items-center justify-content-center col-10'>
              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='username'
                  id='username'
                  placeholder='Usuario'
                  onChange={ handleChange }
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='nombre'
                  id='nombre'
                  placeholder='Nombre'
                  onChange={ handleChange }
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='apellido'
                  id='apellido'
                  placeholder='Apellido'
                  onChange={ handleChange }
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='edad'
                  id='edad'
                  placeholder='Edad'
                  onChange={ handleChange }
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='telefono'
                  id='telefono'
                  placeholder='Telefono'
                  onChange={ handleChange }
                />
              </div>

            </form>
            <div className='d-flex justify-content-center col-12 mt-2'>
              <button
                className='btn btn-sm btn-outline-danger m-1'
                onClick={ (e) => {
                  props.handleUpdateUser(e, credentials, user._id), setShowForm(false);
                } }
              >
                Actualizar
              </button>

              <button
                className='btn btn-sm btn-outline-success m-1'
                onClick={ () => setShowForm(false) }
              >
                Cancelar
              </button>
            </div>
          </>
        ) }

        <div className='d-flex justify-content-evenly align-items-center'>
          { !showForm && !confirmDelete && (
            <div>
              <button className='btn btn-success' onClick={ () => setShowForm(true) }>
                Editar
              </button>
            </div>
          ) }

          <div>
            { !confirmDelete && !showForm && (
              <button className='btn btn-danger' onClick={ () => setConfirmDelete(true) }>
                Eliminar
              </button>
            ) }

            { confirmDelete && (
              <div className='alert alert-danger text-center p-1 m-0'>
                ¿Estas seguro?
                <div className='d-flex'>
                  <button
                    className='btn btn-sm btn-danger mx-1'
                    onClick={ () => props.handleDeleteAccount(user?._id) }
                  >
                    Confirmar
                  </button>

                  <button
                    className='btn btn-sm btn-success mx-1'
                    onClick={ () => setConfirmDelete(false) }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) }
          </div>
        </div>

        <i className='bi bi-asterisk text-white' id='basic-addon1'></i>
        <button
          className='btn text-primary text-decoration-underline my-2'
          onClick={ () => {
            props.setShowProfile(false), props.setShowChangePasswordForm(true);
          } }
        >
          Cambiar contraseña
        </button>

        <div>
          <ToastContainer />
        </div>
      </div>
    )
  );
};

export default MyUser;
