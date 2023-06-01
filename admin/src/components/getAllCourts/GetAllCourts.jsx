import './getAllCourts.css'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';


const GetAllCourts = ({ setMenu, menu, allCourts, court, setCourt }) => {
  
  return (
    <div
      className="col-9 p-1">

      {!court
        ? <>

          <div
            className='my-3'>

            <Link
              to={'/'}
              className='btn btn-close border border-dark p-2'
              onClick={() => setMenu({ ...menu, main: true, getAllCourts: false })}>
            </Link>

          </div>

          <table
            className="table table-responsive">

            <thead>

              <tr
                className="text-center ">

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

              </tr>

            </thead>

            <tbody>

              {allCourts.length === 0

                ? <div
                  className="spinner-grow text-success m-5"
                  role="status">
                </div>

                : allCourts.map((court, i) => (

                  <tr
                    key={court._id}
                    className="text-center">

                    <td>
                      {i + 1}
                    </td>

                    <td>

                      <button
                        className='btn text-primary'
                        onClick={() => setCourt(court)}>
                        {court.name}
                      </button>

                    </td>

                    {Object.values(court.unavailableDates).some((reservas) => reservas.length > 0) ? (
                      <td className="text-success fw-bold">Reservas activas</td>
                    ) : (
                      <td className="text-danger fw-bold">Sin reservas</td>
                    )}
                  </tr>

                ))}
            </tbody>

          </table>

        </>
        : <User setUser={setUser} user={user} handleDeleteReserve={handleDeleteReserve} handleUpdateUser={handleUpdateUser} handleDeleteUser={handleDeleteUser} />
      }

      <div>

        <ToastContainer />

      </div>

    </div>

  )

}

export default GetAllCourts


