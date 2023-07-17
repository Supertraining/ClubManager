import Login from '../auth/login/Login';
import { Link } from 'react-router-dom';

const NavBarOffCanvasStart = (props) => {
  return (
    <>
      <div
        className='offcanvas offcanvas-start border offCanvasBg'
        tabIndex='-1'
        id='offcanvasDarkNavbar'
        aria-labelledby='offcanvasDarkNavbarLabel'
      >
        <div className='offcanvas-header justify-content-end'>
          <button
            type='button'
            className='btn-close btn-close-white'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          ></button>
        </div>

        <div className='offcanvas-body'>
          <ul className='navbar-nav justify-content-end flex-grow-1 pe-3 my-3'>
            <li className='nav-item d-flex align-items-center my-4'>
              <i className='bi bi-house mx-1 text-white'></i>
              <Link
                className='nav-link text-white text-decoration-underline'
                aria-current='page'
                to='/'
              >
                Inicio
              </Link>
            </li>

            {props?.user && (
              <li className='nav-item border border-info rounded userLiItem'>
                <a
                  className='text-info text-decoration-none p-3'
                  data-bs-toggle='offcanvas'
                  href='#offcanvasExample'
                  role='button'
                  aria-controls='offcanvasExample'
                  onClick={props.handleUserReserves}
                >
                  Mi cuenta
                  <i className='fa-solid fa-plug-circle-check text-success mx-1'></i>
                </a>
              </li>
            )}

            {!props?.user ? (
              <Login />
            ) : (
              <>
                <li className='nav-item dropdown'>
                  <Link
                    className='nav-link dropdown-toggle text-white'
                    href='#'
                    role='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    Canchas
                  </Link>

                  <ul className='dropdown-menu bg-transparent'>
                    <li>
                      <i className='bi bi-caret-right-fill text-info'></i>

                      <Link className='dropdownitem' to='reserves' state={{ court: 'futbol' }}>
                        Futbol
                      </Link>
                    </li>

                    <li>
                      <i className='bi bi-caret-right-fill text-info'></i>
                      <Link className='dropdownitem' to='reserves' state={{ court: 'paleta' }}>
                        Pelota Paleta
                      </Link>
                    </li>

                    <li>
                      <i className='bi bi-caret-right-fill text-info'></i>

                      <Link className='dropdownitem' to='reserves' state={{ court: 'paddle' }}>
                        Paddle
                      </Link>
                    </li>

                    <li>
                      <i className='bi bi-caret-right-fill text-info'></i>

                      <Link className='dropdownitem' to='reserves' state={{ court: 'squash' }}>
                        Squash
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>

        {props?.user && (
          <div className='text-center my-3'>
            <button className='btn btn-danger m-auto' onClick={props.handleCloseSession}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBarOffCanvasStart;
