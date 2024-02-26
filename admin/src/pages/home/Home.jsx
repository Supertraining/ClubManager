import Menu from '../../components/menu/Menu';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './home.css';
import CreateUser from '../../components/createUser/CreateUser';
import GetAllUsers from '../../components/user/getAllUsers/GetAllUsers';
import { useState } from 'react';
import OldReservesDeleted from '../../components/oldReservesDeleted/OldReservesDeleted';
import Main from '../../components/main/Main';
import GetAllCourts from '../../components/courts/pages/getAllCourts/GetAllCourts';
import FailLogin from '../../components/auth/faillogin/FailLogin';
import Events from '../../components/eventos/Events';
import { useEffect } from 'react';
import Activities from '../../components/activities/Activities';
import GetAllActivities from '../../components/activities/GetAllActivities';
import UpdateActivities from '../../components/activities/UpdateActivities';
import { useCallback } from 'react';
import useNotifications from '../../hooks/useNotifications.jsx';
import useAxiosInstance from '../../hooks/useAxiosInstance.jsx';
import { userStore } from '../../stores/index';

const Home = () => {
  const {
    user: { user: admin },
    setUser,
  } = userStore();

  const { notifySuccess, notifyWarning } = useNotifications();
  const axios = useAxiosInstance();

  const menuFeatures = {
    createUser: false,
    getAllUsers: false,
    events: false,
    deleteReserves: false,
    getAllCourts: false,
    activities: false,
    getAllActivities: false,
    main: false,
  };
  const [menu, setMenu] = useState(menuFeatures);
  const [allUsers, setAllUsers] = useState([]);

  const [allCourts, setAllCourts] = useState([]);
  const [court, setCourt] = useState(false);
  const [courtId, setCourtId] = useState();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const navigate = useNavigate();

  const handleMenuClick = useCallback(
    (option) => {
      setMenu({
        createUser: false,
        getAllUsers: false,
        events: false,
        deleteReserves: false,
        getAllCourts: false,
        activities: false,
        getAllActivities: false,
        main: false,
        [option]: true,
      });
    },
    [setMenu]
  );

  const handleGetAllUsers = useCallback(async () => {
    try {
      const { data: allUsers } = await axios.get('/users/getAll');

      allUsers.sort((a, b) => {
        if (a.apellido > b.apellido) {
          return 1;
        }
        if (a.apellido < b.apellido) {
          return -1;
        }
        return 0;
      });

      setAllUsers(allUsers);
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  }, []);

  const handleDeleteReserve = async (court, day, id, userid, user) => {
    try {
  
      await axios.put(`/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id,
      });

      await axios.put(`/users/reserves/delete`, {
        username: user,
        reserveId: id,
      });

      const { data: userById } = await axios.get(`/users/user/${userid}`); 

      notifySuccess('Reserva eliminada');
   
      return userById;

    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleUpdateUser = async (e, credentials, id) => {
    try {
      e.preventDefault();

      await axios.put(`/users/update/${id}`, credentials);

      const userById = await axios.get(`/users/user/${id}`);

      setUser(userById.data);
      notifySuccess('Usuario actualizado');
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await axios.delete(`/users/eliminar/${user._id}`);

      user.reserves.forEach(async (res) => {
        await axios.put(`/courts/reserve/delete`, {
          courtName: res.court,
          reserveDay: res.weekday,
          reserveId: res.id,
        });
      });

      notifySuccess('Usuario eliminado');

      setTimeout(() => {
        handleGetAllUsers();
        setUser(false);
        navigate('/getAllUsers');
      }, 2000);
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleCreateCourt = async (e, name) => {
    try {
      e.preventDefault();

      await axios.post('/courts/createCourt', name);

      notifySuccess('Cancha creada');

      handleGetAllCourts();
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleGetAllCourts = useCallback(async () => {
    try {
      const allCourts = await axios.get('/courts/');

      setAllCourts(allCourts.data);
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  }, [setAllCourts]);

  const handleDeleteCourt = async (id) => {
    try {
      await axios.delete(`/courts/delete/${id}`);

      notifySuccess('Cancha eliminada');

      handleGetAllCourts();
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde')();
    }
  };

  const handleDeleteOldReserves = async () => {
    try {
      await axios.put('/courts/reserve/clean');
      notifySuccess('Historial de reservas eliminadas');
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleCloseSession = async () => {
    try {
      setUser({ type: 'LOGOUT' });
      localStorage.removeItem('user')
      navigate('/login');
      
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  useEffect(() => {
    
    if (admin === null) {
      navigate('/login');
    }

    const { pathname } = window.location;
    if (pathname === '/home' || pathname === '/') {
      handleMenuClick('main');
    }
  }, [admin, handleMenuClick, navigate]);

  const conditionalRender = () => {
    try {
      if (admin) {
        return true;
      } else if (admin?.admin === false) {
        return <FailLogin />;
      }
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  return (
    <>
      {conditionalRender() ? (
        <>
          <div className='col-2 text-center p-3'>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='offcanvas'
              data-bs-target='#offcanvasDarkNavbar'
              aria-controls='offcanvasDarkNavbar'
              aria-label='Toggle navigation'>
              <i className='bi bi-menu-button-wide fs-1 text-success'></i>
            </button>
          </div>

          <div className='home'>
            <Menu
              menu={menu}
              setMenu={setMenu}
              handleMenuClick={handleMenuClick}
              handleGetAllUsers={handleGetAllUsers}
              setConfirmDelete={setConfirmDelete}
              handleGetAllCourts={handleGetAllCourts}
              handleCloseSession={handleCloseSession}
            />
            {menu.main && <Main />}

            <Routes>
              <Route
                exact
                path='/createUser'
                element={
                  <CreateUser
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                  />
                }
              />

              <Route
                exact
                path='/getAllUsers'
                element={
                  <GetAllUsers
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                    handleGetAllUsers={handleGetAllUsers}
                    allUsers={allUsers}
                    handleDeleteReserve={handleDeleteReserve}
                    handleUpdateUser={handleUpdateUser}
                    handleDeleteUser={handleDeleteUser}
                    setConfirmDelete={setConfirmDelete}
                    confirmDelete={confirmDelete}
                  />
                }
              />

              <Route
                exact
                path='/courts'
                element={
                  <GetAllCourts
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                    handleGetAllCourts={handleGetAllCourts}
                    allCourts={allCourts}
                    court={court}
                    setCourt={setCourt}
                    handleCreateCourt={handleCreateCourt}
                    handleDeleteCourt={handleDeleteCourt}
                    setConfirmDelete={setConfirmDelete}
                    confirmDelete={confirmDelete}
                    setCourtId={setCourtId}
                    courtId={courtId}
                  />
                }
              />

              <Route
                exact
                path='/events'
                element={
                  <Events
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                  />
                }
              />

              <Route
                exact
                path='/activities'
                element={
                  <Activities
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                  />
                }
              />
              <Route
                exact
                path='/getAllActivities'
                element={
                  <GetAllActivities
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                  />
                }
              />

              <Route
                exact
                path='/updateActivities/'
                element={<UpdateActivities />}
              />

              <Route
                exact
                path='/oldReservesDeleted'
                element={
                  <OldReservesDeleted
                    handleMenuClick={handleMenuClick}
                    menu={menu}
                    setConfirmDelete={setConfirmDelete}
                    confirmDelete={confirmDelete}
                    handleDeleteOldReserves={handleDeleteOldReserves}
                  />
                }
              />
            </Routes>
          </div>
        </>
      ) : (
        <>{conditionalRender()}</>
      )}
    </>
  );
};

export default Home;
