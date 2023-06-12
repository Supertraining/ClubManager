import Booking from '../courtBooking/Booking'
import './paleta.css'

const Paleta = ({ court, setCourt, handleDeleteReserve }) => {

  return (
    <div className='paletaContainer'>

      <Booking court={court} setCourt={setCourt} />

    </div>
  )
}

export default Paleta