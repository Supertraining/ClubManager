import ActivityModal from '../ActivityModal/ActivityModal';
import PropTypes from 'prop-types';

const Modal = ({ dataTarget, activity, categories = [] }) => {
  return (
    <div
      className='modal fade activity-hours-modal'
      id={dataTarget}
      tabIndex='-1'
      role='dialog'
      aria-labelledby={dataTarget + '-title'}
      aria-hidden='true'>
      <div
        className='modal-dialog modal-dialog-centered modal-dialog-scrollable'
        role='document'>
        <div
          className='modal-content'>
          <div className='modal-header'>
            <h5
              className='modal-title fs-5 p-2 rounded'
              id={dataTarget + '-title'}>
              Días y horarios{activity ? ' de ' + activity : ''}
            </h5>

            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Cerrar ventana' />
          </div>

          <div className='modal-body'>
            <ActivityModal categories={categories} />
          </div>

          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-outline-secondary'
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
  dataTarget: PropTypes.string.isRequired,
  activity: PropTypes.string,
  categories: PropTypes.array,
};

export default Modal;
