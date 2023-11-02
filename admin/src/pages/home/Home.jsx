import Menu from '../../components/menu/Menu';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './home.css';
import CreateUser from '../../components/createUser/CreateUser';
import GetAllUsers from '../../components/user/getAllUsers/GetAllUsers'
import { useContext, useState } from 'react';
import axios from '../../utils/axiosInstance.js'
import OldReservesDeleted from '../../components/oldReservesDeleted/OldReservesDeleted';
import { toast } from 'react-toastify';
import Main from '../../components/main/Main';
import GetAllCourts from '../../components/courts/getAllCourts/GetAllCourts';
import { AuthContext } from '../../components/context/AuthContext';
import FailLogin from '../../components/auth/faillogin/FailLogin';
import Events from '../../components/eventos/Events';
import { useEffect } from 'react';
import Activities from '../../components/activities/Activities';
import GetAllActivities from '../../components/activities/GetAllActivities';
import UpdateActivities from '../../components/activities/UpdateActivities';
import { useCallback } from 'react';



const Home = () => {

  const auth = useContext(AuthContext);

  const menuFeatures = {
    createUser: false,
    getAllUsers: false,
    events: false,
    deleteReserves: false,
    getAllCourts: false,
    activities: false,
    getAllActivities: false,
    main: false
  }
  const [ menu, setMenu ] = useState(menuFeatures);
  const [ allUsers, setAllUsers ] = useState([]);
  const [ user, setUser ] = useState(false);

  const [ allCourts, setAllCourts ] = useState([]);
  const [ court, setCourt ] = useState(false);
  const [ courtId, setCourtId ] = useState();

  const [ confirmDelete, setConfirmDelete ] = useState(false);

  const navigate = useNavigate();

  const notifyTryAgainLater = () => toast.warn("Hubo un problema, por favor intente nuevamente mas tarde", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });

  const handleMenuClick = useCallback((option) => {
    setMenu({
      createUser: false,
      getAllUsers: false,
      events: false,
      deleteReserves: false,
      getAllCourts: false,
      activities: false,
      getAllActivities: false,
      main: false,
      [ option ]: true
    });
  }, [ setMenu ]);

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
      })

      setAllUsers(allUsers);

    } catch (error) {

      notifyTryAgainLater();
      console.log(error);

    }

  }, [ setAllUsers ]);

  const notifyDeletedReserve = () => toast.error("Reserva Eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteReserve = async (court, day, id, userid) => {

    try {


      await axios.put(`/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id
      });

      await axios.put(`/users/reserves/delete`, {
        username: user.username,
        reserveId: id
      });

      const userById = await axios.get(`/users/user/${userid}`);

      setUser(userById.data)
      notifyDeletedReserve();

    } catch (error) {

      console.log(error);
      notifyTryAgainLater();

    }

  };

  const notifyUserUpdated = () => toast.success("Usuario Actualizado", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleUpdateUser = async (e, credentials, id) => {

    try {
      e.preventDefault()

      await axios.put(`/users/update/${id}`, credentials);

      const userById = await axios.get(`/users/user/${id}`);

      setUser(userById.data)
      notifyUserUpdated();

    } catch (error) {

      console.log(error)
      notifyTryAgainLater();

    }

  };

  const notifyUserDeleted = () => toast.error("Usuario Eliminado", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteUser = async (user) => {
    try {

      await axios.delete(`/users/eliminar/${user._id}`);

      user.reserves.forEach(async (res) => {
        await axios.put(`/courts/reserve/delete`, {
          courtName: res.court,
          reserveDay: res.weekday,
          reserveId: res.id
        });
      })

      notifyUserDeleted();

      setTimeout(() => {
        handleGetAllUsers()
        setUser(false)
        navigate('/getAllUsers')
      }, 2000)


    } catch (error) {

      console.log(error)
      notifyTryAgainLater();

    }
  };

  const notifyCourtCreated = () => toast.info("Cancha Creada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleCreateCourt = async (e, name) => {

    try {

      e.preventDefault()

      await axios.post('/courts/createCourt', name)

      notifyCourtCreated();

      handleGetAllCourts()

    } catch (error) {

      console.log(error)
      notifyTryAgainLater();

    }
  };

  const handleGetAllCourts = useCallback(async () => {

    try {

      const allCourts = await axios.get('/courts/')

      setAllCourts(allCourts.data)

    } catch (error) {

      console.log(error)
      notifyTryAgainLater();

    }

  }, [ setAllCourts ]);

  const notifyCourtDeleted = () => toast.error("Cancha Eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteCourt = async (id) => {
    try {

      await axios.delete(`/courts/delete/${id}`)

      notifyCourtDeleted()

      handleGetAllCourts()

    } catch (error) {

      notifyTryAgainLater()
      console.log(error);

    }
  };

  const notifyOldReservesDeleted = () => toast.error("Historial de reservas Eliminado", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteOldReserves = async () => {

    try {

      await axios.put('/courts/reserve/clean')
      notifyOldReservesDeleted();

    } catch (error) {

      console.log(error);
      notifyTryAgainLater();

    }

  };

  const handleCloseSession = async () => {

    try {

      auth.dispatch({ type: 'LOGOUT' });
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');

    } catch (error) {

      console.log(error)

    }

  };
  useEffect(() => {
    if (auth.user === null) {
      navigate('/login')
    }
    const { pathname } = window.location
    if (pathname === '/home' || pathname === '/') {
      handleMenuClick('main')
    }
  }, [ auth.user, handleMenuClick, navigate ]);

  const conditionalRender = () => {
    try {
      if (auth?.user) {
        return true
      } else if (auth?.user?.admin === false) {
        return <FailLogin />
      }
    } catch (error) {
      console.log(error)
    }
  };
 
  return (

    <>

      { conditionalRender()
        ?
        <>
          <div className='col-2 text-center p-3'>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='offcanvas'
              data-bs-target='#offcanvasDarkNavbar'
              aria-controls='offcanvasDarkNavbar'
              aria-label='Toggle navigation'
            >
              <i className="bi bi-menu-button-wide fs-1 text-success"></i>
            </button>
          </div>

          <div className='home'>

            <Menu
              menu={ menu }
              setMenu={ setMenu }
              handleMenuClick={ handleMenuClick }
              handleGetAllUsers={ handleGetAllUsers }
              setConfirmDelete={ setConfirmDelete }
              handleGetAllCourts={ handleGetAllCourts }
              handleCloseSession={ handleCloseSession }
            />
            {
              menu.main &&
              <Main />
            }


            <Routes>

              <Route
                exact path={ import.meta.env.VITE_PROD_URL || '/createUser' }
                element={ <CreateUser
                  handleMenuClick={ handleMenuClick }
                  menu={ menu } /> }
              />

              <Route
                exact path='/getAllUsers'
                element={ <GetAllUsers
                  handleMenuClick={ handleMenuClick }
                  menu={ menu }
                  handleGetAllUsers={ handleGetAllUsers }
                  allUsers={ allUsers }
                  handleDeleteReserve={ handleDeleteReserve }
                  user={ user } setUser={ setUser }
                  handleUpdateUser={ handleUpdateUser }
                  handleDeleteUser={ handleDeleteUser }
                  setConfirmDelete={ setConfirmDelete }
                  confirmDelete={ confirmDelete } /> }
              />

              <Route
                exact path='/courts'
                element={ <GetAllCourts
                  handleMenuClick={ handleMenuClick }
                  menu={ menu }
                  handleGetAllCourts={ handleGetAllCourts }
                  allCourts={ allCourts }
                  court={ court }
                  setCourt={ setCourt }
                  handleCreateCourt={ handleCreateCourt }
                  handleDeleteCourt={ handleDeleteCourt }
                  setConfirmDelete={ setConfirmDelete }
                  confirmDelete={ confirmDelete }
                  setCourtId={ setCourtId }
                  courtId={ courtId } /> }
              />

              <Route
                exact path='/events'
                element={ <Events
                  handleMenuClick={ handleMenuClick }
                  menu={ menu } /> }
              />

              <Route
                exact path='/activities'
                element={ <Activities
                  handleMenuClick={ handleMenuClick }
                  menu={ menu } /> }
              />
              <Route
                exact path='/getAllActivities'
                element={ <GetAllActivities
                  handleMenuClick={ handleMenuClick }
                  menu={ menu } /> }
              />

              <Route
                exact path='/updateActivities/'
                element={ <UpdateActivities /> }
              />

              <Route
                exact path='/oldReservesDeleted'
                element={ <OldReservesDeleted
                  handleMenuClick={ handleMenuClick }
                  menu={ menu }
                  setConfirmDelete={ setConfirmDelete }
                  confirmDelete={ confirmDelete }
                  handleDeleteOldReserves={ handleDeleteOldReserves } /> }
              />

            </Routes>

          </div >
        </>
        :
        <>
          { conditionalRender() }
        </>

      }

    </>

  )

}

export default Home