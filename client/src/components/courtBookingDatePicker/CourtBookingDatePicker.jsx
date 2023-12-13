import { DatePicker } from 'react-date-time-picker-popup';
import './courtBookingDatePicker.css';
import PropTypes from 'prop-types'

const CourtBookingDatePicker = (props) => {
 
  const enableConfirmReserveBtn = !(props.initialTime && props.finalTime);

  return (
    <div className='d-flex flex-column col-12 p-3'>

      <div className='d-flex justify-content-center col-12 flex-wrap'>

        <div className='d-flex align-items-center justify-content-start shadow mx-0 my-1 border rounded col-12 col-md-7 col-sm-12 col-lg-4'>

          <button
            className='btn btn-success btn-pressed fw-bold col-8 h-100'
            onClick={() => props.setInitialTime(props.day.getTime())}
            disabled={props.initialTime}
          >
            Confirmar hora de inicio
          </button>

          {props.initialTime && (
            <div className='btn-reserve-clicked d-flex'>

              <i className='bi bi-stopwatch mx-1 text-dark fs-5'></i>

              <button
                className='btn btn-sm btn-outline-danger fw-bold'
                onClick={() => props.setInitialTime()}
                disabled={props.confirmReserve}
              >
                Anular
              </button>

            </div>
          )}

        </div>

        <div className='d-flex align-items-center justify-content-start shadow mx-0 my-1 border rounded col-12 col-md-7 col-sm-12 col-lg-4'>

          <button
            className='btn btn-success btn-pressed fw-bold col-8 h-100'
            onClick={() => props.setFinalTime(props.day.getTime())}
            disabled={props.finalTime}
          >
            Confirmar hora de finalización
          </button>

          {props.finalTime && (
            <div className='btn-reserve-clicked d-flex'>

              <i className='bi bi-stopwatch-fill mx-1 text-dark fs-5'></i>

              <button
                className='btn btn-sm btn-outline-danger fw-bold'
                onClick={() => props.setFinalTime()}
                disabled={props.confirmReserve}
              >
                Anular
              </button>

            </div>
          )}

        </div>

        <div className='d-flex align-items-center justify-content-start shadow mx-0 my-1 border rounded col-12 col-md-7 col-sm-12 col-lg-3'>

          <button
            className='btn btn-success btn-pressed fw-bold col-6 h-100'
            onClick={() => {
              props.handleBooking(new Date(props.day).getDay()), props.setConfirmReserve(true);
            }}
            disabled={enableConfirmReserveBtn || props.confirmReserve}
          >
            Confirmar Reserva
          </button>

          {props.initialTime && props.finalTime && props.confirmReserve && (
            <div className='btn-reserve-clicked d-flex justify-content-evenly align-items-center col-6 h-100'>

              <i className='bi bi-check-circle-fill mx-1 text-dark fs-5'></i>

              <button
                className='btn p-0 mx-1'
                onClick={() => {
                  props.setInitialTime(), props.setFinalTime(), props.setConfirmReserve(false);
                }}
              >
                <i className='bi bi-plus-circle fs-1 text-primary'></i>
              </button>

            </div>
          )}

        </div>

      </div>

      <div className='datePickerContainer'>

        <DatePicker
          lang='es'
          selectedDay={props.day}
          setSelectedDay={props.setDay}
          timeSelector={true}
          minuteInterval={30}
        />

      </div>
      
    </div>
  );
};

CourtBookingDatePicker.propTypes = {
  confirmReserve: PropTypes.bool.isRequired,
  day: PropTypes.instanceOf(Date).isRequired,
  finalTime: PropTypes.number,
  handleBooking: PropTypes.func.isRequired,
  initialTime: PropTypes.number,
  setConfirmReserve: PropTypes.func.isRequired,
  setDay: PropTypes.func.isRequired,
  setFinalTime: PropTypes.func.isRequired,
  setInitialTime: PropTypes.func.isRequired,
}

export default CourtBookingDatePicker;
