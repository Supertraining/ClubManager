import axios from '../../../utils/axiosInstance.js';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import './login.css';
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      dispatch({ type: 'LOGIN_START' });
     
      const res = await axios.post('/users/login', data);

      const decoded = jwtDecode(res.data)

      const user = {...decoded, token: res.data}

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });

      navigate('/');
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='d-flex align-items-center'>
          <i
            className='bi bi-person-check text-white fs-5'
            id='basic-addon2'></i>

          <input
            id='username'
            name='username'
            placeholder='Usuario'
            className='form-control m-3 bg-transparent border-0 border-bottom text-white'
            type='email'
            autoComplete='on'
            {...register('username', { required: true })}
          />
        </div>
        {errors.username && (
          <div className='text-center'>
            <small className='text-danger text-center'>Este campo es obligatorio</small>
          </div>
        )}

        <div className='d-flex align-items-center'>
          <i
            className='bi bi-asterisk text-white'
            id='basic-addon1'></i>
          <input
            id='password'
            name='password'
            placeholder='Contraseña'
            className='form-control m-3 bg-transparent border-0 border-bottom text-white'
            type='password'
            autoComplete='on'
            {...register('password', { required: true })}
          />
        </div>
        {errors.password && (
          <div className='text-center'>
            <small className='text-danger'>Este campo es obligatorio</small>
          </div>
        )}

        <div className='d-flex flex-column align-items-center justify-content-center m-3'>
          <i className='fa-solid fa-plug-circle-check text-white my-2'></i>

          <button
            type='submit'
            className='btn btn-success bg-transparent text-black login-Btn text-white'
            disabled={loading}>
            Iniciar sesión
          </button>

          {error && <div className='text-danger p-1 m-1'>{error}</div>}
        </div>
      </form>

      <div className='d-flex align-items-center'>
        <i className='bi bi-list-check mx-1'></i>
        <Link
          to={'/register'}
          className='nav-link'>
          <button
            className='text-decoration-underline text-white btn'
            data-bs-toggle='offcanvas'>
            Registrarme
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
