import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const ActivityCard = ({ img, imgText, title, description, data_target, handleDeleteActivity, id }) => {
  return (
    <div className='card-wrapper mx-1 shadow'>
      <div className='card'>
        <span className='text-center'>{id}</span>
        <img
          className='card-img p-2'
          src={img || 'https://picsum.photos/id/237/300/300'}
          alt={imgText}
        />
        <div className='card-body'>
          <h5 className='card-title fw-bold'>{title}</h5>
          <p className='card-text'>{description}</p>
        </div>
        <div className='card-footer d-flex align-items-center justify-content-between'>
          <Link
            data-bs-toggle='modal'
            data-bs-target={data_target}
            className={
              data_target?.length == 0
                ? `card-link text-decoration-none text-success border rounded p-2 disabled`
                : `card-link text-decoration-none text-success border rounded p-2`
            }>
            <i className='bi bi-calendar-week'> Días y horarios</i>
          </Link>
        </div>
        <div className='d-flex justify-content-evenly p-2'>
          {id && (
            <>
              <button
                className='btn btn-sm btn-outline-danger'
                onClick={() => handleDeleteActivity(id)}>
                Eliminar
              </button>

              <Link
                className='btn btn-sm btn-outline-warning'
                to={'/updateActivities/'}
                state={{ id: id }}>
                Actualizar
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ActivityCard.propTypes = {
  img: PropTypes.string,
  imgText: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  data_target: PropTypes.string,
  handleDeleteActivity: PropTypes.func,
  id: PropTypes.string,
};

export default ActivityCard;
