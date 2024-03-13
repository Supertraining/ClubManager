import './getAllCourts.css';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Football from '../football/Football';
import Paleta from '../pelotaPaleta/Paleta';
import Paddle from '../paddle/Paddle';
import Squash from '../squash/Squash';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../../spinner/Spinner';

const GetAllCourts = ({
  allCourts,
  handleGetAllCourts,
  court,
  setCourt,
  handleDeleteCourt,
  courtId,
  setCourtId,
  handleMenuClick,
  menu,
}) => {
  useEffect(() => {
    handleGetAllCourts();
  }, [handleGetAllCourts]);

  useEffect(() => {
    handleMenuClick('getAllCourts');
  }, [handleMenuClick]);

  return (
    <>
      {menu.getAllCourts && (
        <div className='col-12 p-1'>
          {!court ? (
            <>
              <div className='my-3'>
                <Link
                  to={'/'}
                  className='btn btn-close border border-dark p-2'
                  onClick={() => handleMenuClick('main')}></Link>
              </div>

              {allCourts.length === 0 ? (
                <Spinner
                  type={'grow'}
                  color={'text-success'}
                  text={'Cargando aguarde unos momentos por favor'}
                  textColor={'text-success'}
                  textSize={'fs-5'}
                />
              ) : (
                <table className='table bg-white table-responsive'>
                  <thead>
                    <tr className='text-center text-dark'>
                      <th scope='col'>#</th>

                      <th scope='col'>Nombre</th>

                      <th scope='col'>reservas</th>

                      <th scope='col'>Eliminar</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allCourts.map((court, i) => (
                      <tr
                        key={court._id}
                        className='text-center'>
                        <td>{i + 1}</td>

                        <td>
                          <button
                            className='btn text-primary'
                            onClick={() => setCourt(court)}>
                            {court.name}
                          </button>
                        </td>

                        {Object.values(court.unavailableDates).some(
                          (reservas) => reservas.length > 0
                        ) ? (
                          <td className='text-success fw-bold'>Reservas activas</td>
                        ) : (
                          <td className='text-danger fw-bold'>Sin reservas</td>
                        )}

                        <td>
                          {!courtId && (
                            <button
                              to={'/courts'}
                              className='btn btn-sm btn-outline-danger m-auto'
                              onClick={() => {
                                setCourtId(court._id);
                              }}>
                              <i className='bi bi-trash-fill mx-1'></i>
                              Eliminar
                            </button>
                          )}
                          {courtId === court._id && (
                            <>
                              <Link
                                to={'/courts'}
                                className='btn btn-sm btn-success m-1'
                                onClick={() => setCourtId()}>
                                Cancelar
                              </Link>

                              <Link
                                to={'/courts'}
                                className='btn btn-sm btn-danger m-1'
                                onClick={() => {
                                  handleDeleteCourt(courtId), setCourtId();
                                }}>
                                Borrar
                              </Link>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <>
              {court?.name === 'futbol' && (
                <Football
                  setCourt={setCourt}
                  court={court?.name}
                />
              )}
              {court?.name === 'paleta' && (
                <Paleta
                  setCourt={setCourt}
                  court={court?.name}
                />
              )}
              {court?.name === 'paddle' && (
                <Paddle
                  setCourt={setCourt}
                  court={court?.name}
                />
              )}
              {court?.name === 'squash' && (
                <Squash
                  setCourt={setCourt}
                  court={court?.name}
                />
              )}
            </>
          )}

          <div>
            <ToastContainer />
          </div>
        </div>
      )}
    </>
  );
};

GetAllCourts.propTypes = {
  allCourts: PropTypes.array,
  handleGetAllCourts: PropTypes.func,
  court: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  setCourt: PropTypes.func,
  handleCreateCourt: PropTypes.func,
  handleDeleteCourt: PropTypes.func,
  courtId: PropTypes.string,
  setCourtId: PropTypes.func,
  handleMenuClick: PropTypes.func,
  menu: PropTypes.object,
};

export default GetAllCourts;
