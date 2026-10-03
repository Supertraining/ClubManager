import PropTypes from 'prop-types';
import './NextSlotFab.css';

/**
 * NextSlotFab — Floating action button (visible en mobile/tablet cuando
 * el SlotGrid está en pantalla). Ofrece saltar al próximo slot disponible.
 */
const NextSlotFab = ({ hint, onClick, visible }) => {
  if (!visible || !hint) return null;

  return (
    <button
      type='button'
      className='next-slot-fab'
      onClick={onClick}
      aria-label={hint}>
      <i className='bi bi-lightning-charge-fill' aria-hidden='true'></i>
      <span className='next-slot-fab__label'>{hint}</span>
    </button>
  );
};

NextSlotFab.propTypes = {
  hint: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

export default NextSlotFab;
