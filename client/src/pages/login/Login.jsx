import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserAPI } from '../../hooks/useUserAPI.jsx';
import Logo from '../../components/ui/Logo/Logo';
import './Login.module.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { userLogin } = useUserAPI();
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await userLogin({ username: data.username, password: data.password });
      navigate('/');
    } catch {
      // toast already shown by useUserAPI
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-card__eyebrow'>— Club Ranelagh</div>
        <h1 className='auth-card__title'>Bienvenido de vuelta.</h1>
        <p className='auth-card__sub'>
          Iniciá sesión para reservar y gestionar tus turnos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className='auth-card__form'>
          <label className='auth-label' htmlFor='username'>Email</label>
          <input
            id='username'
            type='email'
            autoComplete='username'
            className='auth-input'
            placeholder='tu@email.com'
            disabled={submitting}
            {...register('username', { required: true })}
          />
          {errors.username && <small className='text-danger'>Este campo es obligatorio</small>}

          <label className='auth-label' htmlFor='password'>Contraseña</label>
          <input
            id='password'
            type='password'
            autoComplete='current-password'
            className='auth-input'
            placeholder='Tu contraseña'
            disabled={submitting}
            {...register('password', { required: true })}
          />
          {errors.password && <small className='text-danger'>Este campo es obligatorio</small>}

          <button
            type='submit'
            className='auth-cta'
            disabled={submitting}>
            <i className='bi bi-box-arrow-in-right me-1' aria-hidden='true'></i>
            Iniciar sesión
          </button>
        </form>

        <div className='auth-card__divider'>
          <span>¿Sos nuevo en el club?</span>
        </div>

        <Link to='/register' className='auth-cta auth-cta--ghost'>
          Crear mi cuenta
        </Link>
      </div>

      <div className='auth-page__footer'>
        <Logo />
      </div>
    </div>
  );
};

import React from 'react';

export default Login;
