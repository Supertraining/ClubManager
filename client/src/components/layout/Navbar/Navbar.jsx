import { Link } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import './Navbar.module.css';

const NAV_LINKS = [
  { to: '/#canchas',     label: 'Canchas' },
  { to: '/#actividades', label: 'Actividades' },
  { to: '/#el-club',     label: 'El club' },
  { to: '/#contacto',    label: 'Contacto' },
];

const Navbar = () => {
  return (
    <header className='app-navbar'>
      <nav className='container-xl d-flex align-items-center justify-content-between py-3'>
        <Logo />

        <ul className='app-navbar__links d-none d-lg-flex list-unstyled mb-0'>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <a href={link.to} className='app-navbar__link'>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className='d-flex align-items-center gap-2'>
          <Link to='/login' className='btn btn-sm btn-outline-light app-navbar__cta-ghost d-none d-md-inline-flex'>
            <i className='bi bi-person-circle me-1' aria-hidden='true'></i>
            Mi cuenta
          </Link>
          <Link to='/reserves' className='btn btn-sm app-navbar__cta-primary'>
            <i className='bi bi-calendar2-week me-1' aria-hidden='true'></i>
            Reservar
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
