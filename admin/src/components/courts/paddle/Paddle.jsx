import Booking from '../../courtBooking/Booking'
import './paddle.css'

const Paddle = ({ court, setCourt }) => {
  return (
    <div className='paddleContainer'>

    <Booking court={court} setCourt={setCourt} />
    
  </div>
  )
}

export default Paddle