import ActivityModal from '../ActivityModal/ActivityModal';
import PropTypes from 'prop-types';

const Modal = ({ dataTarget, activity, categories, img }) => {
  return (
    <div
      className='modal fade'
      id={dataTarget}
      tabIndex='-1'
      role='dialog'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'>
      <div
        className='modal-dialog'
        role='document'>
        <div
          className='modal-content'
          style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}>
          <div className='modal-header'>
            <h5
              className='modal-title fs-5 p-2 rounded'
              id='exampleModalLabel'>
              {activity}
            </h5>

            <button
              type='button'
              className='close btn modal-btn'
              data-bs-dismiss='modal'
              aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>

          <div className='modal-body'>
            <ActivityModal categories={categories} />
          </div>

          <div className='modal-footer'>
            <button
              className='btn modal-btn'
              data-bs-dismiss='modal'>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  img: PropTypes.string,
  dataTarget: PropTypes.string,
  activity: PropTypes.string,
  categories: PropTypes.array,
};

export default Modal;
