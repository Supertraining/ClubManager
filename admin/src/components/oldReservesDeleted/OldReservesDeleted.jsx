import './oldReservesDeleted.css';
import { Link } from 'react-router-dom';

const OldReservesDeleted = (
  { setMenu, menu, setConfirmDelete, confirmDelete, handleDeleteOldReserves }) => {

  return (

    <div
      className='col-9 d-flex flex-column align-items-center p-1'>
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

              <Link to={'/'}
                className='btn btn-success'
                onClick={() => { setConfirmDelete(false), setMenu({ ...menu, main: true, deleteReserves: false }) }}>
                Cancelar
              </Link>

              <button
                className='btn btn-danger'
                onClick={() => { setConfirmDelete(true), handleDeleteOldReserves() }}>
                Borrar
              </button>

            </div>

          </div>
          :
          <>
            <div
              className='col-12 my-3'>

              <Link
                to={'/'}
                className='btn btn-close border border-dark p-2'
                onClick={() => { setMenu({ ...menu, main: true, deleteReserves: false }), setConfirmDelete(false) }}>
              </Link>

            </div>

            <div
              className='alert alert-danger m-auto'>
              Reserves Deleted
            </div>
          </>
      }
    </div>

  )
}

export default OldReservesDeleted