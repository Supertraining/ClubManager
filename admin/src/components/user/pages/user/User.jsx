import './user.css';
import UserReserves from '../../components/userReserves/UserReserves';
import UserData from '../../components/userData/UserData';
import PropTypes from 'prop-types';

export const User = ({
  setIsUserSelected,
  setSelectedUser,
  selectedUser,
  handleDeleteReserve,
  handleUpdateUser,
  handleDeleteUser,
  setConfirmDelete,
  confirmDelete,
}) => {
  return (
    <>
      <div className='my-3'>
        <button
          className='btn btn-close border border-dark p-2'
          onClick={() => setIsUserSelected(false)}></button>
      </div>

      <div className='col-12 h-auto p-1 border border-dark d-flex flex-column align-items-center gap-3'>
        <div className='col-12 border border-dark shadow p-3'>
          <UserData
            selectedUser={selectedUser}
            handleUpdateUser={handleUpdateUser}
            handleDeleteUser={handleDeleteUser}
            setConfirmDelete={setConfirmDelete}
            confirmDelete={confirmDelete}
          />
        </div>

        <div className='d-flex justify-content-evenly col-12'>
          <div className='col-12 border border-dark shadow'>
            <UserReserves
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              handleDeleteReserve={handleDeleteReserve}
            />
          </div>

          {/* <div
            className='col-5 border border-dark shadow'>
            
            <UserActivities />

          </div> */}
        </div>
      </div>
    </>
  );
};

User.propTypes = {
  setIsUserSelected: PropTypes.func,
  setSelectedUser: PropTypes.func,
  selectedUser: PropTypes.object,
  handleDeleteReserve: PropTypes.func,
  handleUpdateUser: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  setConfirmDelete: PropTypes.func,
  confirmDelete: PropTypes.bool,
};

