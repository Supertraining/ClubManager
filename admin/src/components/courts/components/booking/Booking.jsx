import { useState } from 'react';
import 'react-date-time-picker-popup/dist/index.css';
import useFetch from '../../../../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import './booking.css';
import CourtBookingBoard from '../courtBookingBoard/CourtBookingBoard';
import unidecode from 'unidecode';
import CourtBookingDatePicker from '../courtBookingDatePicker/CourtBookingDatePicker';
import PropTypes from 'prop-types';
import useNotifications from '../../../../hooks/useNotifications';
import useAxiosInstance from '../../../../hooks/useAxiosInstance';
import { userStore } from '../../../../stores/index';
import { isReserveDateAvailable } from '../../helpers/reserve.availability.helper.js';
import useReserves from '../../../../hooks/useReserves.jsx';

const Booking = ({ setCourt, court }) => {

  const [day, setDay] = useState(new Date());
  const [confirmReserve, setConfirmReserve] = useState(false);

  const RESERVE_DATA_I_S = {
    initialTime: undefined,
    finalTime: undefined,
    permanent: false,
  };
  const [reserveData, setReserveData] = useState(RESERVE_DATA_I_S);

  const { initialTime, finalTime, permanent } = reserveData;

  let { data: courtReserves, reFetch } = useFetch(`/courts/${court}`);

  const {
    user: { user: admin },
  } = userStore();

  const { notify, notifySuccess, notifyWarning } = useNotifications();
  const axios = useAxiosInstance();
  const { createReserve } = useReserves();

  const handleBooking = async (selectedDay, { reservedFor, info }) => {
    try {

      const reservedDates = isReserveDateAvailable(courtReserves, selectedDay, reserveData);

      if (!reservedDates) {

        if (reservedFor.length === 0 && !permanent) {
          createReserve(court, initialTime, finalTime, permanent, info, admin.username);
        }

        if (reservedFor.length > 0 && !permanent) {
          createReserve(court, initialTime, finalTime, permanent, info, reservedFor);
          reFetch();
        }

        if (permanent) {

          createReserve(court, initialTime, finalTime, permanent, info, reservedFor || admin.username);
        
        }

        notifySuccess('Reserva confirmada');
      } else {
        notify('Horario no disponible');
      }

      reFetch();

    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
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
      console.log(error);
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

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
            <ul className='p-2 rounded m-0 shadow fw-bold bg-light'>
              <li>
                1. Selecciona en el calendario la fecha y la hora de inicio de tu reserva y presiona
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
          setReserveData={setReserveData}
          reserveData={reserveData}
          setConfirmReserve={setConfirmReserve}
          confirmReserve={confirmReserve}
          handleBooking={handleBooking}
          setDay={setDay}
          day={day}
          permanent={permanent}
        />
        <div>
          <ToastContainer />
        </div>
      </div>

      <CourtBookingBoard
        courtReserves={courtReserves}
        dateList={dateList}
        dateListLc={dateListLc}
        weekDaysList={weekDaysList}
        handleDeleteReserve={handleDeleteReserve}
        court={court}
        setReserveData={setReserveData}
        reserveData={reserveData}
      />
    </>
  );
};

Booking.propTypes = {
  setCourt: PropTypes.func,
  court: PropTypes.string,
};
export default Booking;
