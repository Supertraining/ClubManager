import Booking from '../courtBooking/Booking'
import './football.css'

const Football = ({ id }) => {

  return (
    <div className='footballContainer'>

      <Booking id={id} />

    </div>
  )
}

export default Football