import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { slotEnd } from './helpers';
import './BookingPanel.css';

/**
 * BookingPanel — sidebar (desktop) o bottom-sheet (mobile).
 *
 * Muestra: día elegido, hora inicio (auto-llena con slot), hora fin (auto),
 * botón "Confirmar reserva". Si no hay usuario logueado, muestra CTA a login.
 */
const BookingPanel = ({
  date,
  startTime,
  courtDisplayName,
  onConfirm,
  isSubmitting,
  isAuthenticated,
  nextSlotHint,
  onUseNextSlot,
}) => {
  const endTime = startTime ? slotEnd(startTime) : null;
  const canConfirm = Boolean(startTime) && !isSubmitting;

  if (!isAuthenticated) {
    return (
      <aside className='booking-panel booking-panel--auth'>
        <div className='booking-panel__eyebrow eyebrow eyebrow--brand'>— Para reservar</div>
        <h3 className='booking-panel__title'>Iniciá sesión para bloquear el turno.</h3>
        <p className='booking-panel__sub'>
          Una vez logueado, elegís horario y confirmás en dos pasos.
        </p>
        <div className='booking-panel__cta'>
          <Link
            to={`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}
            className='btn btn--brand btn--block btn--pill'>
            <i className='bi bi-box-arrow-in-right' aria-hidden='true'></i>
            Iniciar sesión
          </Link>
          <Link to='/register' className='btn btn--ghost btn--block btn--pill'>
            Crear mi cuenta
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className='booking-panel'>
      <div className='booking-panel__eyebrow eyebrow eyebrow--brand'>— Tu reserva</div>
      <h3 className='booking-panel__title'>
        {startTime ? 'Confirmá tu turno' : 'Elegí un horario'}
      </h3>

      <div className='booking-panel__summary'>
        <div className='booking-panel__row'>
          <span className='booking-panel__label'>Cancha</span>
          <span className='booking-panel__value'>{courtDisplayName}</span>
        </div>
        <div className='booking-panel__row'>
          <span className='booking-panel__label'>Día</span>
          <span className='booking-panel__value'>{formatDate(date)}</span>
        </div>
        <div className={`booking-panel__row${startTime ? ' booking-panel__row--active' : ''}`}>
          <span className='booking-panel__label'>Horario</span>
          <span className='booking-panel__value booking-panel__value--time'>
            {startTime ? `${startTime} – ${endTime}` : (
              <span className='booking-panel__placeholder'>Tocá un slot disponible</span>
            )}
          </span>
        </div>
      </div>

      {startTime && (
        <button
          type='button'
          className='btn btn--primary btn--block btn--lg btn--pill booking-panel__cta'
          disabled={!canConfirm}
          onClick={onConfirm}>
          {isSubmitting ? (
            <>
              <span className='booking-panel__spinner' aria-hidden='true'></span>
              Reservando…
            </>
          ) : (
            <>
              <i className='bi bi-check-circle' aria-hidden='true'></i>
              Confirmar reserva
            </>
          )}
        </button>
      )}

      {!startTime && nextSlotHint && (
        <button
          type='button'
          className='btn btn--brand btn--block btn--pill booking-panel__next'
          onClick={onUseNextSlot}>
          <i className='bi bi-lightning-charge' aria-hidden='true'></i>
          {nextSlotHint}
        </button>
      )}

      <p className='booking-panel__terms'>
        Al confirmar aceptás las reglas de uso del Club Ranelagh. Tu lugar se
        reserva en el momento.
      </p>
    </aside>
  );
};

const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
};

BookingPanel.propTypes = {
  date: PropTypes.instanceOf(Date),
  startTime: PropTypes.string,
  courtDisplayName: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  nextSlotHint: PropTypes.string,
  onUseNextSlot: PropTypes.func,
};

export default BookingPanel;
