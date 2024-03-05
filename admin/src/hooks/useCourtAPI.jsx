import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { useCallback } from 'react';
export const useCourtAPI = () => {
  const { notifyWarning, notifySuccess } = useNotifications();
  const axios = useAxiosInstance();

  const getAllCourts = useCallback( async () => {
    try {
      const { data: allCourts } = await axios.get('/courts/');
      return allCourts;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  },[axios, notifyWarning]);

  const deleteCourt = async (id) => {
    try {
      await axios.delete(`/courts/delete/${id}`);
      notifySuccess('Cancha eliminada');
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteOldReserves = async () => {
    try {
      await axios.put('/courts/reserve/clean');
      notifySuccess('Historial de reservas eliminadas');
    } catch (error) {
      notifyWarning('Ha ocurrido un problema, por favor intente nuevamente mas tarde');
    }
  };

  return {
    getAllCourts,
    deleteCourt,
    deleteOldReserves,
  };
};
