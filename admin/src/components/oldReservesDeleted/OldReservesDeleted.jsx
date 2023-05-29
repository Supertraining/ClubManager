import './oldReservesDeleted.css';
import { Link } from 'react-router-dom';

const OldReservesDeleted = ({ setShowResDeleted }) => {
  
  return (

    <div
      className='col-9 d-flex flex-column align-items-center p-1'>

      <div
        className='col-12 my-3'>
        
        <Link
          to={'/'}
          className='btn btn-close border border-dark p-2'
          onClick={() => setShowResDeleted(false)}>
        </Link>
        
      </div>

      <div
        className='alert alert-danger m-auto'>
        Reserves Deleted
      </div>

    </div>

  )
}

export default OldReservesDeleted