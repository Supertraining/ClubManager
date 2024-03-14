import { ToastContainer } from 'react-toastify';
import '../css/oldReservesDeleted.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types'

export const OldReservesDeleted = (
  { handleMenuClick, menu, setMenu, setConfirmDelete, confirmDelete, handleDeleteOldReserves }) => {

  useEffect(() => {
    handleMenuClick('deleteReserves');
  }, [ handleMenuClick ])

  return (

    <>
      { menu.deleteReserves &&

        <div
          className='col-9 d-flex flex-column align-items-center p-1 OldReservesDeleted-container'>
          {
            !confirmDelete
              ?
              <div
                className='border border-danger p-5 rounded m-auto bg-dark'>

                <p
                  className='text-center text-white fw-bold'>
                  ¿Estás seguro de que quieres borrar todas las reservas?
                </p>

                <div
                  className='d-flex justify-content-evenly'>

                  <Link to={ '/' }
                    className='btn btn-success'
                    onClick={ () => { setConfirmDelete(false), handleMenuClick('main') } }>
                    Cancelar
                  </Link>

                  <button
                    className='btn btn-danger'
                    onClick={ () => { setConfirmDelete(true), handleDeleteOldReserves() } }>
                    Borrar
                  </button>

                </div>

              </div>
              :
              <>
                <div
                  className='col-12 my-3'>

                  <Link
                    to={ '/' }
                    className='btn btn-close border border-dark p-2'
                    onClick={ () => { setMenu({ ...menu, main: true, deleteReserves: false }), setConfirmDelete(false) } }>
                  </Link>

                </div>

                <div
                  className='alert alert-danger m-auto'>
                  Reserves Deleted
                </div>
              </>
          }
          <div>

            <ToastContainer />

          </div>
        </div>

      }
    </>

  )
}

OldReservesDeleted.propTypes = 
{
  handleMenuClick: PropTypes.func,
  menu: PropTypes.object,
  setMenu: PropTypes.func,
  setConfirmDelete: PropTypes.func,
  confirmDelete: PropTypes.bool,
  handleDeleteOldReserves: PropTypes.func
}
