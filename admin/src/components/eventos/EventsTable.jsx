import PropTypes from 'prop-types'

const EventsTable = ({ data, handleIsEventSettled, handleDeleteReserve }) => {

  return (
    <>
      <table className='table table-responsive bg-dark'>
        <thead>
          <tr className='text-center tableHead-fontSize'>

            <th>
              Fecha
            </th>
            <th>
              Horario
            </th>
            <th>
              Nombre
            </th>
            <th>
              Apellido
            </th>
            <th>
              Teléfono
            </th>
            <th>
              Evento
            </th>
            <th>
              Invitados
            </th>
            <th>
              Opc.
            </th>
            <th>
              Ad. Hrs.
            </th>
            <th>
              Ad. Cam.
            </th>
            <th>
              Comentarios
            </th>
            <th>
              Seña
            </th>
            <th>
              Saldado
            </th>
            <th>
              Eliminar
            </th>

          </tr>

        </thead>

        <tbody className='tableBody-fontSize'>
          { data.map((event) => (

            <tr key={ event._id } className='text-center'>

              <td>{ event.date }</td>
              <td>{ event.horaInicia }-{ event.horaFinaliza }</td>
              <td>{ event.nombre }</td>
              <td>{ event.apellido }</td>
              <td>{ event.telefono }</td>
              <td>{ event.evento }</td>
              <td>A:{ event.adultos } M:{ event.menores }</td>
              <td>{ event.opcion }</td>
              <td>{ event.horasAdicional }</td>
              <td>{ event.camareraAdicional }</td>
              <td className='table-coments'>{ event.comentarios }</td>
              <td>{ event.seña }</td>
              <td> { !event.saldado
                ? <i className="bi bi-toggle-off fs-4 mx-2 text-danger pointer" onClick={ () => handleIsEventSettled(event._id, !event.saldado) } ></i>
                : <i className="bi bi-toggle-on fs-4 mx-2 text-success pointer" onClick={ () => handleIsEventSettled(event._id, !event.saldado) }></i>
              }</td>
              <td>
                <i
                  className="bi bi-exclamation-triangle fs-4 mx-2 text-danger pointer" onClick={ () => handleDeleteReserve(event._id) }>
                </i>
              </td>

            </tr>

          )) }
        </tbody>
      </table></>
  )
}

EventsTable.propTypes = {
  data: PropTypes.array,
  handleIsEventSettled: PropTypes.func,
  handleDeleteReserve: PropTypes.func
}

export default EventsTable