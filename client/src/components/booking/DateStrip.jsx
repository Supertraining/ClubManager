import PropTypes from 'prop-types';
import { getWeekDays, formatDayShort, isSameDay } from './helpers';
import './DateStrip.css';

/**
 * DateStrip — horizontal strip of 7 days (today + 6).
 *
 * Scrolls horizontally on overflow; selected day is highlighted with the
 * brand green. Today gets a small dot indicator.
 */
const DateStrip = ({ selected, onSelect }) => {
  const days = getWeekDays();

  return (
    <div className='date-strip' role='radiogroup' aria-label='Día de la reserva'>
      {days.map((d) => {
        const f = formatDayShort(d);
        const active = isSameDay(d, selected);
        return (
          <button
            key={d.toISOString()}
            type='button'
            role='radio'
            aria-checked={active}
            className={`date-strip__day${active ? ' date-strip__day--active' : ''}`}
            onClick={() => onSelect(d)}>
            <span className='date-strip__weekday'>{f.weekdayShort}</span>
            <span className='date-strip__num'>{f.day}</span>
            {f.isToday && <span className='date-strip__dot' aria-hidden='true'></span>}
          </button>
        );
      })}
    </div>
  );
};

DateStrip.propTypes = {
  selected: PropTypes.instanceOf(Date).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DateStrip;
