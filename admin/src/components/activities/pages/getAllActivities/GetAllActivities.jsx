import ActivityCard from '../../components/activityCard/ActivityCard';
import '../../activities.css';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Modal from '../../components/modal/Modal';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNotifications, useFetch } from '../../../../hooks';
import useActivityAPI from '../../hooks/useActivityAPI';

export const GetAllActivities = ({ handleMenuClick, menu }) => {
  const { data, loading, reFetch } = useFetch('/activities/getAll');
  const { notifySuccess, notifyWarning } = useNotifications();
  const { deleteActivity } = useActivityAPI();

  useEffect(() => {
    handleMenuClick('getAllActivities');
  }, [handleMenuClick]);

  const handleDeleteActivity = async (id) => {
    try {
     const deletedCount = await deleteActivity(id);
    
      if (deletedCount) reFetch();
      notifySuccess('Actividad eliminada con exito')
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleInitialRender = () => {
    if (loading && data.length === 0) {
      return (
        <div
          className='spinner-grow text-success m-5'
          role='status'></div>
      );
    } else if (!loading && data.length === 0) {
      return <h1 className='text-center w-100'>No hay actividades creadas</h1>;
    }
  };

  return (
    <>
      {menu.getAllActivities && (
        <div className='col-12 col-md-10 p-1'>
          <div>
            <ToastContainer />
          </div>

          <div className='col-12 my-3'>
            <Link
              to={'/'}
              className='btn btn-close border border-dark p-2'
              onClick={() => handleMenuClick('main')}></Link>
          </div>

          {handleInitialRender()}

          <div className='d-flex justify-content-start justify-content-md-evenly cards-container flex-md-wrap gap-2 my-5'>
            {data?.map((card) => (
              <div key={window.crypto.randomUUID()}>
                <ActivityCard
                  key={card.id}
                  id={card._id}
                  img={card.img}
                  imgText={card.imgText}
                  title={card.activity}
                  description={card.description}
                  data_target={card.data_target}
                  handleDeleteActivity={handleDeleteActivity}
                />

                <Modal
                  key={window.crypto.randomUUID()}
                  dataTarget={card.activity.split(' ').join('')}
                  activity={card.activity}
                  categories={card.category}
                  img={card.img}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

GetAllActivities.propTypes = {
  handleMenuClick: PropTypes.func.isRequired,
  menu: PropTypes.object,
};

