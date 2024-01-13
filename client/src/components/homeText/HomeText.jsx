import ActividadesList from '../activities/ActividadesList'
import './homeText.css'


const HomeText = () => {
  return (

    <div>

      <div className='my-3 p-4 text-center shadow'>

        <h1>
          Bienvenidos a la app del Ranelagh Club!
        </h1>
        <h2>Esta es una versión de prueba</h2>
        <h5>Por favor, entra al menu, registrate y prueba la app</h5>
        {/* <h2>¡Hacete una cuenta y reserva tu cancha desde donde estés!</h2> */}
        {/* <h5 className='lead text-success d-none d-md-block'>Obtene información sobre las actividades que brindamos en el club o comunicate con nosotros haciendo click en el botón de WhatsApp</h5> */}

      </div>

      <div className='my-3 p-sm-4 shadow'>

        <h1 className='text-center'>Actividades</h1>

        <ActividadesList />

      </div>

    </div>
  )
}

export default HomeText