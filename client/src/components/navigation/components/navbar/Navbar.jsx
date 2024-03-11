import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { isStrongPassword } from 'validator';
import NavBarOffCanvasStart from '../navBarOffCanvasStart/NavBarOffCanvasStart';
import NavBarOffCanvasEnd from '../navBarOffCanvasEnd/NavBarOffCanvasEnd';
import { useCourtAPI, useNotifications, useUserAPI } from '../../../../hooks';
import { userStore } from '../../../../stores';
import { useState } from 'react';

const Navbar = () => {
  const [userReserves, setUserReserves] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [strongPassword, setStrongPassword] = useState(true);
  const [showReserves, setShowReserves] = useState(false);

  const navigate = useNavigate();
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();
  const {
    getUserById,
    updateUserById,
    updateUsersPassword,
    deleteUserById,
    closeSession,
    deleteUserReserve,
    userLogin,
  } = useUserAPI();
  const { updateReserveUsername, deleteReserveByUsername, deleteCourtReserve } = useCourtAPI();

  const {
    user: { user },
    setUser,
    setReserveDeleted,
  } = userStore();

  const handleUserReserves = async () => {
    try {
      const userById = await getUserById();
      const { reserves } = userById;
      setUserReserves(reserves);
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const futbolReserves = userReserves?.filter((res) => res.court === 'futbol');
  const paddleReserves = userReserves?.filter((res) => res.court === 'paddle');
  const squashReserves = userReserves?.filter((res) => res.court === 'squash');
  const paletaReserves = userReserves?.filter((res) => res.court === 'paleta');

  const allArrays = [futbolReserves, paddleReserves, squashReserves, paletaReserves].some(
    (arr) => arr.length > 0
  );

  const handleCloseSession = async () => {
    closeSession();
  };

  const handleUpdateUser = async (e, credentials) => {
    try {
      e.preventDefault();

      const updatedUserData = { ...credentials, reserves: userReserves };
      const updatedUser = await updateUserById(updatedUserData);

      updateReserveUsername(user.username, credentials.username);

      setUser({ type: 'UPDATE_USER', payload: { ...updatedUser, token: user.token } });

      handleUserReserves();

      setReserveDeleted(true);

      notifySuccess('Usuario actualizado');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteAccount = async (user) => {
    try {
      deleteReserveByUsername(user.username);

      const userDeleted = await deleteUserById(user._id);

      setUserReserves([]);

      if (userDeleted === true) {
        setUser({ type: 'LOGOUT' });

        notifySuccess('Cuenta Eliminada');

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteReserve = async (court, day, id) => {
    try {
      deleteUserReserve(user.username, id);
      deleteCourtReserve(court, day, id);

      handleUserReserves();

      setReserveDeleted(true);

      notifySuccess('Reserva Eliminada');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleUpdatePassword = async (e, data) => {
    try {
      e.preventDefault();
      const { password, newPassword } = data;

      const passwordValidationOptions = {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      };

      if (!isStrongPassword(newPassword, passwordValidationOptions)) {
        setStrongPassword(false);
        return;
      }

      setStrongPassword(true);

      const isAuthorized = await userLogin({
        username: user.username,
        password: password,
      });

      if (isAuthorized) {
        updateUsersPassword(user, newPassword);
      }
      notifySuccess('Contraseña Actualizada');

      setShowChangePasswordForm(false);
    } catch (error) {
      notifyError('Contraseña incorrecta');
    }
  };


  return (
    <div className='navBarContainer col-12 sticky-top container-fluid'>
      <nav className='navbar navbar-dark bg-dark h-100 row'>
        <div className='d-flex justify-content-between col-12'>
          <Link
            to='/'
            className='navbar-brand title'>
            Club Ranelagh
          </Link>

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='offcanvas'
            data-bs-target='#offcanvasDarkNavbar'
            aria-controls='offcanvasDarkNavbar'
            aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>

          <NavBarOffCanvasStart
            handleCloseSession={handleCloseSession}
            handleUserReserves={handleUserReserves}
            user={user}
          />
        </div>

        <NavBarOffCanvasEnd
          setShowProfile={setShowProfile}
          showProfile={showProfile}
          setShowReserves={setShowReserves}
          showReserves={showReserves}
          handleUpdateUser={handleUpdateUser}
          handleDeleteAccount={handleDeleteAccount}
          handleDeleteReserve={handleDeleteReserve}
          allArrays={allArrays}
          futbolReserves={futbolReserves}
          paddleReserves={paddleReserves}
          squashReserves={squashReserves}
          paletaReserves={paletaReserves}
          user={user}
          setShowChangePasswordForm={setShowChangePasswordForm}
          showChangePasswordForm={showChangePasswordForm}
          handleUpdatePassword={handleUpdatePassword}
          strongPassword={strongPassword}
        />
      </nav>
    </div>
  );
};

export default Navbar;
