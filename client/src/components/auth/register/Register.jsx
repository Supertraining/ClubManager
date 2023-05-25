import './register.css'
import axios from '../../../utils/axiosInstance.js'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const { loading, error, dispatch } = useContext(AuthContext)

  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
    nombre: undefined,
    apellido: undefined,
    edad: undefined,
    telefono: undefined,

  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleClick = async (e) => {

    try {

      e.preventDefault()

      const res = await axios.post('/register', credentials)

      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })

      navigate('/')

    } catch (error) {

      dispatch({ type: 'LOGIN_FAILURE', payload: error })

    }


  }

  return (

    <div className="container-fluid my-5 rounded col-10 d-flex flex-column align-items-center">
      <div className='text-success text-center my-4 d-flex align-items-center'>
        <i class="bi bi-list-check mx-1 fs-4"></i>
        <h1 >REGISTER</h1>
      </div>


      <form className="form d-flex flex-column col-8" role="form" autoComplete="on"
        encType="multipart/form-data">

        <div className="input-group align-items-center">
          <div className="input-group-prepend mx-1 border rounded p-1">
            <i className="bi bi-envelope-at fs-4" id="basic-addon1"></i>
          </div>
          <input id="username" name='username' placeholder="Email" className="form-control my-2 text-center border-0 border-bottom" type="email" onChange={handleChange} required />
        </div>

        <div className="input-group align-items-center">
          <div className="input-group-prepend mx-1 border rounded p-1">
            <i className="bi bi-asterisk" id="basic-addon1"></i>
          </div>
          <input id="password" name='password' placeholder="Password" className="form-control my-2 text-center border-0 border-bottom" type="password" onChange={handleChange}
            required />
        </div>

        <div className="input-group align-items-center">
          <div className="input-group-prepend mx-1 border rounded p-1">
            <i className="bi bi-person-check fs-4" id="basic-addon1"></i>
          </div>
          <input id="nombre" name='nombre' placeholder="Nombre" className="form-control my-2 text-center border-0 border-bottom" type="text" onChange={handleChange} required />
        </div>

        <div className="input-group align-items-center">
          <div className="input-group-prepend mx-1 border rounded p-1">
            <i className="bi bi-person-check fs-4" id="basic-addon1"></i>
          </div>
          <input id="apellido" name='apellido' placeholder="Apellido" className="form-control my-2 text-center border-0 border-bottom" type="text" onChange={handleChange}
            required />
        </div>

        <div className="input-group align-items-center">
          <div className="input-group-prepend mx-1 border rounded p-1">
            <i className="bi bi-calendar-date fs-4" id="basic-addon1"></i>
          </div>
          <input id="edad" name='edad' placeholder="Edad" className="form-control my-2 text-center border-0 border-bottom" type="number" onChange={handleChange} min={0} max={99}
            required />
        </div>

        <div className="input-group align-items-center">
          <div className="input-group-prepend mx-1 border rounded p-1">
            <i className="bi bi-phone fs-4" id="basic-addon1"></i>
          </div>
          <input id="telefono" name='telefono' placeholder="Telefono" className="form-control my-2 text-center border-0 border-bottom" type="text" onChange={handleChange} required />
        </div>

        <div className="input-group my-2 justify-content-center align-items-center">
          <div className="input-group-prepend mx-2">
            <i className="bi bi-send fs-4" id="basic-addon1"></i>
          </div>
          <input className="my-2 text-center border border-success w-25 rounded bg-white text-secondary p-2" type="submit" placeholder='Registrarse' onClick={handleClick} disabled={loading} />
        </div>
      </form>
      {error && <div className='text-danger p-1 m-1'>El usuario ya existe</div>}
    </div>
  )
}

export default Register
