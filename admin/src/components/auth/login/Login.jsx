import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useForm } from 'react-hook-form';
import { useUserAPI } from '../../../hooks';
import { userStore } from '../../../stores/index';
import { createJSONStorage } from 'zustand/middleware';
import Spinner from '../../../../../client/src/components/spinner/Spinner';

const Login = () => {
  const navigate = useNavigate();

  const {
    user: { user, loading, error },
    setUser,
  } = userStore((state) => state);
  
  useCallback(
    (value) => {
      setUser(value);
    },
    [setUser]
  );

  useEffect(() => {
    setUser({ type: 'DEFAULT' });
  }, [setUser]);

  const { userLogin } = useUserAPI();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (credentials) => {
    try {
      userStore.persist.setOptions(
        !credentials.permanentLog
          ? {
              storage: createJSONStorage(() => sessionStorage),
            }
          : {
              storage: createJSONStorage(() => localStorage),
            }
      );

      setUser({ type: 'LOGIN_START' });

      const user = await userLogin(credentials);

      if (user?.admin) {
        setUser({
          type: 'LOGIN_SUCCESS',
          payload: { ...user },
        });

        navigate('/home');
      } else if (!user?.admin) {
        navigate('/failLogin');
      }
    } catch (error) {
      setUser({ type: 'LOGIN_FAILURE', payload: error.response.data });
    }
  };

  useEffect(() => {
    if (user !== null) navigate('/home');
    return;
  }, [navigate, setUser, user]);

  return (
    <div className='d-flex flex-column justify-content-center align-items-center col-12 login-container'>
      {user ? (
        <div
          className='spinner-grow text-success m-5'
          role='status'></div>
      ) : (
        <>
          <h1 className='title'>CLub Manager</h1>
          <p className='my-2 text-primary text-center'>
            Esta App esta desplegada en un servidor gratuito por lo que al momento de iniciar sesión
            deberás esperar unos momentos hasta que el servidor despierte.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='col-10 col-sm-7 col-md-5 col-lg-4 col-xl-4 rounded p-3 my-3 login-form'
            autoComplete='on'>
            <div className='d-flex align-items-center'>
              <i
                className='bi bi-person-check fs-4'
                id='basic-addon1'></i>

              <input
                id='username'
                name='username'
                placeholder='Username'
                className='form-control m-3 bg-transparent border-0 border-bottom'
                type='email'
                disabled={loading}
                {...register('username', { required: true })}
              />
              {loading && (
                <Spinner
                  height={'18px'}
                  width={'18px'}
                  color={'text-dark'}
                />
              )}
            </div>

            {errors.username && (
              <div className='text-center'>
                <small className='text-danger text-center'>Este campo es obligatorio</small>
              </div>
            )}

            <div className='d-flex align-items-center'>
              <i
                className='bi bi-asterisk'
                id='basic-addon1'></i>

              <input
                autoComplete='on'
                id='password'
                name='password'
                placeholder='Password'
                className='form-control m-3 bg-transparent border-0 border-bottom'
                type='password'
                disabled={loading}
                {...register('password', { required: true })}
              />
              {loading && (
                <Spinner
                  height={'18px'}
                  width={'18px'}
                  color={'text-dark'}
                />
              )}
            </div>

            {errors.password && (
              <div className='text-center'>
                <small className='text-danger'>Este campo es obligatorio</small>
              </div>
            )}

            <div className='d-flex align-items-center'>
              <label htmlFor='permanentLog'>Recordarme</label>
              <input
                id='permanentLog'
                name='permanentLog'
                className='m-3 bg-transparent border-0 border-bottom'
                type='checkbox'
                disabled={loading}
                {...register('permanentLog')}
              />
            </div>

            {loading && (
              <small className='w-100 d-flex justify-content-center text-primary fw-bold'>
                cargando por favor espere unos momentos
              </small>
            )}

            <div className='d-flex flex-column align-items-center justify-content-center m-3'>
              <i className='bi bi-plug'></i>

              <button
                type='submit'
                className='btn btn-success bg-transparent text-black loginBtn'
                disabled={loading}>
                Log In
              </button>
              {error && <div className='text-danger p-1 m-1'>{error}</div>}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
