import axios from '../../utils/axiosInstance'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './login.css'
import { useForm } from 'react-hook-form'

const Login = () => {

  const navigate = useNavigate()
  const { user, loading, error, dispatch } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (credentials) => {
    try {

      dispatch({ type: 'LOGIN_START' })

      const { data } = await axios.post('/users/login', credentials)

      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...data, permanentLog: credentials.permanentLog } })

      data.admin
        ? navigate('/home')
        : navigate('/failLogin')

    } catch (error) {

      dispatch({ type: 'LOGIN_FAILURE', payload: error })

    }
  }

  useEffect(() => {
    if (user) navigate('/home')
  }, [ user, navigate ])

  return (
    <div
      className='d-flex flex-column justify-content-center align-items-center col-12 login-container'>
      {
        user
          ? < div className="spinner-grow text-success m-5"
            role="status" ></div>
          : <>
            <h1
              className='title'>CLub Manager</h1>

            <form onSubmit={ handleSubmit(onSubmit) }
              className='col-10 col-sm-7 col-md-5 col-lg-4 col-xl-4 rounded p-3 my-3 login-form'
              autoComplete='on'
            >
              <div
                className="d-flex align-items-center">

                <i
                  className="bi bi-person-check"
                  id="basic-addon1">
                </i>

                <input
                  id="username"
                  name="username"
                  placeholder="Username"
                  className="form-control m-3 bg-transparent border-0 border-bottom"
                  type="email"
                  { ...register('username', { required: true }) }
                />

              </div>

              { errors.username && (
                <div
                  className="text-center">

                  <small
                    className="text-danger text-center">
                    Este campo es obligatorio
                  </small>

                </div>
              ) }

              <div
                className="d-flex align-items-center">

                <i
                  className="bi bi-asterisk" id="basic-addon1">
                </i>

                <input
                  autoComplete='on'
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="form-control m-3 bg-transparent border-0 border-bottom"
                  type="password"
                  { ...register('password', { required: true }) }
                />

              </div>

              { errors.password && (
                <div
                  className='text-center'>
                  <small
                    className="text-danger">
                    Este campo es obligatorio
                  </small>

                </div>
              ) }

              <div
                className="d-flex align-items-center">

                <label htmlFor="permanentLog">Recordarme</label>

                <input
                  id="permanentLog"
                  name="permanentLog"
                  className="m-3 bg-transparent border-0 border-bottom"
                  type="checkbox"
                  { ...register('permanentLog') }
                />

              </div>

              <div
                className="d-flex flex-column align-items-center justify-content-center m-3">

                <i
                  className="bi bi-plug">
                </i>

                <button
                  type="submit"
                  className="btn btn-success bg-transparent text-black loginBtn"
                  disabled={ loading }
                >
                  Log In
                </button>
                { error && (
                  <div className="text-danger p-1 m-1">
                    Error en Usuario o Contraseña
                  </div>
                ) }
              </div>

            </form>
          </>
      }
    </div>

  )
}

export default Login
