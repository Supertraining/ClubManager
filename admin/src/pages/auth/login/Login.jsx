import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserAPI } from '../../../hooks';
import { userStore } from '../../../stores';
import { useClub } from '../../../components/club/useClub';
import './login.css';

export default function Login() {
  const { club } = useClub();
  const navigate = useNavigate();
  const { userLogin } = useUserAPI();
  const setUser = userStore(state => state.setUser);
  const ACTIONS = userStore(state => state.ACTIONS);
  const error = userStore(state => state.user.error);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const submit = async credentials => {
    try {
      await userLogin(credentials);
      navigate('/home', { replace: true });
    } catch (failure) {
      const denied = failure.status === 403 || failure.response?.status === 403;
      setUser({ type: ACTIONS.LOGIN_FAILURE, payload: denied ? 'Tu cuenta no administra este club.' : 'No pudimos iniciar sesión. Revisá tu correo y contraseña.' });
      if (denied) navigate('/failLogin', { replace: true });
    }
  };

  return (
    <main className='d-flex flex-column align-items-center login-container p-3'>
      <h1>{club.name}</h1>
      <form className='col-12 col-sm-8 col-lg-4 p-3 login-form' onSubmit={handleSubmit(submit)}>
        <h2>Ingresá al panel</h2>
        <label className='form-label' htmlFor='club-admin-email'>Correo</label>
        <input id='club-admin-email' className='form-control mb-3' type='email' required autoComplete='username' {...register('username')} />
        <label className='form-label' htmlFor='club-admin-password'>Contraseña</label>
        <input id='club-admin-password' className='form-control mb-3' type='password' required autoComplete='current-password' {...register('password')} />
        {error && <p role='alert' className='text-danger'>{error}</p>}
        <button type='submit' className='btn btn-success w-100' disabled={isSubmitting}>{isSubmitting ? 'Ingresando…' : 'Iniciá sesión'}</button>
      </form>
    </main>
  );
}
