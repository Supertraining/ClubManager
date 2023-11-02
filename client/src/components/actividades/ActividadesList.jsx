import ActividadesCard from './ActividadesCard'
import './actividades.css'
import useFetch from '../../hooks/useFetch'
import ActividadesModal from './ActividadesModal'
const ActividadesList = () => {

  const { data } = useFetch('./activities/getAll');
  
  return (
    <>
      <div className='d-flex justify-content-start justify-content-md-evenly overflow-auto flex-md-wrap gap-4 my-5'>

        { data?.map((card) => (
          <>
            <ActividadesCard
              key={ card.id }
              img={ card.img }
              imgText={ card.imgText }
              title={ card.activity }
              category={ card.category }
              description={ card.description }
              data_target={ card.data_target } />

            <div className="modal fade" id={ card.activity.split(' ').join('') }
              key={ card.id }
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">

              <div className="modal-dialog modal-dialog-centered"
                role="document">

                <div className="modal-content" style={ { backgroundImage: `url(${card.img})`, backgroundSize: 'cover' } }>

                  <div className="modal-header">

                    <h5 className="modal-title p-2 rounded" id="exampleModalLabel">
                      { card.activity }
                    </h5>

                    <button type="button"
                      className="close btn modal-btn border-success"
                      data-dismiss="modal"
                      aria-label="Close">

                      <span aria-hidden="true">
                        &times;
                      </span>

                    </button>

                  </div>
                  <div className="modal-body">

                    <ActividadesModal
                      category={ card.category }
                      key={ card.img } />

                  </div>
                  <div className="modal-footer">

                    <button type="button"
                      className="btn modal-btn border-success" data-dismiss="modal">
                      Cerrar
                    </button>

                  </div>

                </div>

              </div>

            </div>



          </>

        )) }

      </div>

    </>

  )
}

export default ActividadesList