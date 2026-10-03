import PropTypes from 'prop-types';
import { slotEnd } from './helpers';
import './SlotGrid.css';

/**
 * SlotGrid — grilla de slots de 90 min para la franja seleccionada.
 *
 * Estado de cada slot:
 *   - available: outline verde, clickeable
 *   - occupied:  bg alt, opacidad 60%, no interactivo
 *   - permanent: tag "Permanente" + nombre del socio
 *   - mine:      outline mostaza + tag "Tuya" + nombre
 *   - selected:  bg brand, texto crema
 *   - past:      opacidad 30%, no interactivo
 */
const SlotGrid = ({ slots, selectedStart, onSelect, getReservation, currentUserId }) => {
  if (!slots || slots.length === 0) {
    return (
      <div className='slot-grid__empty'>
        <i className='bi bi-calendar2-x' aria-hidden='true'></i>
        <p>No hay turnos en esta franja.</p>
        <small>Probá con otra franja o con otro día.</small>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className='slot-grid' role='list' aria-label='Turnos disponibles'>
      {slots.map((start) => {
        const end = slotEnd(start);
        const reservation = getReservation?.(start);
        const occupied = Boolean(reservation);
        const mine = occupied && currentUserId && reservation.userId === currentUserId;
        const permanent = occupied && reservation.permanent;
        const past = isPast(start);
        const isSelected = !occupied && !past && selectedStart === start;

        const classes = ['slot'];
        if (occupied) classes.push('slot--occupied');
        if (mine) classes.push('slot--mine');
        if (permanent) classes.push('slot--permanent');
        if (past) classes.push('slot--past');
        if (isSelected) classes.push('slot--selected');

        return (
          <button
            key={start}
            type='button'
            role='listitem'
            className={classes.join(' ')}
            disabled={occupied || past}
            onClick={() => onSelect(start)}
            aria-label={
              occupied
                ? `${start} a ${end}, ocupado${permanent ? ' (turno permanente)' : mine ? ', tu reserva' : ''}`
                : `${start} a ${end}, disponible`
            }>
            <span className='slot__time'>{start}</span>
            <span className='slot__range'>{start} – {end}</span>
            {mine && (
              <span className='slot__tag tag tag--mustard'>Tuya</span>
            )}
            {permanent && !mine && (
              <span className='slot__tag tag tag--mustard'>Permanente</span>
            )}
            {occupied && !mine && !permanent && reservation?.user && (
              <span className='slot__who'>{reservation.user}</span>
            )}
            {isSelected && (
              <span className='slot__check' aria-hidden='true'>
                <i className='bi bi-check-circle-fill'></i>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  function isPast(slotStart) {
    // past if hour already passed today
    const today = new Date();
    if (today.toDateString() !== new Date().toDateString()) return false;
    const [h, m] = slotStart.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, m, 0, 0);
    return slotTime.getTime() <= now.getTime();
  }
};

SlotGrid.propTypes = {
  slots: PropTypes.array.isRequired,
  selectedStart: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  getReservation: PropTypes.func,
  currentUserId: PropTypes.string,
};

export default SlotGrid;
