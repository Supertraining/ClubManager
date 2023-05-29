import './navbar.css'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ReserveBoardContext } from '../context/ReserveBoardUpdate'
import NavBarOffCanvasStart from '../navBarOffCanvasStart/NavBarOffCanvasStart'
import NavBarOffCanvasEnd from '../navBarOffCanvasEnd/NavBarOffCanvasEnd'


const Navbar = () => {

  const [delAccountMssg, setDelAccountMssg] = useState(false)
  const [userReserves, setUserReserves] = useState([])
  const [showProfile, setShowProfile] = useState(false)

  const navigate = useNavigate();

  const { user, dispatch } = useContext(AuthContext);
  const { setReserveDeleted } = useContext(ReserveBoardContext)

  const handleUserReserves = async () => {
    try {

      const { data } = await axios.get(`http://localhost:8080/user/${user?._id}`)

      setUserReserves(data.reserves)

    } catch (error) {

      console.log(error)

    }

  }

  const futbolReserves = userReserves?.filter((res) => res.court === 'futbol')
  const paddleReserves = userReserves?.filter((res) => res.court === 'paddle')
  const squashReserves = userReserves?.filter((res) => res.court === 'squash')
  const paletaReserves = userReserves?.filter((res) => res.court === 'paleta')

  const allArrays = [futbolReserves, paddleReserves, squashReserves, paletaReserves].some(arr => arr.length > 0);

  const handleCloseSession = async () => {

    try {

      dispatch({ type: 'LOGOUT' })

      const log = await axios.post('http://localhost:8080/logout', {}, { withCredentials: true })

      navigate('/')

    } catch (error) {

      console.log(error)

    }

  }

  const handleDeleteAccount = async () => {

    try {

      const res = await axios.delete(`http://localhost:8080/eliminar/${user._id}`)

      res.data === 1 && (dispatch({ type: 'LOGOUT' }) && setDelAccountMssg(true))

      setTimeout(() => {

        navigate('/')

      }, 2000)

    } catch (error) {

      console.log(error)

    }

  }

  const notifyDeletedReserve = () => toast.error("Reserva Eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });

  const handleDeleteReserve = async (court, day, id) => {

    try {

      await axios.put(`http://localhost:8080/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id
      });

      await axios.put(`http://localhost:8080/reserves/delete`, {
        username: user.username,
        reserveId: id
      });

      handleUserReserves();

      setReserveDeleted(true);

      notifyDeletedReserve();

    } catch (error) {

      console.log(error)

    }

  }

  return (
    
    <div
      className="navBarContainer">

      <nav
        className="navbar navbar-dark bg-dark sticky-top h-100">

        <div
          className="container-fluid">

          <a
            className="navbar-brand" href="#">
            Club xxxx
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation">

            <span className="navbar-toggler-icon"></span>

          </button>

          <NavBarOffCanvasStart
            handleCloseSession={handleCloseSession}
            handleUserReserves={handleUserReserves}
            user={user}
          />

        </div>

        <NavBarOffCanvasEnd
          setShowProfile={setShowProfile}
          handleDeleteAccount={handleDeleteAccount}
          delAccountMssg={delAccountMssg}
          showProfile={showProfile}
          handleDeleteReserve={handleDeleteReserve}
          allArrays={allArrays}
          futbolReserves={futbolReserves}
          paddleReserves={paddleReserves}
          squashReserves={squashReserves}
          paletaReserves={paletaReserves}
          user={user}
        />

      </nav>

    </div>

  )
}

export default Navbar

