import ActividadesModal from "./ActividadesModal"

const Modal = (props) => {
  
  return (

    <div className="modal fade" id={ props.dataTarget }
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">

      <div className="modal-dialog"
        role="document">

        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title fs-5" id="exampleModalLabel">
              { props.activity }
            </h5>

            <button type="button"
              className="close btn"
              data-bs-dismiss="modal"
              aria-label="Close">

              <span aria-hidden="true">
                &times;
              </span>

            </button>

          </div>

          <div className="modal-body">

            <ActividadesModal  categories={ props.categories } />

          </div>

          <div className="modal-footer">

            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Modal