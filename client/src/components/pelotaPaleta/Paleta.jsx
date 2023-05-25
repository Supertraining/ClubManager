import Booking from '../courtBooking/Booking'
import './paleta.css'

const Paleta = ({ court }) => {

  return (
    <div className='paletaContainer'>

      <Booking court={court} />

    </div>
  )
}

export default Paleta