import '../css/events.css';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ReactFullYearScheduler } from 'react-full-year-scheduler';
// import 'react-full-year-scheduler/dist/style.css';
import { ToastContainer } from 'react-toastify';
import EventsTable from '../components/EventsTable/EventsTable';
import EventsForm from '../components/eventsForm/EventsForm';
import PropTypes from 'prop-types';
import { useNotifications, useFetch } from '../../../hooks';
import { useEventsAPI } from '../hooks/useEventsAPI';
import Spinner from '../../spinner/Spinner';
import { useClub } from '../../club/useClub';
import { eventForPanel } from '../eventDates';

export const Events = ({ handleMenuClick, menu }) => {
  const { data, loading, error, reFetch } = useFetch('/events');
  const { club } = useClub();

  const { notifyWarning } = useNotifications();
  const { deleteReserve, createEvent, updateEvent } = useEventsAPI();
  const events = data.map(event => eventForPanel(event, club.timezone));
  const calendarArray = events.flatMap(event => event.calendarData);

  let EVENT_DATA_INITIAL_STATE = {
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

  const [eventData, setEventData] = useState(EVENT_DATA_INITIAL_STATE);

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
      await deleteReserve(id);
      await reFetch();
    } catch (error) {
      notifyWarning('Ha ocurrido un error, por favor intente nuevamente mas tarde');
    }
  };

  const eventsBooking = async (date, calendarData) => {
    try {
      const completeEvent = ['evento', 'nombre', 'apellido', 'telefono', 'horaInicia', 'horaFinaliza'].some(key => !eventData[key]);
      if (completeEvent) {
        notifyWarning('Formulario Incompleto');
        return;
      }

      await createEvent(eventData, date, calendarData);

      await reFetch();
    } catch (error) {
      notifyWarning('Ha ocurrido un error, por favor intente nuevamente mas tarde');
    }
  };

  const handleIsEventSettled = async (id, isSettled) => {
    try {
      await updateEvent(id, isSettled);

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
          {error && <p role='alert'>No pudimos cargar los eventos del club.</p>}
          {loading ? (
              <Spinner
                type={'grow'}
                color={'text-success'}
              />
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
                  maxYear={new Date().getFullYear() + 2}
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

                    setEventData(EVENT_DATA_INITIAL_STATE);
                  }}
                />
              </>
            )}
          </div>

          <div className='overflow-x-auto'>
            <EventsTable
              data={events}
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
