import './register.css';
import axios from '../../../utils/axiosInstance.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isStrongPassword } from 'validator';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
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
        minSymbols: 1,
      };

      if (!isStrongPassword(data.password, passwordValidationOptions)) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Error de contraseña' });
        return;
      }

      const res = await axios.post('/register', data);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      navigate('/');
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error });
    }
  };

  return (

    <div
      className="container-fluid my-5 rounded col-10 d-flex flex-column align-items-center">

      <div
        className='text-success text-center my-4 d-flex align-items-center'>

        <i
          className="bi bi-list-check mx-1 fs-4">
        </i>

        <h1>REGISTER</h1>

      </div>


      <form
        className="form d-flex flex-column col-8"
        role="form"
        autoComplete="on"
        onSubmit={handleSubmit(onSubmit)}
      >

        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-envelope-at fs-4" id="basic-addon1">
            </i>

          </div>

          <input
            id="username"
            name='username'
            placeholder="Email"
            className="form-control my-2 text-center border-0 border-bottom ph" type="email"
            {...register('username', { required: true })}
          />
        </div>
        {errors.username && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}
        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-asterisk"
              id="basic-addon1">
            </i>

          </div>

          <input
            id="password"
            name='password'
            placeholder="Contraseña"
            className="form-control my-2 text-center border-0 border-bottom ph" type="password"
            {...register('password', { required: true })}
          />
        </div>
        {errors.password && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}

        <small className='text-center text-success'>
          La contraseña debe tener al menos 8 caracteres y, debe incluir como mínimo una mayúscula, un número y un caracter especial
        </small>

        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-person-check fs-4"
              id="basic-addon1">
            </i>

          </div>

          <input
            id="nombre"
            name='nombre'
            placeholder="Nombre"
            className="form-control my-2 text-center border-0 border-bottom ph" type="text"
            {...register('nombre', { required: true })}
          />
        </div>
        {errors.nombre && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}

        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-person-check fs-4" id="basic-addon1">
            </i>

          </div>

          <input
            id="apellido"
            name='apellido'
            placeholder="Apellido"
            className="form-control my-2 text-center border-0 border-bottom ph" type="text"
            {...register('apellido', { required: true })}

          />
        </div>
        {errors.apellido && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}

        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-calendar-date fs-4"
              id="basic-addon1">
            </i>

          </div>

          <input
            id="edad"
            name='edad'
            placeholder="Edad"
            className="form-control my-2 text-center border-0 border-bottom ph" type="number"
            min={0} max={99}
            {...register('edad', { required: true })}
          />
        </div>
        {errors.edad && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}

        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-phone fs-4" id="basic-addon1">
            </i>

          </div>

          <input
            id="telefono"
            name='telefono'
            placeholder="Telefono"
            className="form-control my-2 text-center border-0 border-bottom ph" type="text"
            {...register('telefono', { required: true })}
          />
        </div>
        {errors.telefono && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}

        <div
          className="input-group my-2 justify-content-center align-items-center">

          <div
            className="input-group-prepend mx-2">

            <i
              className="bi bi-send fs-4" id="basic-addon1">
            </i>

          </div>

          <input
            className="my-2 text-center border border-success w-25 rounded bg-white text-secondary p-2"
            type="submit"
            value='Registrarme'
            disabled={loading}
          />

        </div>

      </form>

      {error && <div className='text-danger p-1 m-1'>
        Ha ocurrido un error, por favor vuelva a intentarlo
      </div>}

    </div>
  )
}

export default Register
