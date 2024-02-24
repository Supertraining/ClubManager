import axios from 'axios';
import { userStore } from '../stores';
import { useMemo } from 'react';

const useAxiosInstance = () => {
  const { user } = userStore((state) => state.user);

  const instance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
      headers: {
        Authorization: user ? `Bearer ${user.token}` : '',
        Accept: 'application/json',
      },
      withCredentials: true,
    });
  }, [user]);

  return instance;
};

export default useAxiosInstance;
