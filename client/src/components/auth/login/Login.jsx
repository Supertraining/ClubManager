import axios from '../../../utils/axiosInstance.js'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import './login.css'
import { useForm } from 'react-hook-form'

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const { loading, error, dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      dispatch({ type: 'LOGIN_START' })

      const res = await axios.post('/login', data)
    
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })

      navigate('/')
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center">
          <i className="bi bi-person-check" id="basic-addon1"></i>
          <input
            id="username"
            name="username"
            placeholder="Username"
            className="form-control m-3 bg-transparent border-0 border-bottom"
            type="email"
            {...register('username', { required: true })}
          />
        </div>
        {errors.username && (
          <div className="text-center">
            <small className="text-danger text-center">
              Este campo es obligatorio
            </small>
          </div>
        )}

        <div className="d-flex align-items-center">
          <i className="bi bi-asterisk" id="basic-addon1"></i>
          <input
            id="password"
            name="password"
            placeholder="Password"
            className="form-control m-3 bg-transparent border-0 border-bottom"
            type="password"
            {...register('password', { required: true })}
          />
        </div>
        {errors.password && (
          <div className='text-center'>
            <small className="text-danger">
              Este campo es obligatorio
            </small>
          </div>

        )}

        <div className="d-flex flex-column align-items-center justify-content-center m-3">
          <i className="bi bi-plug"></i>
          <button
            type="submit"
            className="btn btn-success bg-transparent text-black loginBtn"
            disabled={loading}
          >
            Log In
          </button>
          {error && (
            <div className="text-danger p-1 m-1">
              Error en Usuario o Contraseña
            </div>
          )}
        </div>
      </form>
      
      <div className="d-flex align-items-center">
        <i className="bi bi-list-check mx-1"></i>
        <Link
          to={'/register'}
          className="nav-link text-black text-decoration-underline"
        >
          Register
        </Link>
      </div>
    </div>
  )
}

export default Login
