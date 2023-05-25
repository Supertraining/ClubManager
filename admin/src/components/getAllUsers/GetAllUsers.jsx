import { Link } from 'react-router-dom'
import './getAllUsers.css'
import User from '../user/User'
import { useState } from 'react'
import axios from '../../utils/axiosInstance.js'
import { ToastContainer, toast } from 'react-toastify';

const GetAllUsers = ({ setGetAll, allUsers, getAllUsers }) => {

  const [user, setUser] = useState(false)

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

    setUser(userById)
    notifyDeletedReserve();

  }


  return (

    <div className="col-9 p-1">
      {!user
        ? <>
          <div className='my-3'>
            <Link to={'/'} className='btn btn-close border border-dark p-2' onClick={() => setGetAll(false)}></Link>
          </div>

          <table className="table table-responsive">
            <thead>
              <tr className="text-center ">
                <th scope="col">#</th>
                <th scope="col">UserName</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">edad</th>
                <th scope="col">telefono</th>
                <th scope="col">reservas</th>
                <th scope="col">actividades</th>
                <th scope="col">admin</th>
              </tr>
            </thead>
            <tbody>

              {allUsers.length === 0

                ? <div className="spinner-grow text-success m-5" role="status"></div>

                : allUsers.map((user) => (

                  <tr key={user.id} className="text-center">

                    <td>{allUsers.length}</td>
                    <td>
                      <button className='btn text-primary' onClick={() => setUser(user)}>{user.username}</button>
                    </td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.edad}</td>
                    <td>{user.telefono}</td>
                    {user.reserves.length === 0 ? <td className='text-danger fw-bold'>Sin reservas</td> : <td className='text-success fw-bold'>Reservas activas</td>}
                    <td>@actividades</td>
                    <td>{user.admin.toString()}</td>

                  </tr>

                ))}
            </tbody>
          </table>
        </>
        : <User setUser={setUser} user={user} handleDeleteReserve={handleDeleteReserve} />
      }
       <div>
          <ToastContainer />
        </div>
    </div>
  )
}

export default GetAllUsers