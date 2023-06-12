import Booking from '../courtBooking/Booking'
import './squash.css'

const Squash = ({ court, setCourt, handleDeleteReserve }) => {
  return (
    <div className='squashContainer'>

      <Booking court={court} setCourt={setCourt} />

    </div>
  )
}

export default Squash