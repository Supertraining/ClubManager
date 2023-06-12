import Booking from '../courtBooking/Booking'
import './football.css'

const Football = ({ court }) => {

  return (
    <div className='footballContainer'>

      <Booking court={court} />

    </div>
  )
}

export default Football