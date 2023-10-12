import React from 'react'
import ActividadesCard from './ActividadesCard'
import './actividades.css'
import { cardContent } from './servicesCardsContent'
const ActividadesList = () => {

  return (
    <>
      <div className='d-flex justify-content-start justify-content-md-evenly overflow-auto flex-md-wrap gap-4 my-5'>

        { cardContent.map((card, index) => (
          <ActividadesCard key={ index } img={ card.img } imgText={ card.imgText } title={ card.title } description={ card.description } data_target={ card.data_target } />
        )) }



      </div>

      <div className="accordion" id="accordionExample">

          <div className="accordion-item">

            <div className="modal fade" id="patinModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog "
                role="document">

                <div className="modal-content">

                  <div className="modal-header modal-background-patinajeArt">

                    <h5 className="modal-title" id="exampleModalLabel">
                      Patinaje artístico
                    </h5>

                    <button type="button"
                      className="close btn"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>

                  <div className="modal-body">

                    <h6 className='fs-5 text-center text-decoration-underline'>Lunes y Viernes</h6>

                    <ul>

                      <li>
                        <b>Iniciación:</b> <i className='text-success'>17:30 a 18:30</i>
                      </li>

                      <li>
                        <b>Avanzadas:</b> <i className='text-success'>18:30 a 19:30</i>
                      </li>

                    </ul>

                  </div>

                  <div className="modal-footer">

                    <button type="button"
                      className="btn btn-secondary" data-dismiss="modal">
                      Cerrar
                    </button>

                    </div>

                </div>

              </div>

            </div>

          </div>

          <div className="accordion-item">

            <div className="modal fade"
              id="futbolModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog"
                role="document">

                <div className="modal-content">

                  <div className="modal-header modal-background-futbolInf">

                    <h5 className="modal-title"
                      id="exampleModalLabel">
                      Fútbol infantil
                    </h5>

                    <button type="button"
                      className="close btn"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>

                  <div className="modal-body">

                    <h6 className='fs-5 text-center text-decoration-underline'>Lunes y Viernes</h6>

                    <ul>

                      <li>
                        <b>4 y 5 años:</b> <i className='text-success'>
                          17:30 a 18:15
                        </i>
                      </li>

                      <li>
                        <b>6, 7, 8 y 9 años:</b> <i className='text-success'>
                          18:15 a 19:15
                        </i>
                      </li>

                      <li>
                        <b>10, 11, 12 años:</b> <i className='text-success'>
                          19:15 a 20:15
                        </i>
                      </li>

                    </ul>

                    <h6 className='fs-5 text-center mt-3 text-decoration-underline'>Miércoles y Sábados</h6>

                    <ul>

                      <li>
                        <b>6, 7 y 8 años:</b> <i className='text-success'>
                          17:00 a 18:00
                        </i>
                      </li>

                      <li>
                        <b>9, 10 y 11 años:</b> <i className='text-success'>
                          18:00 a 19:00
                        </i>
                      </li>

                      <li>
                        <b>12, 13 y 14 años:</b> <i className='text-success'>
                          19:00 a 20:00
                        </i>
                      </li>

                    </ul>

                  </div>

                  <div className="modal-footer">

                    <button type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal">
                      Cerrar
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="accordion-item">

            <div className="modal fade"
              id="gimnasiaModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog"
                role="document">

                <div className="modal-content">

                  <div className="modal-header modal-background-artGymnastics">

                    <h5 className="modal-title"
                      id="exampleModalLabel">
                      Gimnasia artística
                    </h5>

                    <button type="button"
                      className="close btn"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>

                  <div className="modal-body">

                    <h6 className='fs-5 text-center text-decoration-underline'>Martes y Jueves</h6>

                    <ul>

                      <li>
                        <b>Iniciación (+4 años):</b> <i className='text-success'>15:30 a 16:30</i>
                      </li>

                      <li>
                        <b>Avanzadas (+9 años):</b> <i className='text-success'>16:30 a 17:30</i>
                      </li>

                    </ul>

                  </div>

                  <div className="modal-footer">

                    <button
                      type="button"
                      className="btn btn-secondary" data-dismiss="modal">
                      Cerrar
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="accordion-item">

            <div className="modal fade"
              id="funcionalModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog"
                role="document">

                <div className="modal-content">

                  <div className="modal-header modal-background-functional">

                    <h5 className="modal-title"
                      id="exampleModalLabel">
                      Entrenamiento funcional
                    </h5>

                    <button
                      type="button"
                      className="close btn"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>

                  <div className="modal-body">

                    <h6 className='fs-5 text-center text-decoration-underline'>Lunes y Viernes</h6>

                    <ul>

                      <li>
                        <b>Adolescentes y adultos:</b> <i className='text-success'>
                          18:30 a 19:30
                        </i>
                      </li>

                      <li>
                        <b>Mayores de 60 años:</b> <i className='text-success'>
                          19:00 a 20:00
                        </i>
                      </li>

                    </ul>

                    <h6 className='fs-5 text-center mt-3 text-decoration-underline'>Martes y Jueves</h6>

                    <ul>

                      <li>
                        <b>Adolescentes y adultos:</b> <i className='text-success'>
                          08:00 a 09:00
                        </i>
                      </li>

                      <li>
                        <b>Adolescentes y adultos:</b> <i className='text-success'>
                          18:00 a 19:00
                        </i>
                      </li>

                      <li>
                        <b>Adolescentes y adultos:</b> <i className='text-success'>
                          19:00 a 20:00
                        </i>
                      </li>

                    </ul>

                  </div>

                  <div className="modal-footer">

                    <button
                      type="button"
                      className="btn btn-secondary" data-dismiss="modal">
                      Cerrar
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="accordion-item">

            <div className="modal fade"
              id="freeDanceModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog"
                role="document">

                <div className="modal-content">

                  <div className="modal-header modal-background-freeDance">

                    <h5 className="modal-title"
                      id="exampleModalLabel">
                      Free Dance
                    </h5>

                    <button
                      type="button"
                      className="close btn"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>

                  <div className="modal-body">

                    <h6 className='fs-5 text-center text-decoration-underline'>Miércoles</h6>

                    <ul>

                      <li>
                        <b>Babys (3, 4, 5 años):</b> <i className='text-success'>
                          17:00 a 17:45
                        </i>
                      </li>

                      <li>
                        <b>Infantil A (6, 7 y 8 años):</b> <i className='text-success'>
                          17:00 a 18:00
                        </i>
                      </li>

                      <li>
                        <b>Infantil B (9, 10, 11 y 12 años):</b> <i className='text-success'>
                          17:45 a 18:45
                        </i>
                      </li>

                      <li>
                        <b>Juvenil A (13 a 18 años):</b> <i className='text-success'>
                          18:00 a 19:30
                        </i>
                      </li>

                      <li>
                        <b>Juvenil B (13 a 18 años):</b> <i className='text-success'>
                          19:00 a 20:30
                        </i>
                      </li>

                    </ul>

                    <h6 className='fs-5 text-center mt-3 text-decoration-underline'>Viernes</h6>

                    <ul>

                      <li>
                        <b>Babys (3, 4, 5 años):</b> <i className='text-success'>
                          10:00 a 10:45
                        </i>
                      </li>

                      <li>
                        <b>Infantil A (6, 7 y 8 años):</b> <i className='text-success'>
                          10:00 a 11:00
                        </i>
                      </li>

                      <li>
                        <b>Infantil B (9, 10, 11 y 12 años):</b> <i className='text-success'>
                          10:45 a 11:45
                        </i>
                      </li>

                      <li>
                        <b>Juvenil A (13 a 18 años):</b> <i className='text-success'>
                          11:00 a 12:30
                        </i>
                      </li>

                      <li>
                        <b>Juvenil B (13 a 18 años):</b> <i className='text-success'>
                          12:00 a 12:30
                        </i>
                      </li>

                    </ul>

                  </div>

                  <div className="modal-footer">

                    <button
                      type="button"
                      className="btn btn-secondary" data-dismiss="modal">
                      Cerrar
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="accordion-item">

            <div className="modal fade"
              id="tallerModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog"
                role="document">

                <div className="modal-content">

                  <div className="modal-header modal-background-artWorkshop">

                    <h5 className="modal-title"
                      id="exampleModalLabel">
                      Taller artístico
                    </h5>

                    <button
                      type="button"
                      className="close btn"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>

                  <div className="modal-body">

                    <h6 className='fs-5 text-center text-decoration-underline'>Sábados</h6>

                    <ul>

                      <li>
                        <b>Horario:</b> <i className='text-success'>
                          11:00 a 12:00
                        </i>
                      </li>

                    </ul>

                  </div>

                  <div className="modal-footer">

                    <button
                      type="button"
                      className="btn btn-secondary" data-dismiss="modal">
                      Cerrar
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
    </>

  )
}

export default ActividadesList