import ActividadesCard from './ActividadesCard'
import './activities.css'
import useFetch from '../../hooks/useFetch'
import { Link } from 'react-router-dom'
import axios from '../../utils/axiosInstance'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal'
import PropTypes from 'prop-types'

const GetAllActivities = ({ handleMenuClick }) => {

  const { data, loading, reFetch } = useFetch('/activities/getAll');

  const notifyDeleteActivity = () => toast.success("Actividad eliminada", { position: 'bottom-right', autoClose: 1000, theme: 'dark' });
  const deleteActivity = async (id) => {
    try {
      const { data: { deletedCount } } = await axios.delete(`/activities/deleteById/${id}`)
      if (deletedCount) reFetch()
      notifyDeleteActivity()
    } catch (error) {
      console.log(error)
    }
  }

  const handleInitialRender = () => {
    if (loading && data.length === 0) {
      return (
        < div className="spinner-grow text-success m-5"
          role="status" ></div>
      )
    } else if (!loading && data.length === 0) {
      return (
        <h1 className='text-center w-100'>No hay actividades creadas</h1>
      )

    }
  }

  return (

    <div className="col-12 col-md-10 p-1">

      <div>
        <ToastContainer />
      </div>

      <div
        className='col-12 my-3'>

        <Link
          to={ '/' }
          className='btn btn-close border border-dark p-2'
          onClick={ () => handleMenuClick('main') }>
        </Link>

      </div>

      { handleInitialRender() }

      <div className='d-flex justify-content-start justify-content-md-evenly overflow-auto flex-md-wrap gap-2 my-5'>

        { data?.map((card) => (

          <div className='col-md-4' key={ card.id }>

            <ActividadesCard
              key={ card.id }
              id={ card._id }
              img={ card.img }
              imgText={ card.imgText }
              title={ card.activity }
              description={ card.description }
              data_target={ card.data_target }
              deleteActivity={ deleteActivity }
            />

            <Modal
              key={ window.crypto.randomUUID() }
              dataTarget={ card.activity.split(' ').join('') }
              activity={ card.activity }
              categories={ card.category }
            />

          </div>

        )) }

      </div>

    </div>

  )
}

GetAllActivities.propTypes = {
  handleMenuClick: PropTypes.func.isRequired
}

export default GetAllActivities