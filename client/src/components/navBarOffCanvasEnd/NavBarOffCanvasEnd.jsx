import { ToastContainer, toast } from 'react-toastify';
import MyUser from '../myUser/MyUser'


const NavBarOffCanvasEnd = ({ setShowProfile, handleDeleteAccount, delAccountMssg, showProfile, allArrays, futbolReserves, paddleReserves, squashReserves, paletaReserves, user, handleDeleteReserve }) => {

  return (

    <>

      <div
        className="offcanvas offcanvas-end offCanvasBg"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel">

        <div>

          <ToastContainer />

        </div>

        <div
          className="offcanvas-header">

          <h5
            className="offcanvas-title m-1 text-white" id="offcanvasExampleLabel">
            {user?.username}
          </h5>

          <button
            className='btn btn-success m-1 p-1'
            onClick={() => setShowProfile(!showProfile)}>
            Mi perfil
          </button>

          <button
            type="button"
            className="btn-close btn-close-white m-1" data-bs-dismiss="offcanvas"
            aria-label="Close">
          </button>

        </div>

        <div
          className="offcanvas-body">

          <div
            className='my-4 d-flex flex-column align-items-center'>

            {showProfile && <MyUser handleDeleteAccount={handleDeleteAccount} delAccountMssg={delAccountMssg} />}

            {!showProfile &&
              <div
                className='rounded bg-dark p-1 text-center'>

                <h5
                  className='text-success fw-bold'>
                  Mis reservas:
                </h5>

                {!allArrays
                  && (<div
                    className='text-white'>
                    No tienes reservas activas
                  </div>)}
              </div>
            }

          </div>

          {(allArrays && !showProfile) &&
            <div
              className='d-flex flex-column align-items-center border border-dark p-1 my-2'>

              <table
                className='table table-responsive w-100'>

                <thead
                  className='bg-dark text-white text-center'>

                  <tr>

                    <th
                      scope='col'
                      className='text-center'>
                      Actividad
                    </th>
                    <th
                      scope='col'
                      className='text-center'>
                      fecha
                    </th>
                    <th
                      scope='col'
                      className='text-center'>
                      Inicia
                    </th>
                    <th
                      scope='col'
                      className='text-center'>
                      Finaliza
                    </th>
                    <th
                      scope='col'
                      className='text-center'>
                      Anular
                    </th>

                  </tr>

                </thead>

                <tbody>
                  {futbolReserves?.map((res, i) => (

                    <tr
                      className='bg-success fw-bold my-1 text-dark text-center' key={i}>

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

                      <td>

                        <button
                          className='alert alert-danger m-0 px-2 py-0'
                          onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}>

                          <i
                            className="bi bi-exclamation-triangle">
                          </i>

                        </button>

                      </td>

                    </tr>
                  ))}
                  {paddleReserves?.map((res, i) => (

                    <tr
                      className='bg-primary fw-bold my-1 text-dark'
                      key={i}>

                      <td
                        className='text-center'>
                        {res.court}
                      </td>

                      <td
                        className='text-center'>
                        {res.date}
                      </td>

                      <td
                        className='text-center'>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>

                      <td
                        className='text-center'>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>

                      <td
                        className='text-center'>

                        <button
                          className='alert alert-danger m-0 px-2 py-0'
                          onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}>

                          <i
                            className="bi bi-exclamation-triangle">
                          </i>

                        </button>

                      </td>
                    </tr>
                  ))}
                  {squashReserves?.map((res, i) => (

                    <tr
                      className='bg-info fw-bold my-1 text-dark'
                      key={i}>

                      <td
                        className='text-center'>
                        {res.court}
                      </td>

                      <td
                        className='text-center'>
                        {res.date}
                      </td>

                      <td
                        className='text-center'>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>

                      <td
                        className='text-center'>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>

                      <td
                        className='text-center'>

                        <button
                          className='alert alert-danger m-0 px-2 py-0'
                          onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}>

                          <i
                            className="bi bi-exclamation-triangle">
                          </i>

                        </button>

                      </td>

                    </tr>
                  ))}
                  {paletaReserves?.map((res, i) => (

                    <tr
                      className='bg-light fw-bold my-1 text-dark'
                      key={i}>

                      <td
                        className='text-center'>
                        {res.court}
                      </td>

                      <td
                        className='text-center'>
                        {res.date}
                      </td>

                      <td
                        className='text-center'>
                        {new Date(res.initialTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>

                      <td
                        className='text-center'>
                        {new Date(res.finalTime).toLocaleTimeString(
                          [], { timeStyle: 'short' }
                        )
                        }
                      </td>

                      <td
                        className='text-center'>

                        <button
                          className='alert alert-danger m-0 px-2 py-0'
                          onClick={() => handleDeleteReserve(res.court, res.weekday, res.id)}>

                          <i
                            className="bi bi-exclamation-triangle">
                          </i>

                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>}

        </div>

      </div>

    </>
  )
}

export default NavBarOffCanvasEnd