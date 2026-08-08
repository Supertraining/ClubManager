import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';

/**
 * useCourtAPI — Supabase edition.
 *
 * All calls go to the Express backend. The backend's `/courts/:name` endpoint
 * returns reservations keyed by weekday (0..6) to keep backward compat with
 * the existing week-board UI.
 */
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

  const getUnavailableDatesByName = useCallback(async (name) => {
    try {
      const { data } = await axios.get(`/courts/${name}`);
      return data;
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return null;
    }
  }, [axios, notifyWarning]);

  const deleteCourtReserve = useCallback(async (reservationId) => {
    try {
      await axios.delete(`/users/reserves/${reservationId}`);
      notifySuccess('Reserva eliminada');
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
    }
  }, [axios, notifySuccess, notifyWarning]);

  return {
    getAllCourts,
    getUnavailableDatesByName,
    deleteCourtReserve,
  };
};
