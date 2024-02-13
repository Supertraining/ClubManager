import { useState, useEffect, useContext } from 'react';
import 'react-date-time-picker-popup/dist/index.css';
import useFetch from '../../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import './booking.css';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import CourtBookingBoard from './courtBookingBoard/CourtBookingBoard';
import { ReserveBoardContext } from '../context/ReserveBoardUpdate';
import unidecode from 'unidecode';
import CourtBookingDatePicker from './courtBookingDatePicker/CourtBookingDatePicker';
import PropTypes from 'prop-types';
import useNotifications from '../../hooks/useNotifications';
import useAxiosInstance from '../../hooks/useAxiosInstance';

const Booking = ({ setCourt, court }) => {
  const [day, setDay] = useState(new Date());
  const [initialTime, setInitialTime] = useState();
  const [finalTime, setFinalTime] = useState();
  const [confirmReserve, setConfirmReserve] = useState(false);
  const [permanent, setPermanent] = useState(false);

  let { data, reFetch } = useFetch(`/courts/${court}`);

  const { user } = useContext(AuthContext);
  const { reserveDeleted, setReserveDeleted } = useContext(ReserveBoardContext);
  const { notify, notifySuccess, notifyWarning } = useNotifications();
  const axios = useAxiosInstance();

  const handleBooking = async (selectedDay) => {
    try {
      let reserveData;

      switch (selectedDay) {
        case 0:
          reserveData = data.domingo;
          break;
        case 1:
          reserveData = data.lunes;
          break;
        case 2:
          reserveData = data.martes;
          break;
        case 3:
          reserveData = data.miercoles;
          break;
        case 4:
          reserveData = data.jueves;
          break;
        case 5:
          reserveData = data.viernes;
          break;
        case 6:
          reserveData = data.sabado;
          break;
      }

      //!Un turno se puede reservar en un rango máximo de una semana

      const reservedDates = reserveData?.some(
        (reserve) =>
          (initialTime === reserve.initialTime && finalTime === reserve.finalTime) ||
          initialTime === reserve.initialTime + 1800000 ||
          initialTime === reserve.initialTime - 1800000 ||
          initialTime === reserve.finalTime - 1800000 ||
          finalTime === initialTime + 1800000 ||
          finalTime < initialTime ||
          finalTime === reserve.finalTime + 1800000 ||
          finalTime === reserve.finalTime - 1800000 ||
          new Date(initialTime).getDate() < new Date().getDate() ||
          new Date(finalTime).getDate() < new Date().getDate() ||
          new Date(initialTime).getTime() <= Date.now() ||
          new Date(finalTime).getTime() <= Date.now()
      );

      if (!reservedDates) {
        const weekday = new Date(initialTime).toLocaleDateString('es-AR', { weekday: 'long' });
        const unaccentedWeekday = unidecode(weekday);
        const date = new Date(initialTime).toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'numeric',
        });
        const unaccentedDate = unidecode(date);
        const UUID = uuidv4();

        await axios.put('/courts/reserve', {
          name: `${court}`,
          selectedDates: {
            weekday: unaccentedWeekday,
            date: unaccentedDate,
            initialTime: initialTime,
            finalTime: finalTime,
            user: user?.username,
            id: UUID,
            permanent: permanent,
          },
        });

        await axios.put(`/users/reserves/${user?.username}`, {
          court: `${court}`,
          weekday: unaccentedWeekday,
          date: unaccentedDate,
          initialTime: initialTime,
          finalTime: finalTime,
          id: UUID,
          permanent: permanent,
        });

        if (permanent) {
          const today = new Date(initialTime);
          const oneWeekFromNow = today.setDate(today.getDate() + 7);
          const dateOneWeekFromNow = unidecode(
            new Date(oneWeekFromNow).toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'numeric',
            })
          );
          const initialTimeWeekFromNow = new Date(today.getTime());
          const todayFinalTime = new Date(finalTime);
          const finalTimeWeekFromNow = new Date(
            todayFinalTime.getTime() + 7 * 24 * 60 * 60 * 1000
          ).getTime();
          await axios.put('/courts/reserve', {
            name: `${court}`,
            selectedDates: {
              weekday: unaccentedWeekday,
              date: dateOneWeekFromNow,
              initialTime: initialTimeWeekFromNow,
              finalTime: finalTimeWeekFromNow,
              user: user?.username,
              id: UUID,
              permanent: permanent,
            },
          });

          await axios.put(`/users/reserves/${user?.username}`, {
            court: `${court}`,
            weekday: unaccentedWeekday,
            date: dateOneWeekFromNow,
            initialTime: initialTime,
            finalTime: finalTime,
            id: UUID,
            permanent: permanent,
          });
        }

        notifySuccess('Reserva confirmada');
      } else {
        notify('HORARIO NO DISPONIBLE');
      }

      reFetch();
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleDeleteReserve = async (court, day, id, username) => {
    try {
      await axios.put(`/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id,
      });

      await axios.put(`/users/reserves/delete`, {
        username: username,
        reserveId: id,
      });

      reFetch();
      notifySuccess('Reserva Eliminada');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  useEffect(() => {
    reFetch();
    setReserveDeleted(false);
  }, [reserveDeleted]);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 27);

  const dateList = [];
  const dateListLc = [];
  const weekDaysList = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.toLocaleDateString('es-AR', { weekday: 'long' });
    const unaccentedDay = unidecode(day);
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
    const weekDay = d.toLocaleDateString('es-AR', options);
    const unaccentedWeekday = unidecode(weekDay);
    const firstLetter = weekDay.charAt(0).toUpperCase();
    const capitalizedWeekday = firstLetter + weekDay.slice(1);

    dateList.push(capitalizedWeekday);
    dateListLc.push(unaccentedWeekday);
    weekDaysList.push(unaccentedDay);
  }

  return (
    <>
      <div className='my-3'>
        <button
          to={'/'}
          className='btn btn-close border border-dark p-2'
          onClick={() => setCourt(false)}></button>
      </div>

      <h1 className='text-info'>@{court}</h1>

      <div className='calendarContainer d-flex flex-column col-12'>
        <div className='d-flex flex-column border rounded bg-dark bg-opacity-50 reserveInstructionsWrapper'>
          <div className='d-flex align-items-center flex-wrap justify-content-center p-3 m-3 bg-dark'>
            <ul className='p-2 rounded m-0 text-center shadow fw-bold bg-light m-1'>
              <li>
                {' '}
                1 .Selecciona en el calendario la fecha y la hora de inicio de tu reserva y presiona
                el botón
                <i className='text-success'> Confirmar hora de inicio</i>
              </li>
              <li>
                2. Selecciona la hora de finalización de tu reserva y presiona el botón
                <i className='text-success'> Confirmar hora de finalización</i>
              </li>
              <li>
                3. Por ultimo presiona el botón:
                <i className='text-success'> Confirmar reserva</i>
              </li>
            </ul>
          </div>
        </div>

        <CourtBookingDatePicker
          setInitialTime={setInitialTime}
          initialTime={initialTime}
          setFinalTime={setFinalTime}
          finalTime={finalTime}
          setConfirmReserve={setConfirmReserve}
          confirmReserve={confirmReserve}
          handleBooking={handleBooking}
          setDay={setDay}
          day={day}
          setPermanent={setPermanent}
          permanent={permanent}
        />
        <div>
          <ToastContainer />
        </div>
      </div>

      <CourtBookingBoard
        data={data}
        dateList={dateList}
        dateListLc={dateListLc}
        weekDaysList={weekDaysList}
        handleDeleteReserve={handleDeleteReserve}
        court={court}
        setPermanent={setPermanent}
        permanent={permanent}
      />
    </>
  );
};

Booking.propTypes = {
  setCourt: PropTypes.func,
  court: PropTypes.string,
};
export default Booking;
