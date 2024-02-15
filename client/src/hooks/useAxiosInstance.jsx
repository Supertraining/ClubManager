import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';

const useAxiosInstance = () => {
  const { user } = useContext(AuthContext);
  console.log(import.meta.env.VITE_BACKEND_URL)
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

export default useAxiosInstance;
