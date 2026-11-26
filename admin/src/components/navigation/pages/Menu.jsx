import '../css/menu.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Menu = ({
  menu,
  handleGetAllUsers,
  handleCloseSession,
  handleMenuClick,
}) => {
  return (
    <>
      <div
        className='offcanvas offcanvas-start border bg-dark'
        tabIndex='-1'
        id='offcanvasDarkNavbar'
        aria-labelledby='offcanvasDarkNavbarLabel'>
        <div className='offcanvas-header justify-content-end'>
          <button
            type='button'
            className='btn-close btn-close-white btn-close-custom'
            data-bs-dismiss='offcanvas'
            aria-label='Close'>
            <i className='bi bi-x-square fs-3'></i>
          </button>
        </div>

        <div className='offcanvas-body menu-container'>
          <div className='d-flex align-items-center justify-content-center col-12'>
            <ul className='options-wrapper'>
              <li className='d-flex align-items-center col-12'>
                <Link
                  to='/createUser'
                  className={menu.createUser ? 'btn btn-success' : 'btn btn-success bg-transparent'}
                  onClick={() => {
                    handleMenuClick('createUser');
                  }}>
                  Invitar socio
                </Link>

                <i
                  className={
                    menu.createUser
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link
                  to={'/getAllUsers'}
                  className={
                    menu.getAllUsers ? 'btn btn-success' : 'btn btn-success bg-transparent'
                  }
                  onClick={() => {
                    handleMenuClick('getAllUsers'), handleGetAllUsers();
                  }}>
                  Padrón de socios
                </Link>

                <i
                  className={
                    menu.getAllUsers
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link
                  to={'/courts'}
                  className={
                    menu.getAllCourts ? 'btn btn-success' : 'btn btn-success bg-transparent'
                  }
                  onClick={() => {
                    handleMenuClick('getAllCourts');
                  }}>
                  Canchas
                </Link>

                <i
                  className={
                    menu.getAllCourts
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link to='/configuracion' className='btn btn-success bg-transparent' onClick={() => handleMenuClick('settings')}>
                  Datos del club
                </Link>
              </li>
              <li className='d-flex align-items-center col-12'>
                <Link to='/facturacion' className='btn btn-success bg-transparent' onClick={() => handleMenuClick('billing')}>
                  Facturación
                </Link>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link
                  to={'/events'}
                  className={menu.events ? 'btn btn-success' : 'btn btn-success bg-transparent'}
                  onClick={() => {
                    handleMenuClick('events');
                  }}>
                  Eventos
                </Link>

                <i
                  className={
                    menu.events
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link
                  to={'/activities'}
                  className={menu.activities ? 'btn btn-success' : 'btn btn-success bg-transparent'}
                  onClick={() => {
                    handleMenuClick('activities');
                  }}>
                  Crear actividad
                </Link>

                <i
                  className={
                    menu.activities
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link
                  to={'/getAllActivities'}
                  className={
                    menu.getAllActivities ? 'btn btn-success' : 'btn btn-success bg-transparent'
                  }
                  onClick={() => {
                    handleMenuClick('getAllActivities');
                  }}>
                  Todas las actividades
                </Link>

                <i
                  className={
                    menu.getAllActivities
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <Link
                  to={'/oldReservesDeleted'}
                  className={
                    menu.deleteReserves ? 'btn btn-success' : 'btn btn-success bg-transparent'
                  }
                  onClick={() => {
                    handleMenuClick('deleteReserves');
                  }}>
                  Borrar historial de reservas
                </Link>

                <i
                  className={
                    menu.deleteReserves
                      ? 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-active text-success'
                      : 'bi bi-box-arrow-right fs-4 mx-2 btn-arrow-inActive'
                  }></i>
              </li>

              <li className='d-flex align-items-center col-12'>
                <button
                  className='btn btn-danger col-12 d-flex justify-content-center align-items-center'
                  onClick={handleCloseSession}>
                  Cerrar sesión
                  <i className='bi bi-arrow-bar-right'></i>
                  <i className='bi bi-door-open text-light fs-5'></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

Menu.propTypes = {
  menu: PropTypes.object,
  handleGetAllUsers: PropTypes.func,
  handleCloseSession: PropTypes.func,
  handleMenuClick: PropTypes.func,
};

