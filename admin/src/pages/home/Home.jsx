import Menu from '../../components/menu/Menu';
import { Routes, Route } from 'react-router-dom';
import './home.css';
import CreateUser from '../../components/createUser/CreateUser';
import GetAllUsers from '../../components/getAllUsers/GetAllUsers'
import { useState } from 'react';
import axios from '../../utils/axiosInstance.js'
import OldReservesDeleted from '../../components/oldReservesDeleted/OldReservesDeleted';

const Home = () => {

  const [showCreateUser, setShowCreateUser] = useState(false);

  const [showGetAll, setShowGetAll] = useState(false);
  const [allUsers, setAllUsers] = useState([])

  const [showResDeleted, setShowResDeleted] = useState(false)

  const getAllUsers = async () => {

    
    const allUsers = await axios.get('/getAll')

    setAllUsers(allUsers.data)

  };

  const deleteOldReserves = async () => {
    try {

      await axios.put('/courts/reserve/clean')
      
    } catch (error) {
      
      console.log(error)

    }
  }


  return (
    <div className='home d-flex'>

      <Menu
        showCreateUser={showCreateUser}
        setShowCreateUser={setShowCreateUser} 

        showGetAll={showGetAll} getAllUsers={getAllUsers}
        setShowGetAll={setShowGetAll} 

        showResDeleted={showResDeleted}
        setShowResDeleted={setShowResDeleted}
        deleteOldReserves={deleteOldReserves}

      />

      <Routes>

        <Route exact path='/createUser' element={<CreateUser setShowCreateUser={setShowCreateUser} showCreateUser={showCreateUser} />} />

        <Route exact path='/getAllUsers' element={<GetAllUsers setShowGetAll={setShowGetAll} showGetAll={showGetAll} allUsers={allUsers} getAllUsers={getAllUsers} />} />

        <Route exact path='/oldReservesDeleted' element={<OldReservesDeleted setShowResDeleted={setShowResDeleted} />} />

      </Routes>

    </div>
  )
}

export default Home