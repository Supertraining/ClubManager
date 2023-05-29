import './userReserve.css'


const UserReserves = ({ user, handleDeleteReserve }) => {


  return (

    <div
      className='userReserveTable'>
      
      <h3
        className='text-center text-success'>
        Reservas
      </h3>

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
          {user?.reserves?.map((res) => (
            <tr
              key={res.id}
              className='text-center'>
              
              <td>
                {res.court}
              </td>

              <td>
                {res.date}
              </td>

              <td>
                {new Date(res.initialTime).toLocaleTimeString(
                  [], { timeStyle: 'short' }
                )}
              </td>

              <td>
                {new Date(res.finalTime).toLocaleTimeString(
                  [], { timeStyle: 'short' }
                )}
              </td>

              <td>

                <button
                  className='alert alert-danger m-0 px-2 py-0'
                  onClick={() => handleDeleteReserve(res.court, res.weekday, res.id, user._id)}>
                  
                  <i
                    className="bi bi-exclamation-triangle">
                  </i>
                  
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

export default UserReserves

