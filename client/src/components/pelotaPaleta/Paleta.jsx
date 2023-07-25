import Booking from '../courtBooking/Booking'
import './paleta.css'

const Paleta = ({ court }) => {

  return (
    <div className='paletaContainer'>

<h1
        className='court-title text-center m-0 text-success bg-white p-2'>
        Pelota paleta
      </h1>

      <Booking court={court} />

    </div>
  )
}

export default Paleta