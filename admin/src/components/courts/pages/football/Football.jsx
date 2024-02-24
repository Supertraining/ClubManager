import Booking from '../../components/booking/Booking';
import './football.css';
import PropTypes from 'prop-types';
const Football = ({ setCourt, court }) => {
  return (
    <div className='footballContainer'>
      <Booking
        court={court}
        setCourt={setCourt}
      />
    </div>
  );
};

Football.propTypes = {
  setCourt: PropTypes.func,
  court: PropTypes.string,
};
export default Football;
