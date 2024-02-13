import './register.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isStrongPassword } from 'validator';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import useAxiosInstance from '../../../hooks/useAxiosInstance.jsx';

const Register = () => {
  const { loading, error, dispatch } = useContext(AuthContext);
  const [welcomeMessage, setWelcomeMessage] = useState(false);

  const navigate = useNavigate();
  const axios = useAxiosInstance();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const passwordValidationOptions = {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      };

      if (!isStrongPassword(data.password, passwordValidationOptions)) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Error de contraseña' });
        return;
      }

      const res = await axios.post('/users/register', data);

      const decoded = jwtDecode(res.data);

      const user = { ...decoded, token: res.data };
     
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });

      setWelcomeMessage(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.log(error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data });
    }
  };

  return (
    <div className='my-5 rounded col-12 d-flex flex-column align-items-center'>
      {!welcomeMessage && (
        <>
          <div className='text-success text-center my-4 d-flex align-items-center'>
            <i className='bi bi-list-check mx-1 fs-4'></i>

            <h1>¡SUMATE A NUESTRA APP!</h1>
          </div>

          <form
            className='form d-flex flex-column align-items-center col-12 col-sm-8 col-md-6'
            role='form'
            autoComplete='on'
            onSubmit={handleSubmit(onSubmit)}>
            <div className='input-group align-items-center'>
              <div className='input-group-prepend mx-1 border rounded p-1'>
                <i
                  className='bi bi-envelope-at fs-4'
                  id='basic-addon2'></i>
              </div>

              <input
                id='userName'
                name='username'
                placeholder='Email'
                autoComplete='username'
                className='form-control my-2 text-center border-0 border-bottom ph'
                type='email'
                {...register('username', { required: true })}
              />
            </div>
            {errors.username && (
              <small className='text-danger text-center'>Este campo es obligatorio</small>
            )}
            <div className='input-group align-items-center'>
              <div className='input-group-prepend mx-1 border rounded p-1'>
                <i
                  className='bi bi-asterisk'
                  id='basic-addon2'></i>
              </div>

              <input
                id='passWord'
                name='password'
                placeholder='Contraseña'
                className='form-control my-2 text-center border-0 border-bottom ph'
                type='password'
                autoComplete='current-password'
                {...register('password', { required: true })}
              />
            </div>

            <small className='text-success col-9 text-center'>
              La contraseña debe tener al menos 8 caracteres y, debe incluir como mínimo una
              MAYÚSCULA, y un número.{' '}
              <strong>
                <i className='text-decoration-underline'>Ejemplo:</i> Nombre1980
              </strong>
            </small>

            {errors.password && (
              <small className='text-danger text-center'>Este campo es obligatorio</small>
            )}

            <div className='input-group align-items-center'>
              <div className='input-group-prepend mx-1 border rounded p-1'>
                <i
                  className='bi bi-person-check fs-4'
                  id='basic-addon2'></i>
              </div>

              <input
                id='nombre'
                name='nombre'
                placeholder='Nombre'
                className='form-control my-2 text-center border-0 border-bottom ph'
                type='text'
                {...register('nombre', { required: true })}
              />
            </div>
            {errors.nombre && (
              <small className='text-danger text-center'>Este campo es obligatorio</small>
            )}

            <div className='input-group align-items-center'>
              <div className='input-group-prepend mx-1 border rounded p-1'>
                <i
                  className='bi bi-person-check fs-4'
                  id='basic-addon2'></i>
              </div>

              <input
                id='apellido'
                name='apellido'
                placeholder='Apellido'
                className='form-control my-2 text-center border-0 border-bottom ph'
                type='text'
                {...register('apellido', { required: true })}
              />
            </div>
            {errors.apellido && (
              <small className='text-danger text-center'>Este campo es obligatorio</small>
            )}

            <div className='input-group align-items-center'>
              <div className='input-group-prepend mx-1 border rounded p-1'>
                <i
                  className='bi bi-calendar-date fs-4'
                  id='basic-addon2'></i>
              </div>

              <input
                id='edad'
                name='edad'
                placeholder='Edad'
                className='form-control my-2 text-center border-0 border-bottom ph'
                type='number'
                min={0}
                max={99}
                {...register('edad', { required: true })}
              />
            </div>
            {errors.edad && (
              <small className='text-danger text-center'>Este campo es obligatorio</small>
            )}

            <div className='input-group align-items-center'>
              <div className='input-group-prepend mx-1 border rounded p-1'>
                <i
                  className='bi bi-phone fs-4'
                  id='basic-addon2'></i>
              </div>

              <input
                id='telefono'
                name='telefono'
                placeholder='Telefono'
                className='form-control my-2 text-center border-0 border-bottom ph'
                type='text'
                {...register('telefono', { required: true })}
              />
            </div>
            {errors.telefono && (
              <small className='text-danger text-center'>Este campo es obligatorio</small>
            )}

            <div className='input-group my-2 justify-content-center align-items-center'>
              <div className='input-group-prepend mx-2'>
                <i
                  className='bi bi-send fs-4'
                  id='basic-addon2'></i>
              </div>

              <input
                className='my-2 text-center border border-success col-6 rounded bg-white text-secondary p-2 register-Btn'
                type='submit'
                value='Registrarme'
                disabled={loading}
              />
            </div>
          </form>
        </>
      )}

      {error && <div className='text-danger p-1 m-1'>{error}</div>}

      {welcomeMessage && (
        <div className=' rounded p-4 col-6 welcome-background d-flex  align-items-center justify-content-center'>
          <h1 className='welcome-title text-success'>¡Bienvenido!</h1>
        </div>
      )}
    </div>
  );
};

export default Register;
