import './failLogin.css'
import { Link } from 'react-router-dom'

const FailLogin = () => {
  return (
    <div className='col-12 d-flex justify-content-center align-items-center failLogin-container'>

      <div className="alert alert-danger col-4 m-auto d-flex flex-column text-center p-5" role="alert">
        <strong>USUARIO NO AUTORIZADO</strong>

        <div className='d-flex flex-column my-4'>
            Haga Click
          <Link to="/login" className="btn btn-outline-primary my-2">
            aquí
          </Link>
          para ingresar con sus credenciales
        </div>

      </div>

    </div>

  )
}

export default FailLogin