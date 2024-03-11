import ActivitiesCard from '../../components/activityCard/ActivityCard';
import '../../css/activities.css';
import { useFetch } from '../../../../hooks';
import ActivitiesModal from '../../components/activitiesModal/ActivitiesModal';

const ActivityList = () => {
  const { data } = useFetch('./activities/getAll');

  return (
    <>
      <div className='d-flex justify-content-start justify-content-md-evenly overflow-auto flex-md-wrap gap-4 my-5'>
        {data &&
          data?.map((card) => (
            <div
              className='col-4 card-wrapper mx-1 shadow'
              key={window.crypto.randomUUID()}>
              <ActivitiesCard
                key={card.id}
                img={card.img}
                imgText={card.imgText}
                title={card.activity}
                category={card.category}
                description={card.description}
                data_target={card.data_target}
              />

              <div
                className='modal fade'
                id={card.activity.split(' ').join('')}
                key={card.id}
                tabIndex='-1'
                role='dialog'
                aria-labelledby='exampleModalLabel'
                aria-hidden='true'>
                <div
                  className='modal-dialog modal-dialog-centered'
                  role='document'>
                  <div
                    className='modal-content'
                    style={{ backgroundImage: `url(${card.img})`, backgroundSize: 'cover' }}>
                    <div className='modal-header'>
                      <h5
                        className='modal-title p-2 rounded'
                        id='exampleModalLabel'>
                        {card.activity}
                      </h5>

                      <button
                        type='button'
                        className='close btn modal-btn border-success'
                        data-dismiss='modal'
                        aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                      </button>
                    </div>
                    <div className='modal-body'>
                      <ActivitiesModal
                        category={card.category}
                        key={card.img}
                      />
                    </div>
                    <div className='modal-footer'>
                      <button
                        type='button'
                        className='btn modal-btn border-success'
                        data-dismiss='modal'>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ActivityList;
