import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { useCallback } from 'react';
export const useCourtAPI = () => {
  const { notifyWarning, notifySuccess } = useNotifications();
  const axios = useAxiosInstance();

  const getAllCourts = useCallback(async () => {
    try {
      const { data: allCourts } = await axios.get('/courts/');
      return allCourts;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  }, [axios, notifyWarning]);

  const deleteCourt = async (id) => {
    try {
      await axios.delete(`/courts/delete/${id}`);
      notifySuccess('Cancha eliminada');
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteReserveByUsername = async (username) => {
    try {
      await axios.put('/courts/reserve/deleteByUsername', { username: username });
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteCourtReserve = async (court, day, id) => {
    try {
      await axios.put(`/courts/reserve/delete`, {
        courtName: court,
        reserveDay: day,
        reserveId: id,
      });
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

  const updateReserveUsername = async (username, newUsername) => {
    try {
      await axios.put('/courts/reserve/userUpdate', {
        user: username,
        newUser: newUsername,
      });
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  return {
    getAllCourts,
    deleteCourt,
    deleteOldReserves,
    updateReserveUsername,
    deleteReserveByUsername,
    deleteCourtReserve,
  };
};
