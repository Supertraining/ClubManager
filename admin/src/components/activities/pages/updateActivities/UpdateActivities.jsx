import { ToastContainer } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ActivityCard from '../../components/activityCard/ActivityCard';
import Modal from '../../components/modal/Modal';
import { useNotifications } from '../../../../hooks';
import useActivityAPI from '../../hooks/useActivityAPI';

export const UpdateActivities = () => {
  const {
    state: { id },
  } = useLocation();
  const { getActivityById, updateActivity } = useActivityAPI();
  const { notifySuccess, notifyWarning } = useNotifications();

  const [activity, setActivity] = useState({});
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [modalId, setModalId] = useState();
  const [handleShow, setHandleShow] = useState({ showUpdate: false, showAdd: false });

  const errorInitialState = {
    emptyId: null,
    wrongId: null,
    input: null,
  };

  const [error, setError] = useState(errorInitialState);

  const handleGetActivityById = useCallback(async () => {
    try {
      const data = await getActivityById(id);

      const { category, ...activityData } = data;

      setActivity({ ...activityData });
      setCategories(category);
      setModalId(activityData.activity.split(' ').join(''));
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  }, [id]);

  const handleCategoryChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    handleGetActivityById();
  }, [handleGetActivityById]);

  const updateCategory = (e, i) => {
    try {
      e.preventDefault();

      if (!category) {
        setError({ ...error, input: 'Debe completar al menos un campo' });
        return;
      }
      setError(errorInitialState);
      categories[i] = { ...categories[i], ...category };

      notifySuccess(`Categoría ${categories[i].name} Actualizada`);
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };
  const permanentCategories = useMemo(() => {
    return categories;
  }, [categories]);

  const addCategory = (e) => {
    try {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const formKeys = [...formData.keys()].length;
      const formObject = [...formData.entries()].reduce((obj, [key, value]) => {
        return value.trim() !== '' ? { ...obj, [key]: value } : obj;
      }, {});

      const isFormComplete = Object.entries(formObject);

      if (isFormComplete.length < formKeys) {
        setError({ ...error, input: 'Debe completar todo el formulario' });
        return;
      }

      setError(errorInitialState);
      categories.push(formObject);

      setCategories(permanentCategories);

      setCategory();
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const deleteCategory = (e, i) => {
    try {
      e.preventDefault();

      categories.splice(i, 1);

      setCategories(permanentCategories);

      setCategory();
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  const handleUpdateActivity = async (e) => {
    try {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const formObject = [...formData.entries()].reduce((obj, [key, value]) => {
        return value.trim() !== '' ? { ...obj, [key]: value } : obj;
      }, {});

      const updatedActivity = { ...activity, ...formObject };
      const dt = updatedActivity?.activity?.split(' ').join('');
      setModalId(dt);

      const activityData = {
        ...updatedActivity,
        category: [...categories],
        data_target: `#${dt}`,
      };

      updateActivity(id, activityData)

      setActivity(activityData);
    } catch (error) {
      notifyWarning('Hubo un problema, por favor intente nuevamente mas tarde');
    }
  };

  return (
    <div className='col-12 col-md-10 d-flex flex-column align-items-start p-1'>
      <div className='col-12 my-3'>
        <Link
          to={'/getAllActivities'}
          className='btn btn-close border border-dark p-2'></Link>
      </div>

      <div className='text-success text-center my-4 d-flex align-items-center justify-content-center col-12'>
        <i className='bi bi-list-check mx-1 fs-4'></i>

        <h1>Actualizar actividad</h1>
      </div>

      <div className='d-flex justify-content-around col-12 flex-wrap border rounded p-2'>
        <div className='d-flex flex-column col-12 col-md-8 col-xl-6'>
          <div>
            <ToastContainer />
          </div>

          <form
            className='form d-flex flex-column col-12'
            role='form'
            autoComplete='on'
            onSubmit={handleUpdateActivity}>
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
              />
            </div>

            <div className='d-flex'>
              <div className='input-group my-2 justify-content-around align-items-center'>
                <div className='input-group-prepend border border-success rounded '>
                  <i className='bi bi-send-plus-fill fs-4 text-success mx-2'></i>

                  <input
                    className='my-2 text-center bg-white text-secondary p-2'
                    type='submit'
                    value='Actualizar actividad'
                  />
                </div>

                <div className='input-group-prepend border border-info rounded'>
                  <i className='bi bi-eraser-fill fs-4 mx-2 text-info'></i>

                  <input
                    className='my-2 text-center bg-white text-secondary p-2'
                    type='reset'
                    value='Limpiar Formulario'
                  />
                </div>
              </div>
            </div>
          </form>

          <div
            className='form d-flex flex-column col-12'
            role='form'
            autoComplete='on'>
            <hr className='border-3 border-success mb-2' />

            <div className='d-flex justify-content-around align-items-center my-5'>
              <button
                className='btn btn-warning'
                onClick={() => {
                  setHandleShow({ showAdd: false, showUpdate: !handleShow.showUpdate }),
                    setError(errorInitialState);
                }}>
                Actualizar
              </button>

              <div className='d-flex justify-content-evenly align-items-center my-5 col-sm-6'>
                <i
                  className={
                    handleShow.showUpdate
                      ? `d-none d-sm-block bi bi-arrow-left-square-fill fs-4 text-warning moveLeftFormBtnArrow`
                      : `d-none d-sm-block bi bi-arrow-left-square-fill fs-4 moveRightFormBtnArrow`
                  }></i>
                <p>Categorías</p>
                <i
                  className={
                    handleShow.showAdd
                      ? `d-none d-sm-block bi bi-arrow-right-square-fill fs-4 text-success moveRightFormBtnArrow`
                      : `d-none d-sm-block bi bi-arrow-right-square-fill fs-4 moveLeftFormBtnArrow`
                  }></i>
              </div>

              <button
                className='btn btn-success'
                onClick={() => {
                  setHandleShow({ showUpdate: false, showAdd: !handleShow.showAdd }),
                    setError(errorInitialState);
                }}>
                Agregar
              </button>
            </div>

            {handleShow.showUpdate && (
              <>
                {categories?.map((category, i) => (
                  <div key={i}>
                    <hr className='border-3 border-success my-2' />
                    <span className='p-3 text-success text-decoration-underline'>
                      Categoría:
                    </span>{' '}
                    <span className='badge bg-dark'>{category.name}</span>
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
                        onChange={handleCategoryChange}
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
                        onChange={handleCategoryChange}
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
                        onChange={handleCategoryChange}
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
                        onChange={handleCategoryChange}
                      />
                    </div>
                    <p className='text-danger text-center'>{error.input}</p>
                    <div className='input-group my-2 justify-content-around align-items-center'>
                      <div className='input-group-prepend mx-2'>
                        <i className='bi bi-tags fs-4'></i>
                      </div>

                      <button
                        className='my-2 text-center border border-success rounded bg-white text-secondary p-2'
                        onClick={(e) => updateCategory(e, i)}>
                        Actualizar categoría
                      </button>
                      <button
                        className='my-2 text-center border border-danger rounded bg-white text-secondary p-2'
                        onClick={(e) => deleteCategory(e, i)}>
                        Eliminar categoría
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {handleShow.showAdd && (
              <form onSubmit={addCategory}>
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
                  />
                </div>

                <p className='text-danger text-center'>{error.input}</p>

                <div className='input-group my-2 justify-content-center align-items-center'>
                  <div className='input-group-prepend mx-2'>
                    <i className='bi bi-tags fs-4'></i>
                  </div>

                  <button
                    className='my-2 text-center border border-success rounded bg-white text-secondary p-2'
                    type='submit'>
                    Agregar categoría
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className='d-flex justify-content-center'>
          <ActivityCard
            key={activity.img}
            img={activity.img}
            imgText={activity.imgText}
            title={activity.activity}
            description={activity.description}
            data_target={activity.data_target}
          />

          <Modal
            img={activity.img}
            dataTarget={modalId}
            activity={activity.activity}
            categories={permanentCategories}
          />
        </div>
      </div>
    </div>
  );
};

