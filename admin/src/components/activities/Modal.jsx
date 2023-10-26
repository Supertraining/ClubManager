import ActividadesModal from "./ActividadesModal";
import PropTypes from 'prop-types'

const Modal = ({ dataTarget, activity, categories }) => {

  return (

    <div className="modal fade" id={ dataTarget }
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">

      <div className="modal-dialog"
        role="document">

        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title fs-5" id="exampleModalLabel">
              { activity }
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

            <ActividadesModal categories={ categories } />

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

Modal.propTypes = {
  dataTarget: PropTypes.string.isRequired,
  activity: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired
}

export default Modal