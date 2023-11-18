import Booking from '../../courtBooking/Booking'
import './paleta.css'
import PropTypes from 'prop-types'

const Paleta = ({ court, setCourt }) => {

  return (
    <div className='paletaContainer'>

      <Booking court={court} setCourt={setCourt} />

    </div>
  )
}

Paleta.propTypes = {
  setCourt: PropTypes.func,
  court: PropTypes.string
}

export default Paleta