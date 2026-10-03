import { Link } from 'react-router-dom';
import './Logo.css';

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
    <Link to={to} className='logo' aria-label='Club Ranelagh — ir al inicio'>
      <span className={markClasses} aria-hidden='true'>
        <span className='logo-mark__u'>R</span>
      </span>
      {!compact && (
        <span className='logo-text'>
          <span className={wordmarkClasses}>Ranelagh</span>
          <span className={subtitleClasses}>Club</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
