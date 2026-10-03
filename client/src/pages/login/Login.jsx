import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserAPI } from '../../hooks/useUserAPI.jsx';
import Logo from '../../components/ui/Logo/Logo';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/';
  const { userLogin } = useUserAPI();
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await userLogin({ username: data.username, password: data.password });
      navigate(next, { replace: true });
    } catch {
      // toast already shown by useUserAPI
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='auth-page auth-page--login'>
      <aside className='auth-side'>
        <div className='auth-side__inner'>
          <Logo compact={false} variant='inverse' />
          <span className='eyebrow eyebrow--inverse auth-side__eyebrow'>— Volvé al club</span>
          <h1 className='auth-side__title'>Bienvenido<br />de vuelta.</h1>
          <p className='auth-side__sub'>
            Iniciá sesión para reservar canchas, ver tus turnos y gestionar
            tus actividades cuando quieras.
          </p>
          <ul className='auth-side__perks'>
            <li><i className='bi bi-check2-circle' aria-hidden='true'></i>Reservas en dos pasos</li>
            <li><i className='bi bi-check2-circle' aria-hidden='true'></i>Disponibilidad de la semana en vivo</li>
            <li><i className='bi bi-check2-circle' aria-hidden='true'></i>Cancelá o reprogramá cuando quieras</li>
          </ul>
        </div>
      </aside>

      <section className='auth-form-side'>
        <div className='auth-card'>
          <div className='auth-card__eyebrow eyebrow eyebrow--brand'>— Iniciar sesión</div>
          <h2 className='auth-card__title'>Tu cuenta, un paso.</h2>
          <p className='auth-card__sub'>
            Ingresá con tu email y contraseña del club.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
            <div className='auth-field'>
              <label className='input-label' htmlFor='username'>Email</label>
              <input
                id='username'
                type='email'
                autoComplete='username'
                className={`input${errors.username ? ' input--error' : ''}`}
                placeholder='tu@email.com'
                disabled={submitting}
                {...register('username', { required: true })} />
              {errors.username && <small className='input-help input-help--error'>Este campo es obligatorio.</small>}
            </div>

            <div className='auth-field'>
              <label className='input-label' htmlFor='password'>Contraseña</label>
              <input
                id='password'
                type='password'
                autoComplete='current-password'
                className={`input${errors.password ? ' input--error' : ''}`}
                placeholder='Tu contraseña'
                disabled={submitting}
                {...register('password', { required: true })} />
              {errors.password && <small className='input-help input-help--error'>Este campo es obligatorio.</small>}
            </div>

            <button
              type='submit'
              className='btn btn--primary btn--block btn--lg btn--pill auth-form__cta'
              disabled={submitting}>
              {submitting ? 'Ingresando…' : (
                <>
                  <i className='bi bi-box-arrow-in-right' aria-hidden='true'></i>
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          <div className='auth-card__divider'>
            <span>¿Sos nuevo en el club?</span>
          </div>

          <Link to='/register' className='btn btn--ghost btn--block btn--lg btn--pill'>
            Crear mi cuenta
          </Link>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
export default Login;
