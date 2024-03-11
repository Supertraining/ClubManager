import Booking from '../../components/booking/Booking';
import './football.css';
import PropTypes from 'prop-types';

const Football = ({ court }) => {
  return (
    <div className='footballContainer'>
      <h1 className='court-title text-center m-0 text-success bg-white p-2'>Fútbol</h1>

      <Booking court={court} />
    </div>
  );
};

Football.propTypes = {
  court: PropTypes.string,
};

export default Football;
