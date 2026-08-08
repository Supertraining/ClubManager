import { ToastContainer } from 'react-toastify';
import './myUser.css';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import { userStore } from '../../../../stores';
import { useUserAPI } from '../../../../hooks/useUserAPI.jsx';

const MyUser = (props) => {
  const { user: identity } = userStore((s) => s.user);
  const { getUserById } = useUserAPI();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [credentials, setCredentials] = useState({
    first_name: '',
    last_name: '',
    age: '',
    phone: '',
  });

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!identity?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getUserById(identity.id);
      if (!cancelled) {
        setProfile(data);
        setCredentials({
          first_name: data?.first_name ?? '',
          last_name: data?.last_name ?? '',
          age: data?.age ?? '',
          phone: data?.phone ?? '',
        });
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [identity?.id, getUserById]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!identity) {
    return (
      <div className='rounded bg-dark p-2 text-center text-white'>
        Iniciá sesión para ver tu perfil.
      </div>
    );
  }

  if (loading) {
    return (
      <div className='rounded bg-dark p-2 text-center text-white'>Cargando...</div>
    );
  }

  return (
    profile && (
      <div
        ref={ref}
        className={inView ? 'myUserContainer rounded p-2' : undefined}>
        <h6 className='text-white'>Datos de mi cuenta:</h6>

        <ul>
          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Email: </b>
            <span className='text-white'>{profile.email}</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Nombre: </b>
            <span className='text-white'>{profile.first_name}</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Apellido: </b>
            <span className='text-white'>{profile.last_name}</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Edad: </b>
            <span className='text-white'>{profile.age} años</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Teléfono: </b>
            <span className='text-white'>{profile.phone}</span>
          </li>

          <li>
            <i className='bi bi-caret-right-fill text-info'></i>
            <b className='text-success'>Rol: </b>
            <span className='text-white'>{profile.role}</span>
          </li>
        </ul>

        {showForm && (
          <>
            <form className='text-center d-flex flex-column align-items-center justify-content-center col-10'>
              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='first_name'
                  id='first_name'
                  placeholder='Nombre'
                  value={credentials.first_name}
                  onChange={handleChange}
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='last_name'
                  id='last_name'
                  placeholder='Apellido'
                  value={credentials.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='number'
                  min={12}
                  max={99}
                  name='age'
                  id='age'
                  placeholder='Edad'
                  value={credentials.age}
                  onChange={handleChange}
                />
              </div>

              <div className='d-flex align-items-center'>
                <i className='bi bi-pen text-white'></i>
                <input
                  className='mx-2 text-warning text-center border rounded bg-success mt-1 col-12 input-text'
                  type='text'
                  name='phone'
                  id='phone'
                  placeholder='Teléfono'
                  value={credentials.phone}
                  onChange={handleChange}
                />
              </div>
            </form>
            <div className='d-flex justify-content-center col-12 mt-2'>
              <button
                className='btn btn-sm btn-outline-danger m-1'
                onClick={(e) => {
                  props.handleUpdateUser(e, {
                    first_name: credentials.first_name,
                    last_name: credentials.last_name,
                    age: Number(credentials.age),
                    phone: credentials.phone,
                  });
                  setShowForm(false);
                }}>
                Actualizar
              </button>

              <button
                className='btn btn-sm btn-outline-success m-1'
                onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </>
        )}

        <div className='d-flex justify-content-evenly align-items-center'>
          {!showForm && !confirmDelete && (
            <div>
              <button className='btn btn-success' onClick={() => setShowForm(true)}>
                Editar
              </button>
            </div>
          )}

          <div>
            {!confirmDelete && !showForm && (
              <button className='btn btn-danger' onClick={() => setConfirmDelete(true)}>
                Eliminar
              </button>
            )}

            {confirmDelete && (
              <div className='alert alert-danger text-center p-1 m-0'>
                ¿Estas seguro?
                <div className='d-flex'>
                  <button
                    className='btn btn-sm btn-danger mx-1'
                    onClick={() => props.handleDeleteAccount({ id: identity.id, email: identity.email })}>
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
          </div>
        </div>

        <i className='bi bi-asterisk text-white' id='basic-addon1'></i>
        <button
          className='btn text-primary text-decoration-underline my-2'
          onClick={() => {
            props.setShowProfile(false), props.setShowChangePasswordForm(true);
          }}>
          Cambiar contraseña
        </button>

        <div>
          <ToastContainer />
        </div>
      </div>
    )
  );
};

MyUser.propTypes = {
  handleDeleteAccount: PropTypes.func.isRequired,
  handleUpdateUser: PropTypes.func.isRequired,
  setShowChangePasswordForm: PropTypes.func.isRequired,
  setShowProfile: PropTypes.func.isRequired,
};

export default MyUser;
