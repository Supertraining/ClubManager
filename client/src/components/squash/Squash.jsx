import Booking from '../courtBooking/Booking'
import './squash.css'

const Squash = ({ court }) => {
  return (
    <div className='squashContainer'>

    <Booking court={court} />
    
  </div>
  )
}

export default Squash