import React from 'react'

const MyUserReserves = (props) => {
  return (

    <>

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
                className='text-center fw-light'>
                Actividad
              </th>
              <th
                scope='col'
                className='text-center fw-light'>
                fecha
              </th>
              <th
                scope='col'
                className='text-center fw-light'>
                Inicia
              </th>
              <th
                scope='col'
                className='text-center fw-light'>
                Finaliza
              </th>
              <th
                scope='col'
                className='text-center fw-light'>
                Anular
              </th>

            </tr>

          </thead>

          <tbody>
            
            {props?.futbolReserves?.map((res, i) => (

              <tr
                className='my-1 text-success text-center border border-success tableData-text' key={i}>

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
    </>

  )
}

export default MyUserReserves