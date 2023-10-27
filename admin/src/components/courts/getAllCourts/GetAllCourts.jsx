import './getAllCourts.css'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Football from '../football/Football';
import Paleta from '../pelotaPaleta/Paleta';
import Paddle from '../paddle/Paddle';
import Squash from '../squash/Squash';
import { useEffect } from 'react';

const GetAllCourts = ({ allCourts, handleGetAllCourts, court, setCourt, handleCreateCourt, handleDeleteCourt, courtId, setCourtId, handleMenuClick }) => {

  useEffect(() => {
    handleGetAllCourts()
  }, [handleGetAllCourts])
  

  return (
    <div
      className="col-12 p-1">

      { !court
        ? <>

          <div
            className='my-3'>

            <Link
              to={ '/' }
              className='btn btn-close border border-dark p-2'
              onClick={ () => handleMenuClick('main')  }>
            </Link>

          </div>

          <table
            className="table bg-white table-responsive">

            <thead>

              <tr
                className="text-center text-dark">

                <th
                  scope="col">
                  #
                </th>

                <th
                  scope="col">
                  Nombre
                </th>

                <th
                  scope="col">
                  reservas
                </th>

                <th
                  scope="col">
                  Eliminar
                </th>

              </tr>

            </thead>

            <tbody>

              { allCourts.length === 0

                ? <tr
                  className="spinner-grow text-success m-5"
                  role="status">
                </tr>

                : allCourts.map((court, i) => (

                  <tr
                    key={ court._id }
                    className="text-center">

                    <td>
                      { i + 1 }
                    </td>

                    <td>

                      <button
                        className='btn text-primary'
                        onClick={ () => setCourt(court) }>
                        { court.name }
                      </button>

                    </td>

                    { Object.values(court.unavailableDates).some((reservas) => reservas.length > 0) ? (
                      <td className="text-success fw-bold">Reservas activas</td>
                    ) : (
                      <td className="text-danger fw-bold">Sin reservas</td>
                    ) }

                    <td>
                      { !courtId &&
                        <button
                          to={ '/courts' }
                          className='btn btn-outline-danger m-auto'
                          onClick={ () => { setCourtId(court._id) } }>
                          Eliminar Cancha
                        </button>
                      }
                      { courtId === court._id &&
                        <>
                          <Link
                            to={ '/courts' }
                            className='btn btn-sm btn-success m-1'
                            onClick={ () => setCourtId() }>
                            Cancelar
                          </Link>

                          <Link
                            to={ '/courts' }
                            className='btn btn-sm btn-danger m-1'
                            onClick={ () => { handleDeleteCourt(courtId), setCourtId() } }>
                            Borrar
                          </Link>
                        </>
                      }
                    </td>
                  </tr>
                )) }

            </tbody>

          </table>

        </>
        : <>
          { court?.name === 'futbol' && <Football setCourt={ setCourt } court={ court?.name } /> }
          { court?.name === 'paleta' && <Paleta setCourt={ setCourt } court={ court?.name } /> }
          { court?.name === 'paddle' && <Paddle setCourt={ setCourt } court={ court?.name } /> }
          { court?.name === 'squash' && <Squash setCourt={ setCourt } court={ court?.name } /> }
        </>


      }

      <div>

        <ToastContainer />

      </div>

    </div>

  )

}

export default GetAllCourts

