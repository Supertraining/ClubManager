import PropTypes from 'prop-types';

const ProfeAvatar = ({ name, avatar }) => (
  <span className='profe-avatar' title={`Con ${name}`}>
    <span className='profe-avatar__letter' aria-hidden='true'>{avatar}</span>
    <span className='profe-avatar__name'>Con {name}</span>
  </span>
);

ProfeAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

const ActivityTeaserCard = ({ activity }) => (
  <article className='activity-teaser card-soft'>
    <div className='activity-teaser__media'>
      <img src={activity.img} alt={activity.title} loading='lazy' />
      <span className='tag tag--mustard activity-teaser__days'>{activity.days}</span>
    </div>
    <div className='activity-teaser__body'>
      <h3 className='activity-teaser__title'>{activity.title}</h3>
      <p className='activity-teaser__desc'>{activity.desc}</p>
      <div className='activity-teaser__footer'>
        <ProfeAvatar name={activity.profe.name} avatar={activity.profe.avatar} />
      </div>
    </div>
  </article>
);

ActivityTeaserCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    days: PropTypes.string.isRequired,
    profe: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ActivityTeaserCard;
