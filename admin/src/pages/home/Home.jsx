import Menu from '../../components/menu/Menu';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './home.css';
import CreateUser from '../../components/createUser/CreateUser';
import GetAllUsers from '../../components/getAllUsers/GetAllUsers'
import { useContext, useState } from 'react';
import axios from '../../utils/axiosInstance.js'
import OldReservesDeleted from '../../components/oldReservesDeleted/OldReservesDeleted';
import { toast } from 'react-toastify';
import Main from '../../components/main/Main';
import GetAllCourts from '../../components/getAllCourts/GetAllCourts';
import { AuthContext } from '../../components/context/AuthContext';
import FailLogin from '../../components/faillogin/FailLogin';
import Eventos from '../../components/eventos/Eventos';
import { useEffect } from 'react';


const Home = () => {

  const auth = useContext(AuthContext)

  const menuFeatures = {
    createUser: false,
    getAllUsers: false,
    events: false,
    deleteReserves: false,
    getAllCourts: false,
    main: true
  }
  const [ menu, setMenu ] = useState(menuFeatures)

  const [ allUsers, setAllUsers ] = useState([])
  const [ user, setUser ] = useState(false)

  const [ allCourts, setAllCourts ] = useState([])
  const [ court, setCourt ] = useState(false)
  const [ courtId, setCourtId ] = useState()

  const [ confirmDelete, setConfirmDelete ] = useState(false)

  const navigate = useNavigate()

  const notifyTryAgainLater = () => toast.warn("Hubo un problema, por favor intente nuevamente mas tarde", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });

  const handleMenuClick = (option) => {
    setMenu({
      createUser: false,
      getAllUsers: false,
      events: false,
      deleteReserves: false,
      getAllCourts: false,
      main: false,
      [ option ]: true
    });
  };

  const handleGetAllUsers = async () => {

    try {

      const allUsers = await axios.get('/getAll');

      setAllUsers(allUsers.data);

    } catch (error) {

      notifyTryAgainLater();
      console.log(error);

    }

  };

  const notifyDeletedReserve = () => toast.error("Reserva Eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteReserve = async (court, day, id, userid) => {

    try {


      await axios.put(`/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id
      });

      await axios.put(`/reserves/delete`, {
        username: user.username,
        reserveId: id
      });

      const userById = await axios.get(`/user/${userid}`);

      setUser(userById.data)
      notifyDeletedReserve();

    } catch (error) {

      console.log(error);
      notifyTryAgainLater();

    }

  }

  const notifyUserUpdated = () => toast.success("Usuario Actualizado", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleUpdateUser = async (e, credentials, id) => {

    try {
      e.preventDefault()

      await axios.put(`/update/${id}`, credentials);

      const userById = await axios.get(`/user/${id}`);

      setUser(userById.data)
      notifyUserUpdated();

    } catch (error) {

      console.log(error)
      notifyTryAgainLater();

    }

  }

  const notifyUserDeleted = () => toast.error("Usuario Eliminado", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteUser = async (user) => {
    try {

      await axios.delete(`/eliminar/${user._id}`);

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
  }

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
  }

  const handleGetAllCourts = async () => {

    try {

      const allCourts = await axios.get('/courts/')

      setAllCourts(allCourts.data)

    } catch (error) {

      console.log(error)
      notifyTryAgainLater();

    }

  }

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
  }

  const notifyOldReservesDeleted = () => toast.error("Historial de reservas Eliminado", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteOldReserves = async () => {

    try {

      await axios.put('/courts/reserve/clean')
      notifyOldReservesDeleted();

    } catch (error) {

      console.log(error);
      notifyTryAgainLater();

    }

  }

  const handleCloseSession = async () => {

    try {

      auth.dispatch({ type: 'LOGOUT' });

    } catch (error) {

      console.log(error)

    }

  }
  useEffect(() => {
    if (auth.user === null) {
      navigate('/login')
    }
  }, [auth.user, navigate])

  console.log(auth.user)
  const conditionalRender = () => {
    if (auth?.user === null) {
      return true
    } else if (auth?.user?.admin === false) {
      return <FailLogin />
    }
  }



  return (

    <>

      { !conditionalRender()
        ?
        <div className='home d-flex'>

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
              exact path='/createUser'
              element={ <CreateUser setMenu={ setMenu } menu={ menu } /> }
            />

            <Route
              exact path='/getAllUsers'
              element={ <GetAllUsers setMenu={ setMenu } menu={ menu } allUsers={ allUsers } handleDeleteReserve={ handleDeleteReserve } user={ user } setUser={ setUser } handleUpdateUser={ handleUpdateUser } handleDeleteUser={ handleDeleteUser } setConfirmDelete={ setConfirmDelete } confirmDelete={ confirmDelete } /> }
            />

            <Route
              exact path='/courts'
              element={ <GetAllCourts setMenu={ setMenu } menu={ menu } allCourts={ allCourts } court={ court } setCourt={ setCourt } handleCreateCourt={ handleCreateCourt } handleDeleteCourt={ handleDeleteCourt } setConfirmDelete={ setConfirmDelete } confirmDelete={ confirmDelete } setCourtId={ setCourtId } courtId={ courtId } /> }
            />

            <Route
              exact path='/events'
              element={ <Eventos setMenu={ setMenu } menu={ menu } /> }
            />

            <Route
              exact path='/oldReservesDeleted'
              element={ <OldReservesDeleted setMenu={ setMenu } menu={ menu } setConfirmDelete={ setConfirmDelete } confirmDelete={ confirmDelete } handleDeleteOldReserves={ handleDeleteOldReserves } /> }
            />

          </Routes>

        </div >
        :
        <>
          { conditionalRender() }
        </>

      }

    </>

  )

}

export default Home