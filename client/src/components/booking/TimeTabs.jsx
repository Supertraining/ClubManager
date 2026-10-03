import PropTypes from 'prop-types';
import './TimeTabs.css';

/**
 * TimeTabs — 3 tabs: Mañana / Tarde / Noche.
 *
 * Each tab shows the count of available slots in parentheses. If a range
 * is empty (e.g. no slots in the morning on a Sunday that opens at 9),
 * the tab is rendered disabled.
 */
const TimeTabs = ({ value, onChange, counts = {} }) => {
  const tabs = [
    { key: 'manana', label: 'Mañana', icon: 'bi-sun' },
    { key: 'tarde',  label: 'Tarde',  icon: 'bi-cloud-sun' },
    { key: 'noche',  label: 'Noche',  icon: 'bi-moon-stars' },
  ];

  return (
    <div className='time-tabs' role='tablist' aria-label='Franja horaria'>
      {tabs.map((t) => {
        const isActive = value === t.key;
        const count = counts[t.key] ?? 0;
        const disabled = count === 0 && !isActive;
        return (
          <button
            key={t.key}
            type='button'
            role='tab'
            aria-selected={isActive}
            aria-disabled={disabled}
            disabled={disabled}
            className={`time-tabs__tab${isActive ? ' time-tabs__tab--active' : ''}`}
            onClick={() => onChange(t.key)}>
            <i className={`bi ${t.icon}`} aria-hidden='true'></i>
            <span className='time-tabs__label'>{t.label}</span>
            <span className='time-tabs__count'>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

TimeTabs.propTypes = {
  value: PropTypes.oneOf(['manana', 'tarde', 'noche']).isRequired,
  onChange: PropTypes.func.isRequired,
  counts: PropTypes.object,
};

export default TimeTabs;
