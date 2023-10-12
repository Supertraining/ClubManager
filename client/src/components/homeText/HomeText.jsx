import ActividadesList from '../actividades/ActividadesList'
import './homeText.css'


const HomeText = () => {
  return (

    <div>

      <div className='my-3 p-4 text-center shadow'>

        <h1>
          Bienvenidos a la web app del Ranelagh Club!
        </h1>

        <h5>Desde el menu puedes reservar tu cancha desde donde estés y obtener información sobre las actividades que brindamos en el club</h5>

      </div>

      <div className='my-3 p-sm-4 shadow'>

        <h1 className='text-center'>Actividades</h1>

        <ActividadesList />

      </div>
      
    </div>
  )
}

export default HomeText