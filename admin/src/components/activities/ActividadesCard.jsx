import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
const ActividadesCard = ({ img, imgText, title, description, data_target, deleteActivity, id }) => {

  return (

    <div className='col-md-4 card-wrapper mx-1 shadow'>

      <div className="card">
        <span className='text-center'>{ id }</span>
        <img className="card-img p-2" src={ img || 'https://picsum.photos/id/237/300/300' } alt={ imgText } />
        <div className="card-body">
          <h5 className="card-title">{ title }</h5>
          <p className="card-text">{ description }</p>
        </div>
        <div className="card-footer d-flex align-items-center justify-content-between">
          <Link
            data-bs-toggle="modal"
            data-bs-target={ data_target }
            className={ data_target?.length == 0 ? `card-link text-decoration-none text-success border rounded p-2 disabled` : `card-link text-decoration-none text-success border rounded p-2` }>
            <i className="bi bi-calendar-week"> Días y horarios
            </i>
          </Link>

        </div>
        <div className='d-flex justify-content-evenly p-2'>
          { id &&
            <>
              <button
                className='btn btn-sm btn-outline-danger'
                onClick={ () => deleteActivity(id) }
              >
                Eliminar
              </button>

              <Link
                className='btn btn-sm btn-outline-warning'
                to={ '/updateActivities/' } state={ { id: id } }  >
                Actualizar
              </Link>
            </>
          }
        </div>

      </div>

    </div>

  )
}

ActividadesCard.propTypes = {
  img: PropTypes.string.isRequired,
  imgText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  data_target: PropTypes.string.isRequired,
  deleteActivity: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default ActividadesCard