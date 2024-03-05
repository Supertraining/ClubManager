import { Routes, Route, useNavigate } from 'react-router-dom';

import './home.css';

import { CreateUser, GetAllUsers } from '../../components/user/pages';
import Menu from '../../components/menu/Menu';
import OldReservesDeleted from '../../components/oldReservesDeleted/OldReservesDeleted';
import Main from '../../components/main/Main';
import GetAllCourts from '../../components/courts/pages/getAllCourts/GetAllCourts';
import FailLogin from '../../components/auth/faillogin/FailLogin';
import Events from '../../components/events/pages/events/Events';

import {
  CreateActivity,
  GetAllActivities,
  UpdateActivities,
} from '../../components/activities/pages';

import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { userStore } from '../../stores/index';
import {
  useNotifications,
  useAxiosInstance,
  useReservesAPI,
  useUserAPI,
  useCourtAPI,
} from '../../hooks';

const Home = () => {
  const {
    user: { user: admin },
    updateUser,
  } = userStore();

  const { notifySuccess, notifyWarning } = useNotifications();
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const { deleteCourtReserve, deleteUserReserve } = useReservesAPI();
  const { getAllUsers, updateUserById, deleteUserById, getUserById, closeSession } = useUserAPI();
  const { getAllCourts, deleteCourt, deleteOldReserves } = useCourtAPI();

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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserSelected, setIsUserSelected] = useState(false);

  const [allCourts, setAllCourts] = useState([]);
  const [court, setCourt] = useState(false);
  const [courtId, setCourtId] = useState();

  const [confirmDelete, setConfirmDelete] = useState(false);

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
      const allUsersResponse = await getAllUsers();

      setAllUsers(allUsersResponse);
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  }, []);

  const handleDeleteReserve = async (court, day, id, userid, user) => {
    try {
      deleteCourtReserve(court, day, id);

      deleteUserReserve(user, id);

      const userById = await getUserById(userid);

      notifySuccess('Reserva eliminada');

      return userById;
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleUpdateUser = async (e, credentials, id) => {
    try {
      e.preventDefault();

      const updatedUser = updateUserById(id, credentials);

      setSelectedUser(updatedUser);

      if (credentials.username === admin.username) {
        updateUser();
      }

      notifySuccess('Usuario actualizado');
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      deleteUserById(user._id);

      user.reserves.forEach(async (res) => {
        const { court, weekday, id } = res;
        deleteCourtReserve(court, weekday, id);
      });

      notifySuccess('Usuario eliminado');

      setTimeout(() => {
        handleGetAllUsers();
        setIsUserSelected(false);
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
      const allCourts = await getAllCourts();
      setAllCourts(allCourts);
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  }, [getAllCourts, notifyWarning]);

  const handleDeleteCourt = async (id) => {
    deleteCourt(id);

    handleGetAllCourts();
  };

  const handleDeleteOldReserves = async () => {
    deleteOldReserves();
  };

  const handleCloseSession = async () => {
    closeSession();
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
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    isUserSelected={isUserSelected}
                    setIsUserSelected={setIsUserSelected}
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
                  <CreateActivity
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
