import Booking from '../../courtBooking/Booking'
import './paddle.css'
import PropTypes from 'prop-types'

const Paddle = ({ court, setCourt }) => {
  return (
    <div className='paddleContainer'>

    <Booking court={court} setCourt={setCourt} />
    
  </div>
  )
}

Paddle.propTypes = {
  setCourt: PropTypes.func,
  court: PropTypes.string
}

export default Paddle