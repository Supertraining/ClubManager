import './CourtBookingBoard.css'
import PropTypes from 'prop-types';


const CourtBookingBoard = (props) => {
 
  return (
    <div
      className='col-12 p-2'>

      <div
        className='table rounded tableContainer'>

        <div
          className='tr'>

          <div
            className='tc'>

            <div>{ props.dateList[ 0 ] }</div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 0 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 0 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div >
              { props.dateList[ 1 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 1 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 1 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>



                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 2 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 2 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 2 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>



                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 3 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 3 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 3 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 4 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 4 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 4 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 5 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 5 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 5 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 6 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 6 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 6 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

        </div>

        <div
          className='tr'>

          <div
            className='tc'>

            <div>
              { props.dateList[ 7 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 7 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 7 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div >
              { props.dateList[ 8 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 8 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 8 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 9 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 9 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 9 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 10 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 10 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 10 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]

                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 11 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 11 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 11 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 12 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 12 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 12 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

          <div
            className='tc'>

            <div>
              { props.dateList[ 13 ] }
            </div>

            <div
              className='p-0 text-center'>

              <ul>
                { props.courtReserves[ props.weekDaysList[ 13 ] ]?.sort((a, b) => a.initialTime - b.initialTime).map((reserve, i) => (

                  reserve.date === props.dateListLc[ 13 ] &&

                  <li
                    key={ i }
                    className={ !reserve.permanent ? 'text-center border border-light' : 'text-center border border-danger' }>

                    <span
                      className='text-info small'>
                      { reserve.user }
                    </span>

                    <div>
                      [{ new Date(reserve.initialTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }-{ new Date(reserve.finalTime).toLocaleTimeString(
                        [], { timeStyle: 'short' }
                      )
                      }]


                    </div>

                  </li>

                )) }
              </ul>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

CourtBookingBoard.propTypes = {
  courtReserves: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  weekDaysList: PropTypes.array,
  dateList: PropTypes.array,
  dateListLc: PropTypes.array,
};
export default CourtBookingBoard