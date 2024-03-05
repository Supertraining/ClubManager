import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { userStore } from '../stores';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useUserAPI = () => {
  const { notifyWarning } = useNotifications();
  const axios = useAxiosInstance();
  const { setUser } = userStore();
  const navigate = useNavigate();

  const userLogin = async (credentials) => {
    const { data: token } = await axios.post('/users/login', credentials);
    const decodedUser = jwtDecode(token);

    const user = { ...decodedUser, token: token };

    return user;
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

  const updateUserById = async (id, credentials) => {
    try {
      const { data: updatedUser } = await axios.put(`/users/update/${id}`, credentials);

      return updatedUser;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const getUserById = async (id) => {
    try {
      const { data: userById } = await axios.get(`/users/user/${id}`);
      return userById;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteUserById = async (id) => {
    try {
      await axios.delete(`/users/eliminar/${id}`);
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
    getUserById,
    deleteUserById,
    closeSession,
  };
};
