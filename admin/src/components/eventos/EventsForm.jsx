
const EventsForm = ({ handleChange, eventData, setEventData }) => {
  return (
    <>
      <form
        className="form d-flex flex-column align-items-center flex-md-row justify-content-evenly flex-wrap col-12"
        role="form"
        autoComplete="on"
      >

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="evento"
            name='evento'
            placeholder="evento"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.evento }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="nombre"
            name='nombre'
            placeholder="Nombre"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.nombre }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="apellido"
            name='apellido'
            placeholder="Apellido"
            className="form-control my-2 text-center border-0 border-bottom"
            type="text"
            value={ eventData.apellido }
            onChange={ handleChange }
          />

        </div>


        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="telefono"
            name='telefono'
            placeholder="Telefono"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.telefono }
            onChange={ handleChange }
          />

        </div>


        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="adultos"
            name='adultos'
            placeholder="Adultos"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.adultos }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="menores"
            name='menores'
            placeholder="Menores"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.menores }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="opcion"
            name='opcion'
            placeholder="Opcion"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.opcion }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="camareraAdicional"
            name='camareraAdicional'
            placeholder="Camarera adicional"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.camareraAdicional }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="horaInicia"
            name='horaInicia'
            placeholder="Hora de inicio"
            className="form-control my-2 text-center border-0 border-bottom" type="time"
            value={ eventData.horaInicia }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="horaFinaliza"
            name='horaFinaliza'
            placeholder="Horario de finalización"
            className="form-control my-2 text-center border-0 border-bottom" type="time"
            value={ eventData.horaFinaliza }
            onChange={ handleChange }
          />

        </div>


        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="horasAdicional"
            name='horasAdicional'
            placeholder="Hora adicional"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.horasAdicional }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">

          <input
            id="seña"
            name='seña'
            placeholder="Seña"
            className="form-control my-2 text-center border-0 border-bottom" type="text"
            value={ eventData.seña }
            onChange={ handleChange }
          />

        </div>

        <div
          className="col-11 col-sm-8 col-md-3 mx-1">
          <label htmlFor="saldado" className='p-3'>Saldado</label>

          { !eventData.saldado
            ? <i className="bi bi-toggle-off fs-4 mx-2 text-danger pointer" onClick={ () => setEventData({ ...eventData, saldado: true }) } ></i>
            : <i className="bi bi-toggle-on fs-4 mx-2 text-success pointer" onClick={ () => setEventData({ ...eventData, saldado: false }) }></i>
          }

        </div>


        <div
          className="col-10 mx-1 text-center">

          <textarea
            id="comentarios"
            name='comentarios'
            placeholder="Comentarios"
            rows={ 1 }
            cols={ 40 }
            className="my-2 text-center border form-control"
            value={ eventData.comentarios }
            onChange={ handleChange }
          />

        </div>

      </form>

    </>
  )
}

export default EventsForm