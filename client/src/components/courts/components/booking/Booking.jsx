import React, { useState, useEffect, useContext } from 'react';
import 'react-date-time-picker-popup/dist/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './booking.css';
import CourtBookingBoard from '../courtBookingBoard/CourtBookingBoard.jsx';
import unidecode from 'unidecode';
import CourtBookingDatePicker from '../courtBookingDatePicker/CourtBookingDatePicker.jsx';
import PropTypes from 'prop-types';
import { useAxiosInstance, useNotifications, useFetch, useReservesAPI } from '../../../../hooks';
import { userStore } from '../../../../stores/index.js';
import { isReserveDateAvailable, createDateListArray } from '../../helpers';

const Booking = ({ court }) => {
  const [day, setDay] = useState(new Date());
  const [confirmReserve, setConfirmReserve] = useState(false);

  const [initialTime, setInitialTime] = useState();
  const [finalTime, setFinalTime] = useState();

  let { data: courtReserves, reFetch } = useFetch(`/courts/${court}`);

  const {
    user: { user },
  } = userStore();

  const { reserveDeleted, setReserveDeleted } = userStore();

  const { notify, notifySuccess, notifyWarning } = useNotifications();
  const { createReserve } = useReservesAPI();
  const axios = useAxiosInstance();

  const handleBooking = async (selectedDay) => {
    try {
      const { reservedDates, oneWeekFromNow } = isReserveDateAvailable(
        courtReserves,
        selectedDay,
        initialTime,
        finalTime
      );

      if (!reservedDates && day < oneWeekFromNow) {
        createReserve(court, initialTime, finalTime);

        notifySuccess('Reserva Confirmada');
      } else {
        notify('Horario no disponible');
      }

      reFetch();
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  useEffect(() => {
    reFetch();
    setReserveDeleted(false);
  }, [reserveDeleted]);

  const {dateList, dateListLc, weekDaysList} = createDateListArray()

  return (
    <>
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
      />
    </>
  );
};

Booking.propTypes = {
  court: PropTypes.string,
};
export default Booking;
