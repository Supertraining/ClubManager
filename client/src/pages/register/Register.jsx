import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { isStrongPassword } from 'validator';
import { useUserAPI } from '../../hooks/useUserAPI.jsx';
import './Register.module.css';

const PERKS = [
  'Reservas en fútbol, paddle, squash y paleta',
  'Disponibilidad de la semana en vivo',
  'Cancelá o reprogramá desde la app',
];

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { userRegister } = useUserAPI();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmationNeeded, setConfirmationNeeded] = React.useState(false);

  const onSubmit = async (data) => {
    const opts = { minLength: 8, minUppercase: 1, minNumbers: 1, minLowercase: 0, minSymbols: 0 };
    if (!isStrongPassword(data.password, opts)) {
      return;
    }
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
      <div className='auth-page'>
        <div className='auth-card'>
          <div className='auth-card__eyebrow'>— Casi listo</div>
          <h1 className='auth-card__title'>Revisá tu casilla.</h1>
          <p className='auth-card__sub'>
            Te enviamos un email de confirmación. Hacé click en el link para activar tu cuenta
            y empezar a reservar canchas.
          </p>
          <Link to='/login' className='auth-cta'>Ir a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='auth-page auth-page--split'>
      <aside className='auth-side'>
        <div className='auth-side__inner'>
          <div className='auth-side__eyebrow'>— Sumate al club</div>
          <h1 className='auth-side__title'>
            Tu cancha, tus<br />reservas, todo en<br />un solo lugar.
          </h1>
          <p className='auth-side__sub'>
            Registrarte te toma dos minutos. Vas a poder reservar canchas, ver la
            disponibilidad de la semana y gestionar tus turnos cuando quieras.
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
          <div className='auth-card__eyebrow'>Crear cuenta</div>
          <p className='auth-card__hint'>
            ¿Ya tenés cuenta? <Link to='/login'>Iniciá sesión</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='auth-form-grid'>
            <div className='auth-field auth-field--full'>
              <label className='auth-label'>Email <span className='text-danger'>*</span></label>
              <input
                type='email'
                autoComplete='username'
                className='auth-input'
                placeholder='tu@email.com'
                {...register('username', { required: true })}
              />
            </div>

            <div className='auth-field auth-field--full'>
              <label className='auth-label'>Contraseña <span className='text-danger'>*</span></label>
              <input
                type='password'
                autoComplete='new-password'
                className='auth-input'
                placeholder='Mínimo 8 caracteres'
                {...register('password', { required: true })}
              />
              <small className='auth-help'>
                Al menos 8 caracteres, una mayúscula y un número. Ejemplo: <strong>Nombre1980</strong>
              </small>
            </div>

            <div className='auth-field'>
              <label className='auth-label'>Nombre <span className='text-danger'>*</span></label>
              <input
                type='text'
                autoComplete='given-name'
                className='auth-input'
                placeholder='Tu nombre'
                {...register('nombre', { required: true })}
              />
            </div>
            <div className='auth-field'>
              <label className='auth-label'>Apellido <span className='text-danger'>*</span></label>
              <input
                type='text'
                autoComplete='family-name'
                className='auth-input'
                placeholder='Tu apellido'
                {...register('apellido', { required: true })}
              />
            </div>
            <div className='auth-field'>
              <label className='auth-label'>Edad <span className='text-danger'>*</span></label>
              <input
                type='number'
                min={12}
                max={99}
                className='auth-input'
                placeholder='30'
                {...register('edad', { required: true })}
              />
            </div>
            <div className='auth-field'>
              <label className='auth-label'>Teléfono <span className='text-danger'>*</span></label>
              <input
                type='tel'
                autoComplete='tel'
                className='auth-input'
                placeholder='+54 9 11 0000-0000'
                {...register('telefono', { required: true })}
              />
            </div>

            <button type='submit' className='auth-cta auth-field--full' disabled={submitting}>
              <i className='bi bi-person-plus me-1' aria-hidden='true'></i>
              Crear mi cuenta
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
