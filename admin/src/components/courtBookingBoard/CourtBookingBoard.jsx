import './CourtBookingBoard.css'

const CourtBookingBoard = ({ data, dateList, dateListLc, weekDaysList, court, handleDeleteReserve }) => {

  return (
    <div
      className='col-12 p-2'>

      <div
        className='table rounded tableContainer'>

        <div
          className='tr'>

          <div
            className='tc'>

            <div>{dateList[0]}</div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[0]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[0] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>



                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div >
              {dateList[1]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[1]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[1] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>



                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[2]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[2]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[2] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>



                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[3]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[3]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[3] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[4]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[4]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[4] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[5]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[5]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[5] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[6]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[6]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[6] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

        </div>

        <div
          className='tr'>

          <div
            className='tc'>

            <div>
              {dateList[7]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[7]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[7] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div >
              {dateList[8]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[8]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[8] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[9]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[9]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[9] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[10]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[10]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[10] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]
                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[11]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[11]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[11] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[12]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[12]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[12] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              {dateList[13]}
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                {data[weekDaysList[13]]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === dateListLc[13] &&

                  <li
                    key={i}
                    className={!reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger'}>

                    <span
                      className='text-info'>
                      {reserve.user}
                    </span>

                    <div>
                      [{new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                      <i
                        className="bi bi-x-circle-fill text-danger mx-1 cursor"
                        onClick={() => handleDeleteReserve(court, reserve.weekday, reserve.id, reserve.user)}></i>

                    </div>

                  </li>

                ))}
              </ul>

            </div>

          </div>

        </div>

      </div>

    </div >
  )
}

export default CourtBookingBoard