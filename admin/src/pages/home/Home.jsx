import Menu from '../../components/menu/Menu';
import { Routes, Route } from 'react-router-dom';
import './home.css';
import CreateUser from '../../components/createUser/CreateUser';
import GetAllUsers from '../../components/getAllUsers/GetAllUsers'
import { useState } from 'react';
import axios from '../../utils/axiosInstance.js'

const Home = () => {

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showGetAll, setShowGetAll] = useState(false);
  const [allUsers, setAllUsers] = useState([])

  const getAllUsers = async () => {
    
    const allUsers = await axios.get('/getAll')
    setAllUsers(allUsers.data)

  };


  return (
    <div className='home d-flex'>

      <Menu
        setShowCreateUser={setShowCreateUser} showCreateUser={showCreateUser}
        setShowGetAll={setShowGetAll} showGetAll={showGetAll} getAllUsers={getAllUsers}
      />

      <Routes>

        <Route exact path='/createUser' element={<CreateUser setShowCreateUser={setShowCreateUser} showCreateUser={showCreateUser} />} />

        <Route exact path='/getAllUsers' element={<GetAllUsers setShowGetAll={setShowGetAll} showGetAll={showGetAll} allUsers={allUsers} getAllUsers={getAllUsers} />} />

      </Routes>

    </div>
  )
}

export default Home