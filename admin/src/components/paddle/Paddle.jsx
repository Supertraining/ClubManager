import Booking from '../courtBooking/Booking'
import './paddle.css'

const Paddle = ({ court }) => {
  return (
    <div className='paddleContainer'>

    <Booking court={court} />
    
  </div>
  )
}

export default Paddle