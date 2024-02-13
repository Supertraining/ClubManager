import './eventos.css';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ReactFullYearScheduler } from 'react-full-year-scheduler';
import 'react-full-year-scheduler/dist/style.css';
import useFetch from '../../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import EventsTable from './EventsTable';
import EventsForm from './EventsForm';
import PropTypes from 'prop-types';
import useNotification from '../../hooks/useNotifications';
import useAxiosInstance from '../../hooks/useAxiosInstance';

const Events = ({ handleMenuClick, menu }) => {
  const { data, loading, error, reFetch } = useFetch('/events');

  const { notifyWarning, notifySuccess } = useNotification();
  const axios = useAxiosInstance();
  const calendarArray = [];
  !error
    ? data.forEach((event) => {
        event.calendarData.forEach((calendarData) => {
          calendarArray.push(calendarData);
        });
      })
    : notifyWarning('Ha ocurrido un error, por favor intente nuevamente mas tarde');

  let eventDataInitialState = {
    evento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    adultos: '',
    menores: '',
    horaInicia: '',
    horaFinaliza: '',
    opcion: '',
    horasAdicional: '',
    camareraAdicional: '',
    comentarios: '',
    seña: '',
    saldado: false,
  };

  const [eventData, setEventData] = useState(eventDataInitialState);

  useEffect(() => {
    handleMenuClick('events');
  }, [handleMenuClick]);

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteReserve = async (id) => {
    try {
      const { status } = await axios.delete(`/events/deleteById/${id}`);

      status === 200 && notifySuccess('Evento Eliminado');
      reFetch();
    } catch (error) {
      notifyWarning('Ha ocurrido un error, por favor intente nuevamente mas tarde');
    }
  };

  const eventsBooking = async (date, calendarData) => {
    try {
      const completeEvent = Object.values(eventData).some((el) => el.length === 0);
      if (completeEvent) {
        notifyWarning('Formulario Incompleto');
        return;
      }

      await axios.post(`/events/createEvent`, {
        ...eventData,
        date: new Date(date).toLocaleDateString(),
        calendarData: calendarData,
      });

      reFetch();

      notifySuccess('Evento Creado');
    } catch (error) {
      notifyWarning('Ha ocurrido un error, por favor intente nuevamente mas tarde');
    }
  };
  const handleIsEventSettled = async (id, isSettled) => {
    try {
      await axios.put('/events/updateEvent', { id: id, saldado: isSettled });

      reFetch();
    } catch (error) {
      notifyWarning('Ha ocurrido un error, por favor intente nuevamente mas tarde');
    }
  };

  return (
    <>
      {menu.events && (
        <div className='col-12 p-1'>
          <div className='my-3'>
            <Link
              to={'/'}
              className='btn btn-close border border-dark p-2'
              onClick={() => handleMenuClick('main')}></Link>
          </div>

          <EventsForm
            eventData={eventData}
            setEventData={setEventData}
            handleChange={handleChange}
          />

          <div className='col-12 p-2 react-full-year-scheduler-container'>
            {loading ? (
              <div
                className='spinner-grow text-success m-5'
                role='status'></div>
            ) : (
              <>
                <ReactFullYearScheduler
                  events={calendarArray}
                  locale='es'
                  dateTooltipTheme='translucent'
                  weekSeparatorWidth={10}
                  weekSeparatorColor='#198754'
                  headerWeekDayBgColor='#198754'
                  headerWeekendBgColor='#121212'
                  weekendCellBackgroundColor='#121212'
                  weekendCellTextColor='white'
                  weekDayCellBackgroundColor='rgba(75, 68, 83, 0.69)'
                  weekDayCellTextColor='white'
                  selectionColor='black'
                  selectionTextColor='white'
                  maxRangeSelection={1}
                  minRangeSelection={1}
                  firstDayOfWeek='Monday'
                  maxYear={2025}
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
                      eventBgColor: '#ff5f4c',
                      eventTextColor: 'white',
                    };
                    eventsBooking(dayjs(eventDate.toDate()), event);

                    clearSelectedCell();

                    setEventData(eventDataInitialState);
                  }}
                />
              </>
            )}
          </div>

          <div className='overflow-x-auto'>
            <EventsTable
              data={data}
              handleIsEventSettled={handleIsEventSettled}
              handleDeleteReserve={handleDeleteReserve}
            />
          </div>

          <ToastContainer />
        </div>
      )}
    </>
  );
};

Events.propTypes = {
  handleMenuClick: PropTypes.func,
  menu: PropTypes.object,
};

export default Events;
