import { DatePicker } from 'react-date-time-picker-popup'
import './courtBookingDatePicker.css'
import Proptypes from 'prop-types'
const CourtBookingDatePicker = (
  { setInitialTime, initialTime, setFinalTime, finalTime, setConfirmReserve, confirmReserve, handleBooking, setDay, day, setPermanent, permanent }
) => {

  const enableConfirmReserveBtn = !(initialTime && finalTime)
    
  return (
    
    <div
      className='d-flex flex-column col-12 p-3'>

      <div className='d-flex justify-content-center col-12 flex-wrap'>

        <div
          className='d-flex align-items-center justify-content-start shadow mx-0 my-1 border rounded col-12 col-md-7 col-sm-12 col-lg-4'>
          <button
            className='btn btn-success btn-pressed fw-bold col-8 h-100'
            onClick={() => setInitialTime(day.getTime())}
            disabled={initialTime}>
            Confirmar hora de inicio
          </button>

          {initialTime &&
            <div
              className='btn-reserve-clicked d-flex'>

              <i
                className="bi bi-stopwatch mx-1 text-dark fs-5"></i>

              <button
                className='btn btn-sm btn-outline-danger fw-bold'
                onClick={() => setInitialTime()}
                disabled={confirmReserve}>
                Anular
              </button>

            </div>
          }
        </div>

        <div
          className='d-flex align-items-center justify-content-start shadow mx-0 my-1 border rounded col-12 col-md-7 col-sm-12 col-lg-4'>

          <button
            className='btn btn-success btn-pressed fw-bold col-8 h-100'
            onClick={() => setFinalTime(day.getTime())}
            disabled={finalTime}>
            Confirmar hora de finalización
          </button>

          {finalTime &&
            <div
              className='btn-reserve-clicked d-flex'>

              <i
                className="bi bi-stopwatch-fill mx-1 text-dark fs-5"></i>

              <button
                className='btn btn-sm btn-outline-danger fw-bold'
                onClick={() => setFinalTime()}
                disabled={confirmReserve}>
                Anular
              </button>

            </div>
          }

        </div>

        <div
          className='d-flex align-items-center justify-content-start shadow mx-0 my-1 border rounded col-12 col-md-7 col-sm-12 col-lg-3'>

          <button
            className='btn btn-success btn-pressed fw-bold col-6 h-100'
            onClick={() => { handleBooking(new Date(day).getDay()), setConfirmReserve(true) }}
            disabled={enableConfirmReserveBtn || confirmReserve}
          >
            Confirmar Reserva
          </button>

          {!permanent
            ? <i className="bi bi-toggle-off fs-4 mx-2 text-success" onClick={() => setPermanent(true)} ></i>
            : <i className="bi bi-toggle-on fs-4 mx-2 text-danger" onClick={() => setPermanent(false)}></i>
          }

          {(initialTime && finalTime && confirmReserve) &&
            <div className='btn-reserve-clicked d-flex justify-content-evenly align-items-center col-4 h-100'>

              <button
                className='btn p-0 mx-1'
                onClick={() => { setInitialTime(), setFinalTime(), setConfirmReserve(false), setPermanent(false) }}>
                <i
                  className="bi bi-plus-circle fs-1 text-primary">
                </i>
              </button>

            </div>

          }

        </div>

      </div>

      <div className='datePickerContainer'>
        <DatePicker lang="es" selectedDay={day} setSelectedDay={setDay} timeSelector={true} minuteInterval={30} />
      </div>

    </div>

  )

}

CourtBookingDatePicker.propTypes = {
  setInitialTime: Proptypes.func,
  setFinalTime: Proptypes.func,
  setConfirmReserve: Proptypes.func,
  setPermanent: Proptypes.func,
  setDay: Proptypes.func,
  handleBooking: Proptypes.func,
  initialTime: Proptypes.number,
  finalTime: Proptypes.number,
  confirmReserve: Proptypes.bool,
  day: Proptypes.object,
  permanent: Proptypes.bool
}

export default CourtBookingDatePicker