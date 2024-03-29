import axios from 'axios';
import { userStore } from '../stores';

export const useAxiosInstance = () => {
  const { user: { user } } = userStore();
 
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
    headers: {
      Authorization: user ? `Bearer ${user.token}` : '',
      Accept: 'application/json',
    },
    withCredentials: true,
  });

  return instance;
};

