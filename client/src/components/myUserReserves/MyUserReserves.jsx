import './myUserReserves.css';


const MyUserReserves = (props) => {
  return (

    <div className='bg-dark'>

      <h6
        className='text-success fw-bold p-2 m-0'>
        Mis reservas:
      </h6>

      <div
        className='d-flex flex-column align-items-center border border-dark p-1 my-2'>

        <table
          className='table table-responsive bg-transparent w-100'>

          <thead
            className='bg-dark text-white text-center'>

            <tr>

              <th
                scope='col'
                className='text-center fw-light p-0'>
                Actividad
              </th>
              <th
                scope='col'
                className='text-center fw-light p-0'>
                fecha
              </th>
              <th
                scope='col'
                className='text-center fw-light p-0'>
                Inicia
              </th>
              <th
                scope='col'
                className='text-center fw-light p-0'>
                Finaliza
              </th>
              <th
                scope='col'
                className='text-center fw-light p-0'>
                Anular
              </th>

            </tr>

          </thead>

          <tbody>
            
            {props?.futbolReserves?.map((res, i) => (

              <tr
                className='my-1 text-success text-center border border-success tableData-text' key={i}>

                <td className='tableData'>
                  {res.court}
                </td>

                <td className='tableData'>
                  {res.date}
                </td>

                <td className='tableData'>
                  {new Date(res.initialTime).toLocaleTimeString(
                    [], { timeStyle: 'short' }
                  )
                  }
                </td>

                <td className='tableData'>
                  {new Date(res.finalTime).toLocaleTimeString(
                    [], { timeStyle: 'short' }
                  )
                  }
                </td>

                <td className='tableData'>

                  <button
                    className='btn m-0 px-2 py-0'
                    onClick={() => props.handleDeleteReserve(res.court, res.weekday, res.id)}>

                    <i
                      className="bi bi-exclamation-triangle text-danger">
                    </i>

                  </button>

                </td>

              </tr>
            ))}
            {props?.paddleReserves?.map((res, i) => (

              <tr
                className='my-1 text-primary text-center border border-primary tableData-text'
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
                    className='btn m-0 px-2 py-0'
                    onClick={() => props.handleDeleteReserve(res.court, res.weekday, res.id)}>

                    <i
                      className="bi bi-exclamation-triangle text-danger">
                    </i>

                  </button>

                </td>
              </tr>
            ))}
            {props?.squashReserves?.map((res, i) => (

              <tr
                className='my-1 text-info text-center border border-info tableData-text'
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
                    className='btn m-0 px-2 py-0'
                    onClick={() => props.handleDeleteReserve(res.court, res.weekday, res.id)}>

                    <i
                      className="bi bi-exclamation-triangle text-danger">
                    </i>

                  </button>

                </td>

              </tr>
            ))}
            {props?.paletaReserves?.map((res, i) => (

              <tr
                className='my-1 text-warning text-center border border-warning tableData-text'
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
                    className='btn m-0 px-2 py-0'
                    onClick={() => props.handleDeleteReserve(res.court, res.weekday, res.id)}>

                    <i
                      className="bi bi-exclamation-triangle text-danger">
                    </i>

                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>

  )
}

export default MyUserReserves