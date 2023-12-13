import Booking from '../courtBooking/Booking';
import './squash.css';
import PropTypes from 'prop-types';

const Squash = ({ court }) => {
  return (
    <div className='squashContainer rounded'>

      <h1
        className='court-title text-center m-0 text-success bg-white p-2'>
        Squash
      </h1>

      <Booking court={court} />

    </div>
  )
}

Squash.propTypes = {
  court : PropTypes.string
}

export default Squash