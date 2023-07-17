import './navBarOffCanvasEnd.css';
import { ToastContainer } from 'react-toastify';
import MyUser from '../myUser/MyUser';
import { useState } from 'react';
import MyUserReserves from '../myUserReserves/MyUserReserves';

const NavBarOffCanvasEnd = (props) => {
  const initialState = {
    password: '',
    newPassword: '',
  };

  const [passwordData, setPasswordData] = useState(initialState);

  const handleChange = (e) => {
    setPasswordData({
      username: props?.user.username,
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div
        className='offcanvas offcanvas-end offCanvasBg'
        tabIndex='-1'
        id='offcanvasExample'
        aria-labelledby='offcanvasExampleLabel'
      >
        <div>
          <ToastContainer />
        </div>

        <div className='offcanvas-header'>
          <h5
            className='offcanvas-title m-1 text-white offcanvas-Header-Title'
            id='offcanvasExampleLabel'
          >
            {props?.user?.username}
          </h5>

          <button
            type='button'
            className='btn-close btn-close-white m-1'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          ></button>
        </div>

        <div className='offcanvas-body'>
          <div className='d-flex flex-column align-items-start my-2'>
            <button
              className='btn btn-outline-success m-1 p-1 border-0'
              onClick={() => {
                props.setShowProfile(!props.showProfile), props.setShowReserves(false);
              }}
            >
              <i className='bi bi-person-bounding-box mx-1'></i>
              Mi perfil
            </button>

            <button
              className='btn btn-outline-success m-1 p-1 border-0'
              onClick={() => {
                props.setShowReserves(!props.showReserves), props.setShowProfile(false);
              }}
            >
              <i className='bi bi-table mx-1'></i>
              Mis reservas
            </button>
          </div>

          <div className='my-4 d-flex flex-column align-items-center'>
            {props.showProfile && (
              <MyUser
                handleDeleteAccount={props.handleDeleteAccount}
                handleUpdateUser={props.handleUpdateUser}
                setShowProfile={props.setShowProfile}
                setShowChangePasswordForm={props.setShowChangePasswordForm}
              />
            )}

            {!props.allArrays && props.showReserves && (
              <div className='rounded bg-dark p-1 text-center'>
                <div className='text-white'>No tienes reservas activas</div>
              </div>
            )}

            {props.showChangePasswordForm && !props.showProfile && !props.showReserves && (
              <div>
                <form className='d-flex flex-column align-items-center'>
                  <input
                    className='my-2 rounded border-0 bg-success p-1'
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Tu contraseña actual'
                    value={passwordData.password}
                    onChange={handleChange}
                  />

                  <input
                    className='my-2 rounded border-0 bg-success p-1'
                    type='password'
                    name='newPassword'
                    id='newPassword'
                    placeholder='Nueva contraseña'
                    value={passwordData.newPassword}
                    onChange={handleChange}
                  />

                  <div>
                    <button
                      className='btn btn-outline-danger m-1 p-1'
                      onClick={(e) => {
                        props.handleUpdatePassword(e, passwordData), setPasswordData(initialState);
                      }}
                    >
                      Confirmar
                    </button>

                    <button
                      className='btn btn-outline-secondary m-1 p-1'
                      onClick={() => {
                        props.setShowChangePasswordForm(false), setPasswordData(initialState);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>

                  <small
                    className={
                      props.strongPassword
                        ? 'text-center text-success col-9 text-center'
                        : 'text-center text-danger col-9 text-center'
                    }
                  >
                    La contraseña debe tener al menos 8 caracteres y, debe incluir como mínimo una
                    MAYÚSCULA, un número y un caracter especial. <br />
                    <strong>(Ej.: Nombre@1980)</strong>
                  </small>
                </form>
              </div>
            )}
          </div>

          {props.allArrays && props.showReserves && (
            <MyUserReserves
              futbolReserves={props?.futbolReserves}
              paddleReserves={props?.paddleReserves}
              squashReserves={props?.squashReserves}
              paletaReserves={props?.paletaReserves}
              handleDeleteReserve={props.handleDeleteReserve}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default NavBarOffCanvasEnd;
