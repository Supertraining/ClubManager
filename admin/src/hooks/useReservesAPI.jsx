import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';

/**
 * useReservesAPI (admin) — Supabase edition.
 *
 * Admins can create a reservation on behalf of any user. The server's
 * `create_reservation` RPC accepts (court_id, start, end, permanent, info)
 * and enforces RLS (admins can insert on behalf of anyone).
 */
export const useReservesAPI = () => {
  const { notifyWarning, notifySuccess } = useNotifications();
  const axios = useAxiosInstance();

  const getReservationsForCourt = useCallback(async (courtName) => {
    try {
      const { data } = await axios.get(`/courts/${courtName}`);
      return data;
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return null;
    }
  }, [axios, notifyWarning]);

  const createReserve = useCallback(async ({ courtName, date, initialTime, finalTime, permanent = false, info = null, onBehalfOfUserId = null }) => {
    try {
      const start = new Date(`${date}T${initialTime}:00-03:00`);
      const end = new Date(`${date}T${finalTime}:00-03:00`);
      const { data } = await axios.put('/courts/reserve', {
        name: courtName,
        selectedDates: { date, initialTime, finalTime, permanent },
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        onBehalfOfUserId,
      });
      notifySuccess('Reserva creada');
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      notifyWarning(`No se pudo crear la reserva: ${msg}`);
      return null;
    }
  }, [axios, notifySuccess, notifyWarning]);

  const deleteReserve = useCallback(async (reservationId) => {
    try {
      await axios.delete(`/users/reserves/${reservationId}`);
      notifySuccess('Reserva eliminada');
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
    }
  }, [axios, notifySuccess, notifyWarning]);

  return {
    getReservationsForCourt,
    createReserve,
    deleteReserve,
  };
};
