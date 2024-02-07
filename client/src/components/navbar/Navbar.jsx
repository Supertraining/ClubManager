import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../../utils/axiosInstance';
import { isStrongPassword } from 'validator';
import { ReserveBoardContext } from '../context/ReserveBoardUpdate';
import NavBarOffCanvasStart from '../navBarOffCanvasStart/NavBarOffCanvasStart';
import NavBarOffCanvasEnd from '../navBarOffCanvasEnd/NavBarOffCanvasEnd';
import useNotifications from '../../hooks/useNotifications';

const Navbar = () => {
  const [userReserves, setUserReserves] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [strongPassword, setStrongPassword] = useState(true);
  const [showReserves, setShowReserves] = useState(false);

  const navigate = useNavigate();
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();

  const { user, dispatch } = useContext(AuthContext);
  const { setReserveDeleted } = useContext(ReserveBoardContext);

  const handleUserReserves = async () => {
    try {
      const { data } = await axios.get(`/users/user/${user?._id}`);
      setUserReserves(data.reserves);
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
    try {
      dispatch({ type: 'LOGOUT' });

      localStorage.removeItem('user');

      navigate('/');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleUpdateUser = async (e, credentials) => {
    try {
      e.preventDefault();

      const { data: updatedUser } = await axios.put(
        `/users/update/${credentials._id}`,
        {
          ...credentials,
          reserves: userReserves,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
          },
        }
      );

      const { data: reserveUpdated } = await axios.put(
        '/courts/reserve/userUpdate',
        {
          user: user.username,
          newUser: credentials.username,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
          },
        }
      );

      await dispatch({ type: 'UPDATE_USER', payload: { ...updatedUser, token: user.token } });

      handleUserReserves();

      setReserveDeleted(true);

      notifySuccess('Usuario actualizado');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteAccount = async (user) => {
    try {
      await axios.put(
        '/courts/reserve/deleteByUsername',
        { username: user.username },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
          },
        }
      );

      const res = await axios.delete(`/users/eliminar/${user._id}`, 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
        });
      
      setUserReserves([]);
      
      if (res.data === true) {
        dispatch({ type: 'LOGOUT' });

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
      await axios.put(`/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id,
      });

      await axios.put(`/users/reserves/delete`, {
        username: user.username,
        reserveId: id,
      });

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
      const passwordValidationOptions = {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      };

      if (!isStrongPassword(data.newPassword, passwordValidationOptions)) {
        setStrongPassword(false);
        return;
      }

      setStrongPassword(true);

      const res = await axios.post('/users/login', {
        username: user.username,
        password: data.password,
      });

      if (res.status === 200)
        await axios.put('/users/update', { ...user, password: data.newPassword });

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
