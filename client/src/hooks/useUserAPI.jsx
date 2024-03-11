import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { userStore } from '../stores';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useUserAPI = () => {
  const { notifyWarning } = useNotifications();
  const axios = useAxiosInstance();
  const {
    setUser,
    user: { user },
  } = userStore();
  const navigate = useNavigate();

  const userLogin = async (credentials) => {
    try {
      const { data: token } = await axios.post('/users/login', credentials);
      const decodedUser = jwtDecode(token);

      const user = { ...decodedUser, token: token };

      return user;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const getAllUsers = async () => {
    try {
      const { data: allUsers } = await axios.get('/users/getAll');

      allUsers.sort((a, b) => {
        if (a.apellido > b.apellido) {
          return 1;
        }
        if (a.apellido < b.apellido) {
          return -1;
        }
        return 0;
      });

      return allUsers;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const updateUserById = async (credentials) => {
    try {
      const { data: updatedUser } = await axios.put(`/users/update/${credentials._id}`, {
        ...credentials,
      });

      return updatedUser;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const updateUsersPassword = async (user, newPassword) => {
    try {
      await axios.put('/users/update', { ...user, password: newPassword });
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const getUserById = async () => {
    try {
      const { data: userById } = await axios.get(`/users/user/${user?._id}`);

      return userById;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteUserById = async (id) => {
    try {
      const { data: userDeleted } = await axios.delete(`/users/eliminar/${id}`);
      return userDeleted;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteUserReserve = async (username, id) => {
    try {
      await axios.put(`/users/reserves/delete`, {
        username: username,
        reserveId: id,
      });
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const closeSession = async () => {
    try {
      setUser({ type: 'LOGOUT' });
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  return {
    userLogin,
    getAllUsers,
    updateUserById,
    updateUsersPassword,
    getUserById,
    deleteUserById,
    deleteUserReserve,
    closeSession,
  };
};
