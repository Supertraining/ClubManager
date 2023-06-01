import Menu from '../../components/menu/Menu';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './home.css';
import CreateUser from '../../components/createUser/CreateUser';
import GetAllUsers from '../../components/getAllUsers/GetAllUsers'
import { useState } from 'react';
import axios from '../../utils/axiosInstance.js'
import OldReservesDeleted from '../../components/oldReservesDeleted/OldReservesDeleted';
import { toast } from 'react-toastify';
import CreateCourt from '../../components/CreateCourt/CreateCourt';
import Main from '../../components/main/Main';
import GetAllCourts from '../../components/getAllCourts/GetAllCourts';


const Home = () => {

  const menuFeatures = {
    createUser: false,
    getAllUsers: false,
    deleteReserves: false,
    createCourt: false,
    getAllCourts: false,
    main: true
  }
  const [menu, setMenu] = useState(menuFeatures)

  const [user, setUser] = useState(false)

  const [allUsers, setAllUsers] = useState([])

  const [court, setCourt] = useState(false)

  const [allCourts, setAllCourts] = useState([])

  const [confirmDelete, setConfirmDelete] = useState(false)

  const navigate = useNavigate()

  const handleGetAllUsers = async () => {

    try {

      const allUsers = await axios.get('/getAll')

      setAllUsers(allUsers.data)

    } catch (error) {

      console.log(error)

    }

  };

  
  const notifyDeletedReserve = () => toast.error("Reserva Eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleDeleteReserve = async (court, day, id, userid) => {

    await axios.put(`/courts/reserve/delete`, {
      courtName: court,
      reserveDay: day,
      reserveId: id
    });

    await axios.put(`/reserves/delete`, {
      username: user.username,
      reserveId: id
    });

    const userById = await axios.get(`http://localhost:8080/user/${userid}`);

    setUser(userById.data)
    notifyDeletedReserve();

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
        setAllUsers([])
        setUser(false)
        navigate('/')
      }, 2000)


    } catch (error) {

      console.log(error)

    }
  }

  const notifyCourtCreated = () => toast.info("Cancha Creada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const handleCreateCourt = async (e, name) => {

    try {

      e.preventDefault()

      const res = await axios.post('/courts/createCourt', name)

      notifyCourtCreated();

    } catch (error) {

      console.log(error)

    }
  }

  const handleGetAllCourts = async () => {
    
    try {

      const allCourts = await axios.get('/courts/')

      setAllCourts(allCourts.data)
      
    } catch (error) {

      console.log(error)
      
    }

  }


  const handleDeleteOldReserves = async () => {

    try {

      await axios.put('/courts/reserve/clean')

    } catch (error) {

      console.log(error)

    }

  }
  return (

    <div className='home d-flex'>

      <Menu
        menu={menu}
        setMenu={setMenu}
        handleGetAllUsers={handleGetAllUsers}
        setConfirmDelete={setConfirmDelete}
        handleGetAllCourts={handleGetAllCourts}
      />
      {
        menu.main &&
        <Main />
      }


      <Routes>

        <Route
          exact path='/createUser'
          element={<CreateUser setMenu={setMenu} menu={menu} />}
        />

        <Route
          exact path='/getAllUsers'
          element={<GetAllUsers setMenu={setMenu} menu={menu} allUsers={allUsers} handleDeleteReserve={handleDeleteReserve} user={user} setUser={setUser} handleUpdateUser={handleUpdateUser} handleDeleteUser={handleDeleteUser} />}
        />

        <Route
          exact path='/getAllCourts'
          element={<GetAllCourts setMenu={setMenu} menu={menu} allCourts={allCourts} court={court} setCourt={setCourt} />}
        />

        <Route
          exact path='/createCourt'
          element={<CreateCourt setMenu={setMenu} handleCreateCourt={handleCreateCourt} />}
        />

        <Route
          exact path='/oldReservesDeleted'
          element={<OldReservesDeleted setMenu={setMenu} menu={menu} setConfirmDelete={setConfirmDelete} confirmDelete={confirmDelete} handleDeleteOldReserves={handleDeleteOldReserves} />}
        />

      </Routes>

    </div>

  )

}

export default Home