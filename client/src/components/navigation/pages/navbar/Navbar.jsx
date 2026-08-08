import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { isStrongPassword } from 'validator';
import NavBarOffCanvasStart from '../../components/navBarOffCanvasStart/NavBarOffCanvasStart';
import NavBarOffCanvasEnd from '../../components/navBarOffCanvasEnd/NavBarOffCanvasEnd';
import { useCourtAPI, useNotifications, useReservesAPI, useUserAPI } from '../../../../hooks';
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
    userLogin,
  } = useUserAPI();
  const { getUnavailableDatesByName } = useCourtAPI();
  const { getMyReserves, deleteReserve } = useReservesAPI();

  const user = userStore((s) => s.user.user);
  const setUser = userStore((s) => s.setUser);
  const setReserveDeleted = userStore((s) => s.setReserveDeleted);

  const handleUserReserves = async () => {
    try {
      const reserves = await getMyReserves();
      setUserReserves(reserves);
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const futbolReserves = userReserves?.filter((res) => res.court?.name === 'futbol');
  const paddleReserves = userReserves?.filter((res) => res.court?.name === 'paddle');
  const squashReserves = userReserves?.filter((res) => res.court?.name === 'squash');
  const paletaReserves = userReserves?.filter((res) => res.court?.name === 'paleta');

  const allArrays = [futbolReserves, paddleReserves, squashReserves, paletaReserves]
    .filter(Boolean)
    .some((arr) => arr.length > 0);

  const handleCloseSession = async () => {
    await closeSession();
  };

  const handleUpdateUser = async (e, credentials) => {
    try {
      e.preventDefault();
      if (!user?.id) return;
      const updatedUser = await updateUserById(user.id, {
        first_name: credentials.nombre,
        last_name: credentials.apellido,
        age: Number(credentials.edad),
        phone: credentials.telefono,
        email: credentials.username,
      });
      setUser({ type: 'UPDATE_USER', payload: { id: user.id, email: user.email, ...updatedUser } });
      notifySuccess('Usuario actualizado');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteAccount = async (target) => {
    try {
      if (!target?.id) return;
      await deleteUserById(target.id);
      setUserReserves([]);
      setUser({ type: 'LOGOUT' });
      notifySuccess('Cuenta Eliminada');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteReserve = async (reservationId) => {
    try {
      await deleteReserve(reservationId);
      await handleUserReserves();
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
      const isAuthorized = await userLogin({ username: user.email, password });
      if (isAuthorized && user?.id) {
        await updateUsersPassword(user, newPassword);
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
          <Link to='/' className='navbar-brand title'>Club Ranelagh</Link>

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
