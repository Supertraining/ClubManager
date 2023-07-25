import Booking from '../courtBooking/Booking'
import './football.css'

const Football = ({ court }) => {

  return (
    <div className='footballContainer'>

      <h1
        className='court-title text-center m-0 text-success bg-white p-2'>
        Fútbol
      </h1>

      <Booking court={court} />

    </div>
  )
}

export default Football