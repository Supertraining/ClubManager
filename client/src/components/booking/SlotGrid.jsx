import PropTypes from 'prop-types';
import { isSlotPast, slotEnd, toHHmm, toMinutes } from './helpers';
import './SlotGrid.css';

/**
 * SlotGrid — grilla de slots de 90 min para la franja seleccionada.
 *
 * Estado de cada slot:
 *   - available: outline verde, clickeable
 *   - occupied:  bg alt, opacidad 60%, no interactivo
 *   - permanent: tag "Permanente"
 *   - mine:      outline mostaza + tag "Tuya"
 *   - selected:  bg brand, texto crema
 *   - past:      opacidad 30%, no interactivo
 *
 * Nunca se muestra la identidad de quien reservó: la grilla es pública para
 * todos los socios, y resolver el user_id a un nombre exigiría exponer
 * profiles de otros usuarios (la política "profiles: read own" lo impide por
 * diseño). Un slot de otra persona se anuncia como "Horario ocupado".
 */
const SlotGrid = ({
  slots,
  selectedStart,
  onSelect,
  getReservation,
  currentUserId,
  durationMin,
  dateKey,
  closeMin,
}) => {
  if (!slots || slots.length === 0) {
    return (
      <div className='slot-grid__empty'>
        <i className='bi bi-calendar2-x' aria-hidden='true'></i>
        <p>No hay turnos en esta franja.</p>
        <small>Probá con otra franja o con otro día.</small>
      </div>
    );
  }

  return (
    <div className='slot-grid' role='list' aria-label='Turnos disponibles'>
      {slots.map((start) => {
        const end = slotEnd(start, durationMin);
        const reservation = getReservation?.(start);
        const occupied = Boolean(reservation);
        // `reservation` is the first booking that OVERLAPS this slot's window,
        // which is not the same as a booking that starts here. A 19:00-20:30
        // booking overlaps 18:00 (at 90 min) and 20:00 too, and tagging all
        // three "Tuya" claims three bookings the member does not have. "Tuya"
        // means this slot IS the start of one of my bookings.
        const startsHere = occupied && toHHmm(reservation.initialTime) === start;
        const mine = startsHere && Boolean(currentUserId) && reservation.user === currentUserId;
        const permanent = startsHere && reservation.permanent;
        const past = isPast(start);
        // Same rule BookingPanel applies to the duration buttons: a slot whose
        // window runs past closing cannot be booked, so don't advertise it as
        // free with a range that ends after the club shuts.
        const runsPastClose = closeMin != null
          && toMinutes(start) + durationMin > closeMin;
        const isSelected = !occupied && !past && !runsPastClose && selectedStart === start;

        const classes = ['slot'];
        if (occupied) classes.push('slot--occupied');
        if (mine) classes.push('slot--mine');
        if (permanent) classes.push('slot--permanent');
        if (past || runsPastClose) classes.push('slot--past');
        if (isSelected) classes.push('slot--selected');

        return (
          <button
            key={start}
            type='button'
            role='listitem'
            className={classes.join(' ')}
            disabled={occupied || past || runsPastClose}
            onClick={() => onSelect(start)}
            aria-label={
              occupied
                ? `${start} a ${end}, ocupado${permanent ? ' (turno permanente)' : mine ? ', tu reserva' : ''}`
                : runsPastClose
                  ? `${start} a ${end}, no entra antes del cierre`
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
            {occupied && !mine && !permanent && (
              <span className='slot__occupied'>Horario ocupado</span>
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
    return isSlotPast(slotStart, dateKey);
  }
};

SlotGrid.propTypes = {
  slots: PropTypes.array.isRequired,
  selectedStart: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  getReservation: PropTypes.func,
  currentUserId: PropTypes.string,
  durationMin: PropTypes.number,
  dateKey: PropTypes.string,
  closeMin: PropTypes.number,
};

export default SlotGrid;
