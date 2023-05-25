import React, { useState, useEffect, useContext } from 'react'
import { DatePicker } from 'react-date-time-picker-popup'
import 'react-date-time-picker-popup/dist/index.css'
import axios from 'axios'
import useFetch from '../../hooks/useFetch'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './booking.css'
import { AuthContext } from '../context/AuthContext'
import { v4 as uuidv4 } from 'uuid';
import CourtBookingBoard from '../../courtBookingBoard/CourtBookingBoard'
import { ReserveBoardContext } from '../context/ReserveBoardUpdate'
import unidecode from 'unidecode';

const Booking = ({ court }) => {

  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState(new Date());
  const [initialTime, setInitialTime] = useState();
  const [finalTime, setFinalTime] = useState();


  let { data, reFetch } = useFetch(`http://localhost:8080/courts/${court}`)

  const { user } = useContext(AuthContext)
  const { reserveDeleted, setReserveDeleted } = useContext(ReserveBoardContext)

  const notifyFail = () => toast("HORARIO NO DISPONIBLE");
  const notifySuccess = () => toast.success("Reserva Confirmada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });;

  const handleBooking = async (selectedDay) => {

    let reserveData;

    switch (selectedDay) {
      case 0: reserveData = data.domingo
        break;
      case 1: reserveData = data.lunes
        break;
      case 2: reserveData = data.martes
        break;
      case 3: reserveData = data.miercoles
        break;
      case 4: reserveData = data.jueves
        break;
      case 5: reserveData = data.viernes
        break;
      case 6: reserveData = data.sabado
        break;

    }

    //!Un turno se puede reservar en un rango maximo de una semana
    //!La duracion maxima de un turno es de 1 hora 30 minutos

    const reservedDates = reserveData?.some((reserve) => initialTime === reserve.initialTime && finalTime === reserve.finalTime || initialTime === reserve.initialTime + 1800000 || initialTime === reserve.initialTime - 1800000 || initialTime === reserve.finalTime - 1800000 || finalTime === initialTime + 1800000 || finalTime < initialTime || finalTime === reserve.finalTime + 1800000 || finalTime === reserve.finalTime - 1800000 || finalTime > initialTime + 5400000 || new Date(initialTime).getDate() < new Date().getDate() || new Date(finalTime).getDate() < new Date().getDate()) || new Date(initialTime).getTime() <= Date.now() || new Date(finalTime).getTime() <= Date.now();

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)

    if (!reservedDates && (day < oneWeekFromNow)) {

      const weekday = new Date(initialTime).toLocaleDateString('es-AR', { weekday: 'long' });
      const unaccentedWeekday = unidecode(weekday);
      const date = new Date(initialTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'numeric' });
      const unaccentedDate = unidecode(date);
      const UUID = uuidv4();

      await axios.put('http://localhost:8080/courts/reserve',
        {
          name: `${court}`,
          selectedDates:
          {
            weekday: unaccentedWeekday,
            date: unaccentedDate,
            initialTime: initialTime,
            finalTime: finalTime,
            user: user.username,
            id: UUID
          }
        })

      await axios.put(`http://localhost:8080/reserves/${user?.username}`,
        {
          court: `${court}`,
          weekday: unaccentedWeekday,
          date: unaccentedDate,
          initialTime: initialTime,
          finalTime: finalTime,
          id: UUID
        })
      notifySuccess()
    } else {

      notifyFail()

    }

    reFetch()

  }

  useEffect(() => {
    reFetch()
    setReserveDeleted(false)
  }, [reserveDeleted])

  return (
    <>
      <div className='d-flex justify-content-center align-items-center flex-wrap calendarContainer'>

        <div className='col-8 p-2 text-center border rounded mt-3'>
          <button className='col-8 rounded shadow btn btn-light fw-bold p-2 m-1' onClick={() => setVisible(!visible)}>Reservar</button>
        </div>


        <div className='h-100 calendar d-flex flex-column align-items-center justify-content-center flex-wrap col-12'>
          
          {visible &&
            <>
              <div className='d-flex flex-column border rounded bg-dark bg-opacity-50 reserveInstructionsWrapper'>

                <div className='d-flex align-items-center flex-wrap justify-content-center p-3 m-1'>

                  <p className='p-2 rounded m-0 text-center shadow fw-bold bg-light m-1'>1 .Selecciona en el calendario la fecha y la hora de inicio de tu reserva y presiona el botón para confirmar</p>

                  <button className='btn btn-success fw-bold shadow m-1' onClick={() => setInitialTime(day.getTime())}>Confirmar hora de inicio</button>

                </div>

                <div className='d-flex align-items-center flex-wrap justify-content-center p-3 m-1'>

                  <p className='p-2 rounded m-0 text-center shadow fw-bold bg-light m-1'>2. Selecciona la hora de finalización de tu reserva y presiona el botón para confirmar</p>

                  <button className='btn btn-success shadow fw-bold m-1' onClick={() => setFinalTime(day.getTime())}>Confirmar hora de finalización</button>
                </div>

                <div className='d-flex align-items-center flex-wrap justify-content-center p-3 m-1'>

                  <p className='p-2 rounded m-0 text-center shadow fw-bold bg-light m-1'>3. Confirma tu reserva</p>

                  <button className='btn btn-success shadow fw-bold m-1' onClick={() => { handleBooking(new Date(day).getDay()) }}>Confirmar Reserva</button>

                </div>

              </div>

              <div className='col-12 datePickerContainer p-3'>
                <DatePicker lang="es" selectedDay={day} setSelectedDay={setDay} timeSelector={true} minuteInterval={30} />
              </div>

              <div>
                <ToastContainer />
              </div>
            </>
          }

        </div>

      </div>

      <CourtBookingBoard data={data} />

    </>
  )
}

export default Booking