import { Link, NavLink } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import './Navbar.css';
import { userStore } from '../../../stores';

// Hashes sueltos, sin la barra inicial: se combinan con { pathname: '/' } para
// armar la navegación. Guardarlos como '/#canchas' y concatenar un '/' delante
// producía '//#canchas', que el browser interpreta como URL protocol-relative
// y resuelve a about:blank#blocked.
const NAV_LINKS = [
  { hash: '#canchas',     label: 'Canchas' },
  { hash: '#actividades', label: 'Actividades' },
  { hash: '#el-club',     label: 'El club' },
  { hash: '#contacto',    label: 'Contacto' },
];

const Navbar = () => {
  const user = userStore((s) => s.user?.user);

  return (
    <header className='app-navbar' role='banner'>
      <div className='container-xl app-navbar__inner'>
        <Logo to='/' />

        <nav className='app-navbar__links' aria-label='Navegación principal'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              to={{ pathname: '/', hash: link.hash }}
              className='app-navbar__link'>
              {link.label}
            </Link>
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
