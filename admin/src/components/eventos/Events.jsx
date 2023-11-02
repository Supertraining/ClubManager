import './eventos.css';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ReactFullYearScheduler } from "react-full-year-scheduler";
import axios from '../../utils/axiosInstance'
import "react-full-year-scheduler/dist/style.css";
import useFetch from '../../hooks/useFetch';
import { ToastContainer, toast } from 'react-toastify';
import EventsTable from './EventsTable';
import EventsForm from './EventsForm';



const Events = ({ handleMenuClick, menu }) => {

  const { data, loading, error, reFetch } = useFetch('/events')

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

  const [ eventData, setEventData ] = useState(eventDataInitialState);

  useEffect(() => {
    handleMenuClick('events');
  }, [handleMenuClick])

  const handleChange = (e) => {

    setEventData(
      {
        ...eventData,
        [ e.target.name ]: e.target.value
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
  const notifyFormIncomplete = () => toast.warning("Formulario Incompleto", { position: 'bottom-right', autoClose: 2000, theme: 'dark' });
  const eventsBooking = async (date, calendarData) => {

    try {

      const completeEvent = Object.values(eventData).some((el) => el.length === 0)
      if (completeEvent) {
        notifyFormIncomplete();
        return;
      }

      await axios.post(`/events/createEvent`, { ...eventData, date: new Date(date).toLocaleDateString(), calendarData: calendarData })

      reFetch()

      notifyEventCreated();

    } catch (error) {

      console.log(error)

    }

  }
  const handleIsEventSettled = async (id, isSettled) => {

    try {

      const res = await axios.put('/events/updateEvent', { id: id, saldado: isSettled })

      reFetch()
    } catch (error) {
      console.log(error)
    }
  }

  return (
  <>
    {
     
      menu.events &&
        <div
          className='col-12 p-1'>

          <div
            className='my-3'>

            <Link
              to={ '/' }
              className='btn btn-close border border-dark p-2'
              onClick={ () => handleMenuClick('main') }>
            </Link>

          </div>

          <EventsForm eventData={ eventData } setEventData={ setEventData } handleChange={ handleChange } />

          <div className='col-12 p-2 react-full-year-scheduler-container'>
            { loading
              ? < div className="spinner-grow text-success m-5"
                role="status" ></div>
              : <>
                <ReactFullYearScheduler
                  events={ calendarArray }
                  locale="es"
                  dateTooltipTheme="translucent"
                  weekSeparatorWidth={ 10 }
                  weekSeparatorColor="#198754"
                  headerWeekDayBgColor="#198754"
                  headerWeekendBgColor="#121212"
                  weekendCellBackgroundColor="#121212"
                  weekendCellTextColor="white"
                  weekDayCellBackgroundColor="rgba(75, 68, 83, 0.69)"
                  weekDayCellTextColor="white"
                  selectionColor="black"
                  selectionTextColor="white"
                  maxRangeSelection={ 1 }
                  minRangeSelection={ 1 }
                  firstDayOfWeek="Monday"
                  maxYear={ 2025 }
                  minYear={ 2022 }
                  readonlyCalendar={ false }
                  showWeekSeparator={ true }
                  showTodayButton={ true }
                  enableYearToYearSelection={ false }
                  enableWeekendSelection={ true }
                  minCellWidth={ 50 }
                  showSeparatorInHeader={ false }
                  enableEventOverwriting={ true }
                  onDatePick={ (eventDate, clearSelectedCell) => {

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

                  } }
                />
              </> }
          </div>

          <div className='overflow-x-auto'>

            <EventsTable
              data={ data }
              handleIsEventSettled={ handleIsEventSettled }
              handleDeleteReserve={ handleDeleteReserve } />

          </div>

          <ToastContainer />

        </div >
      }
    </>
  )
}

export default Events