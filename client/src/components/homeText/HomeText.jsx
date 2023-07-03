import './homeText.css'

const HomeText = () => {
  return (
    <div>
      <div classNameName='my-3 p-4 text-center shadow'>
        <h1>
          Bienvenidos a la web app del Ranelagh Club!
        </h1>
        <h5>Aquí podrás reservar tu cancha desde donde estés y obtener información sobre las actividades que brindamos en el club</h5>
      </div>

      <div classNameName='my-3 p-4 shadow'>
        <h3 classNameName='text-center'>Actividades</h3>



        <div className="accordion" id="accordionExample">

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                <strong>Patinaje artístico</strong>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                El patinaje artístico es una disciplina deportiva que combina la <i className="bi bi-brush-fill text-primary"></i> <b>elegancia</b> del ballet con la <i className="bi bi-heart-fill text-danger"></i> <b>emoción</b> del patinaje sobre ruedas. En nuestro club, ofrecemos clases de patinaje artístico para niñ@s y adolescentes que deseen aprender y perfeccionar esta técnica.
                Para conocer los días y horarios de esta actividad haz click <a type="button" className="text-primary" data-toggle="modal" data-target="#exampleModal">
                  Aquí
                </a>
              </div>
            </div>

            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Patinaje artístico</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    ...
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <strong>Fútbol infantil</strong>
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                En nuestro club, ofrecemos clases de <i className="fas fa-futbol"></i> <b>fútbol</b>  infantil para niños y niñas que deseen aprender y mejorar sus habilidades en este deporte emocionante. Nuestros <i className="fa-solid fa-dumbbell text-primary"></i> <b>entrenadores</b>  profesionales trabajan con los jóvenes para desarrollar su técnica y mejorar su juego en equipo. Únete a nosotros y <i className="fa-regular fa-face-smile-beam bg-warning rounded-5"></i> <b>diviértete</b>  mientras aprendes a jugar al fútbol. Para conocer los días y horarios de esta actividad haz click <a type="button" className="text-primary" data-toggle="modal" data-target="#futbolModal">
                  Aquí
                </a>
              </div>
            </div>

            <div className="modal fade" id="futbolModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Fútbol infantil</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    ...
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                <strong>Gimnasia artística</strong>
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                La gimnasia artística es una disciplina deportiva que combina la fuerza, la flexibilidad y la <i className="fa-solid fa-music text-primary"></i> <b>gracia</b>  en movimientos acrobáticos. En nuestro club, ofrecemos clases de gimnasia artística para niños y jóvenes que deseen <i className="fa-solid fa-graduation-cap"></i> <b>aprender</b> y perfeccionar esta técnica. Nuestros instructores altamente capacitados trabajan con los jóvenes para desarrollar sus habilidades, mejorar su técnica y fomentar la <i className="fa-solid fa-star text-warning"></i> <b>confianza</b> en sí mismos. Para conocer los días y horarios de esta actividad haz click <a type="button" className="text-primary" data-toggle="modal" data-target="#gimnasiaModal">
                  Aquí
                </a>
              </div>
            </div>

            <div className="modal fade" id="gimnasiaModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Gimnasia artística</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    ...
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                <strong>Entrenamiento funcional</strong>
              </button>
            </h2>
            <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                En nuestro club, ofrecemos entrenamiento funcional para mejorar <b>la fuerza, la resistencia y la flexibilidad</b>. Brindan sesiones <i className="fa-solid fa-people-group"></i> <b>grupales</b> y <i className="fa-solid fa-person"></i> <b>personalizadas</b> para ayudarte a alcanzar tus <i className="bi bi-list-check"></i> <b>objetivos</b>  de acondicionamiento físico. ¡Únete a nosotros y alcanza tu mejor versión! Para conocer los días y horarios de esta actividad haz click <a type="button" className="text-primary" data-toggle="modal" data-target="#funcionalModal">
                  Aquí
                </a>
              </div>
            </div>

            <div className="modal fade" id="funcionalModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Entrenamiento funcional</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    ...
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default HomeText