import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';

export const useCourtAPI = () => {
  const { notifyWarning, notifySuccess } = useNotifications();
  const axios = useAxiosInstance();

  const getAllCourts = useCallback(async () => {
    try {
      const { data } = await axios.get('/courts/');
      return data ?? [];
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }, [axios, notifyWarning]);

  const deleteCourt = useCallback(async (id) => {
    try {
      await axios.delete(`/courts/delete/${id}`);
      notifySuccess('Cancha eliminada');
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
    }
  }, [axios, notifySuccess, notifyWarning]);

  const deleteOldReserves = useCallback(async () => {
    try {
      await axios.put('/courts/reserve/clean');
      notifySuccess('Reservas vencidas eliminadas');
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
    }
  }, [axios, notifySuccess, notifyWarning]);

  return {
    getAllCourts,
    deleteCourt,
    deleteOldReserves,
  };
};
