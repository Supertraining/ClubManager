import axios from '../../../utils/axiosInstance.js'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import './login.css'


const Login = () => {

  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  })

  const { loading, error, dispatch } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleClick = async () => {

    try {
      dispatch({ type: 'LOGIN_START' })

      const res = await axios.post('/login', credentials)
      console.log(res)
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })

      navigate('/')


    } catch (error) {

      dispatch({ type: 'LOGIN_FAILURE', payload: error })

    }
  }

  return (
    <div>
      <div className='d-flex align-items-center'>
        <i className="bi bi-person-check" id="basic-addon1"></i>
        <input className="form-control m-3 bg-transparent border-0 border-bottom"
          id="username"
          name='username'
          placeholder="username"
          type="email"
          onChange={handleChange}
          required />
      </div>


      <div className='d-flex align-items-center'>
        <i className="bi bi-asterisk" id="basic-addon1"></i>
        <input className="form-control m-3 bg-transparent border-0 border-bottom"
          id="password"
          name='password'
          placeholder="password"
          type="password"
          onChange={handleChange}
          required />
      </div>

      <div className='d-flex flex-wrap align-items-center justify-content-center m-3'>
        <i className="bi bi-plug"></i>
        <button className="btn btn-success bg-transparent text-black loginBtn" onClick={handleClick} disabled={loading}>Log In</button>
        {error && <div className='text-danger p-1 m-1'>Error en Usuario o Contraseña</div>}
      </div>

      <div className='d-flex align-items-center'>
        <i className="bi bi-list-check mx-1"></i>
        <Link to={'/register'} className='nav-link text-black text-decoration-underline' >Register</Link>
      </div>

    </div>
  )
}

export default Login

