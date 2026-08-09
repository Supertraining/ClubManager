import { Link } from 'react-router-dom';
import './Logo.module.css';

/**
 * Logo — the club mark + wordmark.
 *
 * Two variants:
 *   - default:  U square + "Ranelagh CLUB" (used in the navbar and footer)
 *   - compact:  U square only, with brand colors inverted (used in dark
 *               contexts where the default colors disappear)
 *
 * The mark itself is a CSS-drawn block letter "U" on a rounded square so
 * we don't need to ship a binary asset for it.
 */
const Logo = ({ compact = false, to = '/' }) => {
  const label = compact ? null : (
    <span className='d-flex flex-column lh-1 ms-2'>
      <span className='fw-bold fs-5' style={{ fontFamily: 'var(--f-display)' }}>
        Ranelagh
      </span>
      <span
        className='text-uppercase fw-semibold'
        style={{ fontSize: '0.7rem', letterSpacing: '0.18em', opacity: 0.7 }}>
        Club
      </span>
    </span>
  );

  return (
    <Link to={to} className='navbar-brand d-flex align-items-center text-decoration-none p-0'>
      <span className={`logo-mark ${compact ? 'logo-mark--inverse' : ''}`} aria-hidden='true'>
        U
      </span>
      {label}
    </Link>
  );
};

export default Logo;
