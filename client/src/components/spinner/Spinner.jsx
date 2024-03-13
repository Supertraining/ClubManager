import PropTypes from 'prop-types';

const Spinner = ({ height, width, color, text, textSize, textColor, type }) => {
  return (
    <div className='d-flex flex-column align-items-center'>
      <div
        className={`spinner-${type ? type : 'border'} ${color}`}
        style={{ height: height, width: width }}
        role='status'></div>
      <span className={`${textSize ? textSize : 'fs-3'} ${textColor ? textColor : 'text-primary'}`}>
        {text}
      </span>
    </div>
  );
};

Spinner.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  textSize: PropTypes.string,
  textColor: PropTypes.string,
};

export default Spinner;
