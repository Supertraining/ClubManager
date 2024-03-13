import PropTypes from 'prop-types';

const Spinner = ({ height, width, color, text }) => {
  return (
    <div className='d-flex flex-column align-items-center'>
      <div
        className={`spinner-border ${color}`}
        style={{ height: height, width: width }}
        role='status'></div>
      <span className='fs-3 text-primary'>{text}</span>
    </div>
  );
};

Spinner.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
};

export default Spinner;
