import { Link } from 'react-router-dom';
import './user.css';
import UserReserves from '../userReserves/UserReserves';
import UserActivities from '../userActivities/UserActivities';
import UserData from '../userData/UserData';

const User = ({ setUser, user, handleDeleteReserve }) => {

  return (

    <>
      
      <div className='my-3'>
        <button className='btn btn-close border border-dark p-2' onClick={() => setUser(false)}></button>
      </div>

      <div className="col-12 h-75 p-1 border border-dark d-flex flex-column">

        <div className='row justify-content-center'>

          <div className='col-6 border border-dark'>
            <UserData user={user} />
          </div>

        </div>

        <div className='row justify-content-evenly'>

          <div className='col-5 border border-dark'>
            <UserReserves user={user} handleDeleteReserve={handleDeleteReserve} />
          </div>

          <div className='col-5 border border-dark'>
            <UserActivities />
          </div>

        </div>



      </div>

    </>

  )
}

export default User