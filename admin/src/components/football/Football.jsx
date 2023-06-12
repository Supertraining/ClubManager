import Booking from '../courtBooking/Booking'
import './football.css'

const Football = ({ setCourt, court, handleDeleteReserve  }) => {

  return (
    <div className='footballContainer'>

      <Booking court={court} setCourt={setCourt} />

    </div>
  )
}

export default Football