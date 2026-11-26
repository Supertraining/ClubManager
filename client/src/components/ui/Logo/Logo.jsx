import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Logo.css';
import { useClub } from '../../club/useClub';

/**
 * Logo — the club mark + wordmark.
 *
 * Props:
 *   - compact:  when true, only the mark (the "U" square) is shown.
 *   - variant:  "default" (dark mark, for light backgrounds — navbar)
 *               or "inverse" (light mark, for dark backgrounds — footer)
 *   - to:       link target (default "/").
 */
const Logo = ({ compact = false, variant = 'default', to = '/' }) => {
  const { club } = useClub();
  const markClasses = [
    'logo-mark',
    compact ? 'logo-mark--compact' : '',
    variant === 'inverse' ? 'logo-mark--inverse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const wordmarkClasses = [
    'logo-wordmark',
    variant === 'inverse' ? 'logo-wordmark--inverse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const subtitleClasses = [
    'logo-subtitle',
    variant === 'inverse' ? 'logo-subtitle--inverse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link to={to} className='logo' aria-label={club.name + ' · Inicio'}>
      <span className={markClasses} aria-hidden='true'>
        {club.logoUrl
          ? <img className='club-logo-image' src={club.logoUrl} alt='' />
          : <span className='logo-mark__u'>{club.slug === 'ranelagh' ? 'R' : club.name.trim()[0]}</span>}
      </span>
      {!compact && (
        <span className='logo-text'>
          <span className={wordmarkClasses}>{club.name === 'Club Ranelagh' ? 'Ranelagh' : club.name}</span>
          {club.name === 'Club Ranelagh' && <span className={subtitleClasses}>Club</span>}
        </span>
      )}
    </Link>
  );
};

Logo.propTypes = {
  compact: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'inverse']),
  to: PropTypes.string,
};

export default Logo;
