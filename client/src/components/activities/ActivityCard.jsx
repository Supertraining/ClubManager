import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ActivityCard.css';

const ProfeAvatar = ({ name = '', avatar = '' }) => (
  <span className='activity-card__profe' title={`Con ${name}`}>
    <span className='activity-card__profe-letter' aria-hidden='true'>{avatar}</span>
    <span className='activity-card__profe-name'>Con {name}</span>
  </span>
);

ProfeAvatar.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
};

/**
 * ActivityCard — tarjeta de actividad con foto, profe con cara, días y CTA.
 *
 * Diseñada para la página /activities y para el "Esto se viene en el club" del Home.
 */
const ActivityCard = ({ activity, compact = false, onOpen }) => {
  const { title, description, img, imgText, profe, days, hours, court, href, targetCourt } = activity;

  const handleClick = (e) => {
    if (onOpen) {
      e.preventDefault();
      onOpen(activity);
    }
  };

  const innerHref = targetCourt
    ? `/reserves?court=${targetCourt}`
    : (href || '#');

  return (
    <article className={`activity-card${compact ? ' activity-card--compact' : ''}`}>
      <Link to={innerHref} onClick={handleClick} className='activity-card__media-link'>
        <div className='activity-card__media'>
          <img src={img} alt={imgText || title} loading='lazy' />
          {days && <span className='tag tag--mustard activity-card__days'>{days}</span>}
        </div>
      </Link>
      <div className='activity-card__body'>
        <h3 className='activity-card__title'>{title}</h3>
        <p className='activity-card__desc'>{description}</p>
        {hours && (
          <p className='activity-card__hours'>
            <i className='bi bi-clock' aria-hidden='true'></i>
            {hours}
          </p>
        )}
        <div className='activity-card__footer'>
          {profe && <ProfeAvatar name={profe.name} avatar={profe.avatar} />}
          {court && (
            <span className='tag tag--brand activity-card__court'>{court}</span>
          )}
        </div>
        <div className='activity-card__cta'>
          <Link to={innerHref} onClick={handleClick} className='btn btn--brand btn--sm btn--pill'>
            {targetCourt ? 'Reservar cancha' : 'Ver más'}
            <i className='bi bi-arrow-right' aria-hidden='true'></i>
          </Link>
        </div>
      </div>
    </article>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    img: PropTypes.string,
    imgText: PropTypes.string,
    profe: PropTypes.shape({ name: PropTypes.string, avatar: PropTypes.string }),
    days: PropTypes.string,
    hours: PropTypes.string,
    court: PropTypes.string,
    href: PropTypes.string,
    targetCourt: PropTypes.string,
  }).isRequired,
  compact: PropTypes.bool,
  onOpen: PropTypes.func,
};

export default ActivityCard;
