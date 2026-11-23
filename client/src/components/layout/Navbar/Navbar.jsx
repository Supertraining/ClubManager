import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import './Navbar.css';
import { useUserAPI } from '../../../hooks/useUserAPI';
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

const Navbar = ({ authReady }) => {
  const user = userStore((s) => s.user?.user);
  const { closeSession } = useUserAPI();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await closeSession();
    } finally {
      setSigningOut(false);
    }
  };

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
          {authReady && (user ? (
            <>
              <NavLink to='/account' aria-label='Mi cuenta' className='btn btn--ghost btn--sm app-navbar__cta-ghost'>
                <i className='bi bi-person-circle' aria-hidden='true'></i>
                <span>Mi cuenta</span>
              </NavLink>
              <button
                type='button'
                aria-label='Cerrar sesión'
                className='btn btn--ghost btn--sm app-navbar__cta-ghost'
                disabled={signingOut}
                onClick={handleSignOut}>
                <i className='bi bi-box-arrow-right' aria-hidden='true'></i>
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <NavLink to='/login' aria-label='Iniciar sesión' className='btn btn--ghost btn--sm app-navbar__cta-ghost'>
              <i className='bi bi-person-circle' aria-hidden='true'></i>
              <span>Iniciar sesión</span>
            </NavLink>
          ))}
          <Link to='/reserves' aria-label='Reservar' className='btn btn--primary btn--sm btn--pill app-navbar__cta-primary'>
            <i className='bi bi-calendar2-week' aria-hidden='true'></i>
            <span>Reservar</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = { authReady: PropTypes.bool.isRequired };

export default Navbar;
