import './eventos.css';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { ReactFullYearScheduler } from "react-full-year-scheduler";
import axios from '../../utils/axiosInstance'
import "react-full-year-scheduler/dist/style.css";
import useFetch from '../../hooks/useFetch';
import { ToastContainer, toast } from 'react-toastify';



const Eventos = (setMenu, menu) => {


  const { data, loading, error, reFetch } = useFetch('/events')

  useEffect(() => {
    reFetch();
  }, [data])

  const notifyFetchError = () => toast.warning("Ha ocurrido un error, por favor intente nuevamente mas tarde", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });
  const calendarArray = [];
  !error
    ? data.forEach((event) => {
      event.calendarData.forEach((calendarData) => {
        calendarArray.push(calendarData)
      })
    })
    : notifyFetchError()

  let eventDataInitialState = {
    evento: "",
    nombre: "",
    apellido: "",
    telefono: "",
    adultos: "",
    menores: "",
    horaInicia: "",
    horaFinaliza: "",
    opcion: "",
    horasAdicional: "",
    camareraAdicional: "",
    comentarios: "",
    seña: "",
    saldado: false,
  }

  const [eventData, setEventData] = useState(eventDataInitialState);
  const handleChange = (e) => {

    setEventData(
      {
        ...eventData,
        [e.target.name]: e.target.value
      });

  }

  const notifyEventDeleted = () => toast.success("Evento Eliminado", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });
  const handleDeleteReserve = async (id) => {
    try {

      await axios.delete(`/events/deleteById/${id}`);

      notifyEventDeleted();

      reFetch();

    } catch (error) {

      console.log(error)

    }

  }

  const notifyEventCreated = () => toast.success("Evento Creado", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });
  const notifyEventIncomplete = () => toast.warning("Evento Incompleto", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });
  const eventsBooking = async (date, calendarData) => {

    try {

      const completeEvent = Object.values(eventData).some((el) => el.length === 0)
      if (completeEvent) {
        notifyEventIncomplete();
        return;
      }

      await axios.post(`/events/createEvent`, { ...eventData, date: new Date(date).toLocaleDateString(), calendarData: calendarData })

      notifyEventCreated();

    } catch (error) {

      console.log(error)

    }

  }


  return (
    <div
      className='col-12 p-1'>

      <div
        className='my-3'>

        <Link
          to={'/'}
          className='btn btn-close border border-dark p-2'
          onClick={() => setMenu({ ...menu, main: true, events: false })}>
        </Link>

      </div>

      <form
        className="form d-flex justify-content-evenly flex-wrap col-12"
        role="form"
        autoComplete="on"
      >

        <div
          className="col-3 mx-1">

          <input
            id="evento"
            name='evento'
            placeholder="evento"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.evento}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-3 mx-1">

          <input
            id="nombre"
            name='nombre'
            placeholder="Nombre"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.nombre}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-3 mx-1">

          <input
            id="apellido"
            name='apellido'
            placeholder="Apellido"
            className="form-control my-2 text-center border-0 border-bottom"
            type="text"
            value={eventData.apellido}
            onChange={handleChange}
          />

        </div>


        <div
          className="col-3 mx-1">

          <input
            id="telefono"
            name='telefono'
            placeholder="Telefono"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.telefono}
            onChange={handleChange}
          />

        </div>


        <div
          className="col-2 mx-1">

          <input
            id="adultos"
            name='adultos'
            placeholder="Adultos"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.adultos}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-2 mx-1">

          <input
            id="menores"
            name='menores'
            placeholder="Menores"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.menores}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-2 mx-1">

          <input
            id="opcion"
            name='opcion'
            placeholder="Opcion"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.opcion}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-3 mx-1">

          <input
            id="camareraAdicional"
            name='camareraAdicional'
            placeholder="Camarera adicional"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.camareraAdicional}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-2 mx-1">

          <input
            id="horaInicia"
            name='horaInicia'
            placeholder="Hora de inicio"
            className="form-control my-2 text-center border-0 border-bottom" type="time"
            value={eventData.horaInicia}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-2 mx-1">

          <input
            id="horaFinaliza"
            name='horaFinaliza'
            placeholder="Horario de finalización"
            className="form-control my-2 text-center border-0 border-bottom" type="time"
            value={eventData.horaFinaliza}
            onChange={handleChange}
          />

        </div>


        <div
          className="col-3 mx-1">

          <input
            id="horasAdicional"
            name='horasAdicional'
            placeholder="Hora adicional"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.horasAdicional}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-2 mx-1">

          <input
            id="seña"
            name='seña'
            placeholder="Seña"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={eventData.seña}
            onChange={handleChange}
          />

        </div>

        <div
          className="col-2 mx-1">
          <label htmlFor="saldado" className='p-3'>Saldado</label>

          {!eventData.saldado
            ? <i className="bi bi-toggle-off fs-4 mx-2 text-danger" onClick={() => setEventData({ ...eventData, saldado: true })} ></i>
            : <i className="bi bi-toggle-on fs-4 mx-2 text-success" onClick={() => setEventData({ ...eventData, saldado: false })}></i>
          }

        </div>


        <div
          className="col-10 mx-1 text-center">

          <textarea
            id="comentarios"
            name='comentarios'
            placeholder="Comentarios"
            rows={1}
            cols={40}
            className="my-2 text-center border form-control"
            value={eventData.comentarios}
            onChange={handleChange}
          />

        </div>

      </form>

      <div className='col-12 p-2 react-full-year-scheduler-container'>

        <ReactFullYearScheduler
          events={calendarArray}
          locale="es"
          dateTooltipTheme="translucent"
          weekSeparatorWidth={10}
          weekSeparatorColor="#198754"
          headerWeekDayBgColor="#198754"
          headerWeekendBgColor="#121212"
          weekendCellBackgroundColor="#121212"
          weekendCellTextColor="white"
          weekDayCellBackgroundColor="rgba(75, 68, 83, 0.69)"
          weekDayCellTextColor="white"
          selectionColor="black"
          selectionTextColor="white"
          maxRangeSelection={1}
          minRangeSelection={1}
          firstDayOfWeek="Monday"
          maxYear={2030}
          minYear={2022}
          readonlyCalendar={false}
          showWeekSeparator={true}
          showTodayButton={true}
          enableYearToYearSelection={false}
          enableWeekendSelection={true}
          minCellWidth={50}
          showSeparatorInHeader={false}
          enableEventOverwriting={true}
          onDatePick={(eventDate, clearSelectedCell) => {

            const event = {
              eventName: `Evento: ${eventData.evento}. ${eventData.nombre} ${eventData.apellido}`,
              startDate: dayjs(eventDate.toDate()),
              endDate: dayjs(eventDate.toDate()),
              eventBgColor: "#ff5f4c",
              eventTextColor: "white",
            }
            eventsBooking(dayjs(eventDate.toDate()), event)

            clearSelectedCell()

            setEventData(eventDataInitialState)

          }}

        />
      </div>

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
          {data.map((event) => (

            <tr key={event._id} className='text-center'>

              <td>{event.date}</td>
              <td>{event.horaInicia}-{event.horaFinaliza}</td>
              <td>{event.nombre}</td>
              <td>{event.apellido}</td>
              <td>{event.telefono}</td>
              <td>{event.evento}</td>
              <td>A:{event.adultos} M:{event.menores}</td>
              <td>{event.opcion}</td>
              <td>{event.horasAdicional}</td>
              <td>{event.camareraAdicional}</td>
              <td className='table-coments'>{event.comentarios}</td>
              <td>{event.seña}</td>
              <td>{event.saldado
                ? <i className="bi bi-check-circle-fill text-success"></i>
                : <i className="bi bi-x-circle-fill text-danger"></i>
              }</td>

              <td>

                <button
                  className='delete-event-btn rounded px-1'
                  onClick={() => handleDeleteReserve(event._id)}>
                  <i
                    className="bi bi-exclamation-triangle">
                  </i>
                </button>
              </td>

            </tr>

          ))}
        </tbody>
      </table>

      <ToastContainer />

    </div >

  )
}

export default Eventos