import Booking from '../courtBooking/Booking';
import './paleta.css';
import PropTypes from 'prop-types';

const Paleta = ({ court }) => {

  return (
    <div className='paletaContainer'>

<h1
        className='court-title text-center m-0 text-success bg-white p-2'>
        Pelota paleta
      </h1>

      <Booking court={court} />

    </div>
  )
}

Paleta.propTypes = {
  court : PropTypes.string
}


export default Paleta