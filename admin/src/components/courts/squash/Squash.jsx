import Booking from '../../courtBooking/Booking'
import './squash.css'
import PropTypes from 'prop-types'


const Squash = ({ court, setCourt }) => {
  return (
    <div className='squashContainer'>

      <Booking court={court} setCourt={setCourt} />

    </div>
  )
}

Squash.propTypes = {
  setCourt: PropTypes.func,
  court: PropTypes.string
}

export default Squash