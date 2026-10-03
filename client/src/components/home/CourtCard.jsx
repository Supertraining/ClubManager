import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CourtCard = ({ court }) => {
  const pills = court.pills || [];
  return (
    <Link to={`/reserves?court=${court.name}`} className='court-card card-soft card-soft--interactive'>
      <div className='court-card__media'>
        <img src={court.image} alt={court.displayName || court.name} loading='lazy' />
        <span className='court-card__badge tag tag--inverse'>
          <i className='bi bi-trophy' aria-hidden='true'></i>
          {(court.surface || 'CANCHA').toUpperCase()}
        </span>
      </div>
      <div className='court-card__body'>
        <h3 className='court-card__title'>{court.displayName || court.name}</h3>
        <p className='court-card__desc'>{court.description}</p>
        <ul className='court-card__pills'>
          {pills.map((p) => (
            <li key={p}>
              <i className='bi bi-check2' aria-hidden='true'></i>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className='court-card__footer'>
        <span className='court-card__cta'>
          Ver disponibilidad
          <i className='bi bi-arrow-right' aria-hidden='true'></i>
        </span>
      </div>
    </Link>
  );
};

CourtCard.propTypes = {
  court: PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string,
    image: PropTypes.string,
    surface: PropTypes.string,
    description: PropTypes.string,
    pills: PropTypes.array,
  }).isRequired,
};

export default CourtCard;
