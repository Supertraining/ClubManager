import { useState } from 'react';
import 'react-date-time-picker-popup/dist/index.css';
import { ToastContainer } from 'react-toastify';
import './booking.css';
import CourtBookingBoard from '../courtBookingBoard/CourtBookingBoard';
import CourtBookingDatePicker from '../courtBookingDatePicker/CourtBookingDatePicker';
import PropTypes from 'prop-types';

import { userStore } from '../../../../stores';

import { createDateListArray, isReserveDateAvailable } from '../../helpers'

import { useReserves, useFetch, useNotifications } from '../../../../hooks'



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
  const { createReserve, deleteCourtReserve, deleteUserReserve } = useReserves();

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
          createReserve(
            court,
            initialTime,
            finalTime,
            permanent,
            info,
            reservedFor || admin.username
          );
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
      deleteCourtReserve(court, day, id);

      deleteUserReserve(username, id);

      reFetch();

      notifySuccess('Reserva Eliminada');
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const { dateList, dateListLc, weekDaysList } = createDateListArray();
 
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
