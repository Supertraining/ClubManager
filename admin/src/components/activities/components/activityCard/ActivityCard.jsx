import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const ActivityCard = ({ img, imgText, title, description, modalId, handleDeleteActivity, id }) => {
  return (
    <div className='card-wrapper mx-1 shadow'>
      <div className='card'>
        {img && <img
          className='card-img p-2'
          src={img}
          alt={imgText || ''}
        />}
        <div className='card-body'>
          <h5 className='card-title fw-bold'>{title}</h5>
          <p className='card-text'>{description}</p>
        </div>
        <div className='card-footer d-flex align-items-center justify-content-between'>
          <button
            type='button'
            data-bs-toggle='modal'
            data-bs-target={'#' + modalId}
            aria-haspopup='dialog'
            aria-controls={modalId}
            className='btn btn-outline-success'
            style={{ minHeight: 44 }}>
            <i className='bi bi-calendar-week' aria-hidden='true' /> Días y horarios
          </button>
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
  modalId: PropTypes.string.isRequired,
  handleDeleteActivity: PropTypes.func,
  id: PropTypes.string,
};

export default ActivityCard;
