import React, { useState, useEffect } from 'react'
import { DatePicker } from 'react-date-time-picker-popup'
import 'react-date-time-picker-popup/dist/index.css'
import axios from 'axios'
import useFetch from '../../hooks/useFetch'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './booking.css'

const Booking = ({ id }) => {
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState(new Date());
  const [initialTime, setInitialTime] = useState();
  const [finalTime, setFinalTime] = useState();

  let { data, reFetch } = useFetch(`http://localhost:8080/courts/${id}`)


  const notify = () => toast("HORARIO NO DISPONIBLE");
  const handleBooking = async (selectedDay) => {

    let reserveData;

    switch (selectedDay) {
      case 0: reserveData = data.Domingo
        break;
      case 1: reserveData = data.Lunes
        break;
      case 2: reserveData = data.Martes
        break;
      case 3: reserveData = data.Miercoles
        break;
      case 4: reserveData = data.Jueves
        break;
      case 5: reserveData = data.Viernes
        break;
      case 6: reserveData = data.Sabado
        break;

    }
  
    //TODO: PONER UN TOAST DE RESERVA EXITOSA
    //Un turno se puede reservar en un rango maximo de una semana
    //La duracion maxima de un turno es de 1 hora 30 minutos

    const reservedDates = reserveData.some((reserve) => initialTime === reserve.initialTime && finalTime === reserve.finalTime || initialTime === reserve.initialTime + 1800000 || initialTime === reserve.initialTime - 1800000 || initialTime === reserve.finalTime - 1800000 || finalTime === initialTime + 1800000 || finalTime < initialTime || finalTime === reserve.finalTime + 1800000 || finalTime === reserve.finalTime - 1800000 || finalTime > initialTime + 5400000 || new Date(initialTime).getDate() < new Date().getDate() || new Date(finalTime).getDate() < new Date().getDate());

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)

    !reservedDates && (day < oneWeekFromNow)

      ? await axios.put('http://localhost:8080/courts/reserve',
        {
          name: `${id}`, selectedDates: { initialTime: initialTime, finalTime: finalTime }
        })

      : notify()

    reFetch()

  }

  return (
    <>
      <div className='d-flex justify-content-center align-items-center flex-wrap calendarContainer'>

        <div className='col-8 p-2 text-center border rounded mt-3'>
          <button className='col-8 rounded shadow btn btn-light fw-bold p-2 m-1' onClick={() => setVisible(!visible)}>Reservar</button>
        </div>


        <div className='h-100 calendar d-flex justify-content-center flex-wrap col-12'>
          {visible &&
            <>
              <div className='d-flex flex-column justify-content-evenly'>

                <div className='d-flex align-items-center flex-wrap justify-content-center border rounded p-3 shadow bg-dark bg-opacity-50'>

                  <p className='p-2 rounded m-0 text-center shadow fw-bold bg-light'>1 .Selecciona en el calendario la fecha y la hora de inicio de tu reserva y presiona el botón para confirmar</p>

                  <button className='btn btn-success fw-bold shadow mx-2' onClick={() => setInitialTime(day.getTime())}>Confirmar hora de inicio</button>

                </div>
                <div className='d-flex align-items-center flex-wrap justify-content-center border rounded p-3 bg-dark bg-opacity-50'>

                  <p className='p-2 rounded m-0 text-center shadow fw-bold bg-light'>2. Selecciona la hora de finalización de tu reserva y presiona el botón para confirmar</p>

                  <button className='btn btn-success shadow fw-bold mx-2' onClick={() => setFinalTime(day.getTime())}>Confirmar hora de finalización</button>
                </div>

                <div className='d-flex align-items-center flex-wrap justify-content-center border rounded p-3 bg-dark bg-opacity-50'>

                  <p className='p-2 rounded m-0 text-center shadow fw-bold bg-light'>3. Confirma tu reserva</p>

                  <button className='btn btn-success shadow fw-bold mx-2' onClick={() => { handleBooking(new Date(day).getDay()) }}>Confirmar Reserva</button>

                </div>

              </div>
              <div className='col-12 h-50 p-3'>
                <DatePicker lang="es" selectedDay={day} setSelectedDay={setDay} timeSelector={true} minuteInterval={30} />
              </div>


              <div>
                <ToastContainer />
              </div>
            </>
          }

        </div>

      </div>

      <div className='tableContainer container col-12 p-3'>

        <div className='table rounded'>

          <div className='tr'>

            <div className='tc'>

              <div>Lun</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Lunes?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 1 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>

            </div>

            <div className='tc'>
              <div >Mar</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Martes?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 2 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='tc'>
              <div>Mier</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Miercoles?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 3 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='tc'>
              <div>Juev</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Jueves?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 4 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='tc'>
              <div>Vier</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Viernes?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 5 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='tc'>
              <div>Sab</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Sabado?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 6 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='tc'>
              <div>Dom</div>
              <div className='p-0 text-center'>
                <ul>
                  {data.Domingo?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                    new Date(reserve.initialTime).getDay() === 0 &&

                    <li key={i} >[{new Date(reserve.initialTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                    }-{new Date(reserve.finalTime).toLocaleTimeString(
                      [], { timeStyle: 'short' }
                    )
                      }]</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Booking