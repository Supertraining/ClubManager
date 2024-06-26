import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import './login.css';
import { useAxiosInstance } from '../../../../hooks/useAxiosInstance.jsx';
import { userStore } from '../../../../stores/index.js';
import Spinner from '../../../spinner/Spinner.jsx';
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const axios = useAxiosInstance();

  const {
    setUser,
    user: { loading, error },
    ACTIONS,
  } = userStore();

  const onSubmit = async (data) => {
    try {
      setUser({ type: ACTIONS.LOGIN_START });

      const { data: token } = await axios.post('/users/login', data);

      const decoded = jwtDecode(token);

      const user = { ...decoded, token: token };

      setUser({ type: ACTIONS.LOGIN_SUCCESS, payload: user });

      navigate('/');
    } catch (error) {
      setUser({ type: ACTIONS.LOGIN_FAILURE, payload: error.response.data });
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
            disabled={loading}
            {...register('username', { required: true })}
          />
          {loading && (
            <Spinner
              height={'18px'}
              width={'18px'}
              color={'text-success'}
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
            className='bi bi-asterisk text-white'
            id='basic-addon1'></i>
          <input
            id='password'
            name='password'
            placeholder='Contraseña'
            className='form-control m-3 bg-transparent border-0 border-bottom text-white'
            type='password'
            autoComplete='on'
            disabled={loading}
            {...register('password', { required: true })}
          />
          {loading && (
            <Spinner
              height={'18px'}
              width={'18px'}
              color={'text-success'}
            />
          )}
        </div>
        {errors.password && (
          <div className='text-center'>
            <small className='text-danger'>Este campo es obligatorio</small>
          </div>
        )}
        {loading && (
          <small className='w-100 d-flex justify-content-center text-success'>
            cargando por favor espere unos momentos
          </small>
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
