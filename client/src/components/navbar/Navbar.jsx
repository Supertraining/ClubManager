import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import Login from '../auth/login/Login'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReserveBoardContext } from '../context/ReserveBoardUpdate'
import MyUser from '../myUser/MyUser'



const Navbar = () => {

  const [delAccountMssg, setDelAccountMssg] = useState(false)
  const [userReserves, setUserReserves] = useState([])
  const [showProfile, setShowProfile] = useState(false)

  const navigate = useNavigate();

  const { user, dispatch } = useContext(AuthContext);
  const { setReserveDeleted } = useContext(ReserveBoardContext)

  const handleUserReserves = async () => {
    
    const { data } = await axios.get(`http://localhost:8080/user/${user?._id}`)

    setUserReserves(data.reserves)

  }

  const futbolReserves = userReserves?.filter((res) => res.court === 'futbol')
  const paddleReserves = userReserves?.filter((res) => res.court === 'paddle')
  const squashReserves = userReserves?.filter((res) => res.court === 'squash')
  const paletaReserves = userReserves?.filter((res) => res.court === 'paleta')

  const allArrays = [futbolReserves, paddleReserves, squashReserves, paletaReserves].some(arr => arr.length > 0);

  const handleCloseSession = async () => {

    dispatch({ type: 'LOGOUT' })

    const log = await axios.post('http://localhost:8080/logout', {}, { withCredentials: true })

    navigate('/')

  }

  const handleDeleteAccount = async () => {

    const res = await axios.delete(`http://localhost:8080/eliminar/${user._id}`)

    res.data === 1 && (dispatch({ type: 'LOGOUT' }) && setDelAccountMssg(true))

    setTimeout(() => {

      navigate('/')

    }, 2000)

  }

  const notifyDeletedReserve = () => toast.error("Reserva Eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });

  const handleDeleteReserve = async (court, day, id) => {

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

  }

  return (
    <div className="navBarContainer">

      <nav className="navbar navbar-dark bg-dark sticky-top h-100">

        <div className="container-fluid">

          <a className="navbar-brand" href="#">Club xxxx</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="offcanvas offcanvas-start border offCanvasBg" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header justify-content-end">
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">

              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 my-5">

                <li className="nav-item d-flex align-items-center my-4">
                  <i className="bi bi-house mx-1 text-white"></i>
                  <Link className="nav-link text-white text-decoration-underline" aria-current="page" to='/'>Home</Link>
                </li>
                {user && <li className="nav-item border border-info rounded userLiItem">
                  <a className='text-info text-decoration-none p-3' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleUserReserves}>
                    {user?.username}
                    <i className="bi bi-plug-fill text-success mx-1"></i>
                  </a>
                </li>}


                {!user
                  ? <Login />

                  : <><li className="nav-item dropdown">

                    <Link className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                      Canchas
                    </Link>

                    <ul className="dropdown-menu bg-transparent">

                      <li>
                        <i className="bi bi-caret-right-fill text-info">
                        </i><Link className="dropdownitem" to='reserves' state={{ court: 'futbol' }}>Futbol</Link>
                      </li>
                      <li>
                        <i className="bi bi-caret-right-fill text-info"></i>
                        <Link className="dropdownitem" to='reserves' state={{ court: 'paleta' }}>Pelota Paleta</Link>
                      </li>
                      <li>
                        <i className="bi bi-caret-right-fill text-info"></i>
                        <Link className="dropdownitem" to='reserves' state={{ court: 'paddle' }}>Paddle</Link>
                      </li>
                      <li>
                        <i className="bi bi-caret-right-fill text-info"></i>
                        <Link className="dropdownitem" to='reserves' state={{ court: 'squash' }}>Squash</Link>
                      </li>
                    </ul>

                  </li>

                    <li className="nav-item dropdown">

                      <Link className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Actividades
                      </Link>

                      <ul className="dropdown-menu bg-transparent">
                        <li>
                          <i className="bi bi-caret-right-fill text-info"></i>
                          <Link className="dropdownitem" href="#">Patin</Link>
                        </li>
                        <li>
                          <i className="bi bi-caret-right-fill text-info"></i>
                          <Link className="dropdownitem" href="#">Gimnasia artística</Link>
                        </li>
                        <li><i className="bi bi-caret-right-fill text-info"></i>
                          <Link className="dropdownitem" href="#">Free dance</Link>
                        </li>
                        <li><i className="bi bi-caret-right-fill text-info"></i>
                          <Link className="dropdownitem" href="#">Futbol infantil</Link>
                        </li>
                      </ul>

                    </li>
                  </>
                }

              </ul>

            </div>

            {user && <div className="text-center my-3">
              <button className='btn btn-danger m-auto' onClick={handleCloseSession}>
                Cerrar sesión
              </button>
            </div>}

          </div>

        </div>
      </nav>

      <div className="offcanvas offcanvas-end offCanvasBg" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div>
          <ToastContainer />
        </div>
        <div>
        </div>
        <div className="offcanvas-header">

          <h5 className="offcanvas-title m-1 text-white" id="offcanvasExampleLabel">{user?.username}</h5>

          <button className='btn btn-success m-1 p-1' onClick={() => setShowProfile(!showProfile)}>Mi perfil</button>

          <button type="button" className="btn-close btn-close-white m-1" data-bs-dismiss="offcanvas" aria-label="Close"></button>

        </div>

        <div className="offcanvas-body">

          <div className='my-4 d-flex flex-column align-items-center'>

            {showProfile && <MyUser handleDeleteAccount={handleDeleteAccount} delAccountMssg={delAccountMssg} />}

            {!showProfile &&
              <div className='rounded bg-dark p-1 text-center'>
                <h5 className='text-success fw-bold'>Mis reservas:</h5>
                {!allArrays
                  && (<div className='text-white'>No tienes reservas activas</div>)}
              </div>
            }

          </div>

          {(allArrays && !showProfile) &&
            <div className='d-flex flex-column align-items-center border border-dark p-1 my-2'>

              <table className='table table-responsive w-100'>
                <thead className='bg-dark text-white text-center'>
                  <tr>
                    <th scope='col' className='text-center'>Actividad</th>
                    <th scope='col' className='text-center'>fecha</th>
                    <th scope='col' className='text-center'>Inicia</th>
                    <th scope='col' className='text-center'>Finaliza</th>
                    <th scope='col' className='text-center'>Anular</th>
                  </tr>
                </thead>
                <tbody>
                  {futbolReserves?.map((res, i) => (

                    <tr className='bg-success fw-bold my-1 text-dark text-center' key={i}>
                      <td>
                        {res.court}
                      </td>
                      <td>
                        {res.date}
                      </td>
                      <td>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td><button className='alert alert-danger m-0 px-2 py-0' onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}><i className="bi bi-exclamation-triangle"></i></button>

                      </td>
                    </tr>
                  ))}
                  {paddleReserves?.map((res, i) => (

                    <tr className='bg-primary fw-bold my-1 text-dark' key={i}>
                      <td className='text-center'>
                        {res.court}
                      </td>
                      <td className='text-center'>
                        {res.date}
                      </td>
                      <td className='text-center'>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td className='text-center'>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td className='text-center'><button className='alert alert-danger m-0 px-2 py-0' onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}><i className="bi bi-exclamation-triangle"></i></button>

                      </td>
                    </tr>
                  ))}
                  {squashReserves?.map((res, i) => (

                    <tr className='bg-info fw-bold my-1 text-dark' key={i}>
                      <td className='text-center'>
                        {res.court}
                      </td>
                      <td className='text-center'>
                        {res.date}
                      </td>
                      <td className='text-center'>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td className='text-center'>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td className='text-center'><button className='alert alert-danger m-0 px-2 py-0' onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}><i className="bi bi-exclamation-triangle"></i></button>

                      </td>
                    </tr>
                  ))}
                  {paletaReserves?.map((res, i) => (

                    <tr className='bg-light fw-bold my-1 text-dark' key={i}>
                      <td className='text-center'>
                        {res.court}
                      </td>
                      <td className='text-center'>
                        {res.date}
                      </td>
                      <td className='text-center'>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td className='text-center'>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>
                      <td className='text-center'><button className='alert alert-danger m-0 px-2 py-0' onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}><i className="bi bi-exclamation-triangle"></i></button>

                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>}
        </div>

      </div>
    </div>

  )
}

export default Navbar

