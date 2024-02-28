import './activities.css';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ActividadesCard from './ActividadesCard';
import Modal from './Modal';
import PropTypes from 'prop-types';
import { useNotifications, useAxiosInstance } from '../../hooks';


const Activities = ({ handleMenuClick, menu }) => {

  const categoryInitialState = {
    name: '',
    age_range: '',
    days: '',
    schedule: '',
  };
  const activityInitialState = {
    img: '',
    imgText: '',
    activity: '',
    description: '',
    data_target: '',
  };

  const { notifySuccess, notifyWarning } = useNotifications();
  const axios = useAxiosInstance();

  const [activity, setActivity] = useState(activityInitialState);
  const [category, setCategory] = useState(categoryInitialState);
  const [categories, setCategories] = useState([]);
  const [disableCategory, setDisableCategory] = useState(true);
  const [dataTarget, setDataTarget] = useState('');

  useEffect(() => {
    handleMenuClick('activities');
  }, [handleMenuClick]);

  const handleCategoryChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };
  const handleActivityChange = (e) => {
    setDataTarget(activity?.activity?.split(' ').join(''));

    setActivity({
      ...activity,
      data_target: `#${dataTarget}`,
      [e.target.name]: e.target.value,
    });
    if (Object.values(activity).every((el) => el.length > 0)) {
      setDisableCategory(false);
    }
  };

  const createCategory = (e) => {
    try {
      e.preventDefault();

      if (Object.values(category).some((el) => el.length === 0)) {
        notifyWarning('Formulario Incompleto');
        return;
      }

      if (categories.find((c) => c.name === category.name)) {
        notifyWarning('La categoría ya fue creada');

        return;
      }
      categories.push(category);
      setCategories([...categories]);
      notifySuccess(`Categoría ${category.name} creada`);
      setCategory(categoryInitialState);
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const createActivity = async (e) => {
    e.preventDefault();

    try {
      const activityData = {
        ...activity,
        category: [...categories],
        data_target: `#${dataTarget}`,
      };

      if (Object.values(activityData).some((el) => el.length < 1)) {
        notifyWarning('Formulario Incompleto');
        return;
      }

      const { status } = await axios.post('/activities/save', activityData);

      status === 200 && notifySuccess('Actividad creada');
      setActivity(activityInitialState);
      setDisableCategory(true);
      setCategories([]);
      setDataTarget('');

      return;
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  return (
    <>
      {menu.activities && (
        <div className='col-12 col-md-10 d-flex flex-column align-items-start p-1'>
          <div className='col-12 my-3'>
            <Link
              to={'/'}
              className='btn btn-close border border-dark p-2'
              onClick={() => handleMenuClick('main')}></Link>
          </div>

          <div className='text-success text-center my-4 d-flex align-items-center justify-content-center col-12'>
            <i className='bi bi-list-check mx-1 fs-4'></i>

            <h1>Crear actividad</h1>
          </div>

          <div className='d-flex flex-column flex-xl-row align-items-center justify-content-center justify-content-lg-around col-12 flex-wrap'>
            <div className='d-flex flex-column  col-12 col-md-8 col-xl-6'>
              <div>
                <ToastContainer />
              </div>

              <form
                className='form d-flex flex-column col-12'
                role='form'
                autoComplete='on'
                onSubmit={createActivity}>
                <p className='mt-3 text-success'>Datos de la actividad</p>
                <hr className='border-3 border-success  mb-2' />

                <div className='input-group align-items-center'>
                  <div className='input-group-prepend mx-1 border rounded p-1'>
                    <i className='bi bi-card-image fs-4'></i>
                  </div>

                  <input
                    id='img'
                    name='img'
                    placeholder='imagen url'
                    autoComplete='on'
                    className='form-control my-2 text-center border-0 border-bottom'
                    type='text'
                    value={activity.img}
                    onChange={handleActivityChange}
                  />
                </div>

                <div className='input-group align-items-center'>
                  <div className='input-group-prepend mx-1 border rounded p-1'>
                    <i className='bi bi-image-alt fs-4'></i>
                  </div>

                  <input
                    id='imgText'
                    name='imgText'
                    placeholder='Texto de la imagen(alt)'
                    autoComplete='on'
                    className='form-control my-2 text-center border-0 border-bottom'
                    type='text'
                    value={activity.imgText}
                    onChange={handleActivityChange}
                  />
                </div>

                <div className='input-group align-items-center'>
                  <div className='input-group-prepend mx-1 border rounded p-1'>
                    <i className='bi bi-heart-pulse fs-4'></i>
                  </div>

                  <input
                    id='activity'
                    name='activity'
                    placeholder='Actividad'
                    autoComplete='on'
                    className='form-control my-2 text-center border-0 border-bottom'
                    type='text'
                    value={activity.activity}
                    onChange={handleActivityChange}
                  />
                </div>

                <div className='input-group align-items-center'>
                  <div className='input-group-prepend mx-1 border rounded p-1'>
                    <i className='bi bi-card-text fs-4'></i>
                  </div>

                  <textarea
                    id='description'
                    name='description'
                    placeholder='descripcion'
                    autoComplete='on'
                    className='form-control my-2 text-center border-0 border-bottom'
                    type='text'
                    value={activity.description}
                    onChange={handleActivityChange}
                  />
                </div>

                <div
                  className='form d-flex flex-column col-12'
                  role='form'
                  autoComplete='on'>
                  <p className='mt-3 text-success'>Categoría</p>
                  <hr className='border-3 border-success mb-2' />

                  <div className='input-group align-items-center'>
                    <div className='input-group-prepend mx-1 border rounded p-1'>
                      <i className='bi bi-person-gear fs-4'></i>
                    </div>

                    <input
                      id='name'
                      name='name'
                      placeholder='nombre de la categoría'
                      autoComplete='on'
                      className='form-control my-2 text-center border-0 border-bottom'
                      type='text'
                      value={category.name}
                      onChange={handleCategoryChange}
                      disabled={disableCategory}
                    />
                  </div>

                  <div className='input-group align-items-center'>
                    <div className='input-group-prepend mx-1 border rounded p-1'>
                      <i className='bi bi-calendar-date fs-4'></i>
                    </div>

                    <input
                      id='age_range'
                      name='age_range'
                      placeholder='rango de edad'
                      autoComplete='on'
                      className='form-control my-2 text-center border-0 border-bottom'
                      type='text'
                      value={category.age_range}
                      onChange={handleCategoryChange}
                      disabled={disableCategory}
                    />
                  </div>

                  <div className='input-group align-items-center'>
                    <div className='input-group-prepend mx-1 border rounded p-1'>
                      <i className='bi bi-calendar-week fs-4'></i>
                    </div>

                    <input
                      id='days'
                      name='days'
                      placeholder='Días'
                      autoComplete='on'
                      className='form-control my-2 text-center border-0 border-bottom'
                      type='text'
                      value={category.days}
                      onChange={handleCategoryChange}
                      disabled={disableCategory}
                    />
                  </div>

                  <div className='input-group align-items-center'>
                    <div className='input-group-prepend mx-1 border rounded p-1'>
                      <i className='bi bi-clock fs-4'></i>
                    </div>

                    <input
                      id='schedule'
                      name='schedule'
                      placeholder='Horario'
                      autoComplete='on'
                      className='form-control my-2 text-center border-0 border-bottom'
                      type='text'
                      value={category.schedule}
                      onChange={handleCategoryChange}
                      disabled={disableCategory}
                    />
                  </div>
                </div>

                <div className='d-flex flex-column col-12'>
                  <div className='input-group my-2 justify-content-center align-items-center border border-success rounded'>
                    <div className='input-group-prepend mx-2'>
                      <i
                        className='bi bi-send fs-4'
                        id='basic-addon1'></i>
                    </div>

                    <button
                      className='my-2 text-center border border-success rounded bg-white text-secondary p-2'
                      onClick={(e) => createCategory(e)}
                      disabled={disableCategory}>
                      Crear categoría
                    </button>
                  </div>

                  <div className='input-group my-2 justify-content-center align-items-center border border-danger rounded'>
                    <div className='input-group-prepend mx-2'>
                      <i
                        className='bi bi-send fs-4'
                        id='basic-addon1'></i>
                    </div>

                    <input
                      className='my-2 text-center border border-danger rounded bg-white text-secondary p-2'
                      type='submit'
                      value='Crear actividad'
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className='d-flex justify-content-center col-12 col-xl-4'>
              <ActividadesCard
                key={activity.img}
                img={activity.img}
                imgText={activity.imgText}
                title={activity.activity}
                description={activity.description}
                data_target={activity.data_target}
              />

              <Modal
                img={activity.img}
                dataTarget={dataTarget}
                activity={activity.activity}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Activities.propTypes = {
  handleMenuClick: PropTypes.func.isRequired,
  menu: PropTypes.object,
};

export default Activities;
