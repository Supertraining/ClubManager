import Booking from '../courtBooking/Booking'
import './paddle.css'

const Paddle = ({ court }) => {
  return (
    <div className='paddleContainer'>

<h1
        className='court-title text-center m-0 text-success bg-white p-2'>
        Paddle
      </h1>

    <Booking court={court} />
    
  </div>
  )
}

export default Paddle