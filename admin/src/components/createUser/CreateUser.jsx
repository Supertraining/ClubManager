import './createUser.css'
import axios from '../../utils/axiosInstance.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';


const CreateUser = ({ setMenu, menu }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const notify = () => toast.success("User Created", { autoClose: 1000 });


  const onSubmit = async (data) => {

    try {

      await axios.post('/register', data);
      notify();

    } catch (error) {

      console.log(error)

    }

  };

  return (

    <div
      className="rounded col-9 d-flex flex-column align-items-center p-1">

      <div
        className='col-12 my-3'>

        <Link
          to={'/'}
          className='btn btn-close border border-dark p-2'
          onClick={() => setMenu({ ...menu, main: true, createUser: false })}>
        </Link>

      </div>

      <div
        className='text-success text-center my-4 d-flex align-items-center'>

        <i
          className="bi bi-list-check mx-1 fs-4">
        </i>

        <h1>
          REGISTER
        </h1>

      </div>

      <div>
        <ToastContainer />
      </div>


      <form
        className="form d-flex flex-column col-8"
        role="form"
        autoComplete="on"
        onSubmit={handleSubmit(onSubmit)}>

        <div
          className="input-group align-items-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-envelope-at fs-4"
              id="basic-addon1">
            </i>

          </div>

          <input
            id="username"
            name='username'
            placeholder="Email"
            className="form-control my-2 text-center border-0 border-bottom" type="email"
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
            placeholder="Password"
            className="form-control my-2 text-center border-0 border-bottom" type="password"
            {...register('password', { required: true })}
          />

        </div>
        {errors.password && (
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
            id="nombre"
            name='nombre'
            placeholder="Nombre"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
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
              className="bi bi-person-check fs-4"
              id="basic-addon1">
            </i>

          </div>

          <input
            id="apellido"
            name='apellido'
            placeholder="Apellido"
            className="form-control my-2 text-center border-0 border-bottom"
            type="text"
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
            className="form-control my-2 text-center border-0 border-bottom" type="number"
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
              className="bi bi-phone fs-4"
              id="basic-addon1">
            </i>

          </div>

          <input
            id="telefono"
            name='telefono'
            placeholder="Telefono"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            {...register('telefono', { required: true })}
          />

        </div>
        {errors.telefono && (
          <small className="text-danger text-center">Este campo es obligatorio</small>
        )}

        <div
          className="input-group align-items-center justify-content-center">

          <div
            className="input-group-prepend mx-1 border rounded p-1">

            <i
              className="bi bi-sunglasses fs-4">
            </i>

          </div>

          <div
            className="custom-control custom-checkbox mx-1">

            <input
              type="checkbox"
              name='admin'
              className="custom-control-input"
              id="customCheck1"
              value={true}
              {...register('admin', { required: true })}
            />

            <label
              className="custom-control-label mx-1 text-danger" htmlFor="customCheck1">
              Admin
            </label>

          </div>

        </div>

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
            value='Crear usuario'
          />

        </div>

      </form>

    </div>
  )
}

export default CreateUser
