import { DatePicker } from 'react-date-time-picker-popup'

const CourtBookingDatePicker = (
  { setInitialTime, setFinalTime, handleBooking, setDay, day }
) => {

  return (

    <>

      <div
        className='col-12 datePickerContainer p-3 text-center'>

        <button
          className='btn btn-success fw-bold shadow m-0 border col-12 col-sm-6 col-lg-4'
          onClick={() => setInitialTime(day.getTime())}>
          Confirmar hora de inicio
        </button>

        <button
          className='btn btn-success shadow fw-bold m-1 border col-12 col-sm-6 col-lg-4'
          onClick={() => setFinalTime(day.getTime())}>
          Confirmar hora de finalización
        </button>

        <button
          className='btn btn-success shadow fw-bold m-0 border col-12 col-sm-6 col-lg-3'
          onClick={() => { handleBooking(new Date(day).getDay()) }}> Confirmar Reserva
        </button>

        <DatePicker lang="es" selectedDay={day} setSelectedDay={setDay} timeSelector={true} minuteInterval={30} />
      </div>

    </>

  )
  
}

export default CourtBookingDatePicker