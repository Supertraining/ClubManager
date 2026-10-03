import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { isStrongPassword } from 'validator';
import { useUserAPI } from '../../hooks/useUserAPI.jsx';
import './Register.css';

const PERKS = [
  'Reservas en fútbol, paddle, squash y paleta',
  'Disponibilidad de la semana en vivo',
  'Cancelá o reprogramá desde la app',
  'Sin llamadas, sin planilla',
];

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { userRegister } = useUserAPI();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmationNeeded, setConfirmationNeeded] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(null);

  const onSubmit = async (data) => {
    const opts = { minLength: 8, minUppercase: 1, minNumbers: 1, minLowercase: 0, minSymbols: 0 };
    if (!isStrongPassword(data.password, opts)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }
    setPasswordError(null);
    try {
      setSubmitting(true);
      const result = await userRegister({
        username: data.username,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        edad: Number(data.edad),
        telefono: data.telefono,
      });
      if (result?.requiresEmailConfirmation) {
        setConfirmationNeeded(true);
        return;
      }
      navigate('/');
    } catch {
      // toast already shown
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmationNeeded) {
    return (
      <div className='auth-page--register'>
        <div className='auth-card auth-card--narrow'>
          <div className='auth-card__eyebrow eyebrow eyebrow--brand'>— Casi listo</div>
          <h2 className='auth-card__title'>Revisá tu casilla.</h2>
          <p className='auth-card__sub'>
            Te enviamos un email de confirmación. Hacé click en el link para
            activar tu cuenta y empezar a reservar canchas.
          </p>
          <Link to='/login' className='btn btn--primary btn--block btn--lg btn--pill'>
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='auth-page--register'>
      <aside className='auth-side'>
        <div className='auth-side__inner'>
          <span className='eyebrow eyebrow--inverse auth-side__eyebrow'>— Sumate al club</span>
          <h1 className='auth-side__title'>
            Tu cancha, tus<br />reservas, todo en<br />un solo lugar.
          </h1>
          <p className='auth-side__sub'>
            Registrarte te toma dos minutos. Vas a poder reservar canchas, ver
            la disponibilidad de la semana y gestionar tus turnos cuando quieras.
          </p>
          <ul className='auth-side__perks'>
            {PERKS.map((p) => (
              <li key={p}>
                <i className='bi bi-check2-circle' aria-hidden='true'></i>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className='auth-form-side'>
        <div className='auth-card auth-card--wide'>
          <div className='auth-card__eyebrow eyebrow eyebrow--brand'>— Crear cuenta</div>
          <p className='auth-card__hint'>
            ¿Ya tenés cuenta? <Link to='/login'>Iniciá sesión</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='auth-form-grid'>
            <div className='auth-field auth-field--full'>
              <label className='input-label'>Email <span className='text-danger'>*</span></label>
              <input
                type='email'
                autoComplete='username'
                className={`input${errors.username ? ' input--error' : ''}`}
                placeholder='tu@email.com'
                {...register('username', { required: true })} />
              {errors.username && <small className='input-help input-help--error'>Este campo es obligatorio.</small>}
            </div>

            <div className='auth-field auth-field--full'>
              <label className='input-label'>Contraseña <span className='text-danger'>*</span></label>
              <input
                type='password'
                autoComplete='new-password'
                className={`input${errors.password || passwordError ? ' input--error' : ''}`}
                placeholder='Mínimo 8 caracteres'
                {...register('password', { required: true })} />
              <small className={`input-help${passwordError ? ' input-help--error' : ''}`}>
                {passwordError || 'Al menos 8 caracteres, una mayúscula y un número. Ejemplo: Nombre1980'}
              </small>
            </div>

            <div className='auth-field'>
              <label className='input-label'>Nombre <span className='text-danger'>*</span></label>
              <input
                type='text'
                autoComplete='given-name'
                className={`input${errors.nombre ? ' input--error' : ''}`}
                placeholder='Tu nombre'
                {...register('nombre', { required: true })} />
            </div>
            <div className='auth-field'>
              <label className='input-label'>Apellido <span className='text-danger'>*</span></label>
              <input
                type='text'
                autoComplete='family-name'
                className={`input${errors.apellido ? ' input--error' : ''}`}
                placeholder='Tu apellido'
                {...register('apellido', { required: true })} />
            </div>
            <div className='auth-field'>
              <label className='input-label'>Edad <span className='text-danger'>*</span></label>
              <input
                type='number'
                min={12}
                max={99}
                className={`input${errors.edad ? ' input--error' : ''}`}
                placeholder='30'
                {...register('edad', { required: true })} />
            </div>
            <div className='auth-field'>
              <label className='input-label'>Teléfono <span className='text-danger'>*</span></label>
              <input
                type='tel'
                autoComplete='tel'
                className={`input${errors.telefono ? ' input--error' : ''}`}
                placeholder='+54 9 11 0000-0000'
                {...register('telefono', { required: true })} />
            </div>

            <button type='submit' className='btn btn--primary btn--block btn--lg btn--pill auth-field--full auth-form__cta' disabled={submitting}>
              {submitting ? 'Creando…' : (
                <>
                  <i className='bi bi-person-plus' aria-hidden='true'></i>
                  Crear mi cuenta
                </>
              )}
            </button>

            <p className='auth-terms auth-field--full'>
              Al registrarte aceptás los términos y condiciones del Club Ranelagh.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
export default Register;
