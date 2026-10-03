import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import './Navbar.css';
import { userStore } from '../../../stores';

const NAV_LINKS = [
  { to: '/#canchas',      label: 'Canchas' },
  { to: '/#actividades',  label: 'Actividades' },
  { to: '/#el-club',      label: 'El club' },
  { to: '/#contacto',     label: 'Contacto' },
];

const Navbar = () => {
  const location = useLocation();
  const user = userStore((s) => s.user?.user);

  // On non-home routes, "#section" anchors should go to home + anchor.
  const anchorFor = (hash) => {
    if (location.pathname === '/') return hash;
    return `/${hash}`;
  };

  return (
    <header className='app-navbar' role='banner'>
      <div className='container-xl app-navbar__inner'>
        <Logo to='/' />

        <nav className='app-navbar__links' aria-label='Navegación principal'>
          {NAV_LINKS.map((link) => (
            <a key={link.to} href={anchorFor(link.to)} className='app-navbar__link'>
              {link.label}
            </a>
          ))}
        </nav>

        <div className='app-navbar__actions'>
          {user ? (
            <NavLink to='/account' className='btn btn--ghost btn--sm app-navbar__cta-ghost'>
              <i className='bi bi-person-circle' aria-hidden='true'></i>
              <span>Mi cuenta</span>
            </NavLink>
          ) : (
            <NavLink to='/login' className='btn btn--ghost btn--sm app-navbar__cta-ghost'>
              <i className='bi bi-person-circle' aria-hidden='true'></i>
              <span>Iniciar sesión</span>
            </NavLink>
          )}
          <Link to='/reserves' className='btn btn--primary btn--sm btn--pill app-navbar__cta-primary'>
            <i className='bi bi-calendar2-week' aria-hidden='true'></i>
            <span>Reservar</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
