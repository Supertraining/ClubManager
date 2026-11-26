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
    <div className='member-detail'>
      <div>
        <button
          type='button' className='btn btn-outline-secondary'
          onClick={() => { setConfirmDelete(false); setIsUserSelected(false); }}>
          <i className='bi bi-arrow-left' aria-hidden='true' /> Volver al padrón
        </button>
      </div>

      <UserData
        key={selectedUser.id}
        selectedUser={selectedUser}
        handleUpdateUser={handleUpdateUser}
        handleDeleteUser={handleDeleteUser}
        setConfirmDelete={setConfirmDelete}
        confirmDelete={confirmDelete}
      />
      <div className='member-detail__reservations'>
        <UserReserves
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleDeleteReserve={handleDeleteReserve}
        />
      </div>
    </div>
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

