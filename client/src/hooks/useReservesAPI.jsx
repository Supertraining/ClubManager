import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';

/**
 * useReservesAPI — Supabase edition.
 *
 * Reservations now live in their own table; the server's POST /courts/reserve
 * is backed by the `create_reservation` RPC which enforces RLS + the EXCLUDE
 * constraint that prevents double-booking.
 */
export const useReservesAPI = () => {
  const { notifyWarning, notifySuccess } = useNotifications();
  const axios = useAxiosInstance();

  const getMyReserves = useCallback(async () => {
    try {
      const { data } = await axios.get('/users/me/reserves');
      return data ?? [];
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }, [axios, notifyWarning]);

  /**
   * Create a reservation.
   * @param {string} courtName  - one of 'futbol' | 'paddle' | 'squash' | 'paleta'
   * @param {string} date       - 'YYYY-MM-DD'
   * @param {string} initialTime - 'HH:mm'
   * @param {string} finalTime   - 'HH:mm'
   * @param {boolean} [permanent]
   */
  const createReserve = useCallback(async (courtName, date, initialTime, finalTime, permanent = false) => {
    try {
      // The server rebuilds the timestamptz range from these three fields and
      // derives weekday / reservation_date itself (see create_reservation in
      // 03_rpc.sql), so nothing else needs to be sent.
      const { data } = await axios.put('/courts/reserve', {
        name: courtName,
        selectedDates: {
          date,
          initialTime,
          finalTime,
          permanent,
        },
      });
      notifySuccess('Reserva confirmada');
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      notifyWarning(`No se pudo reservar: ${msg}`);
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
    getMyReserves,
    createReserve,
    deleteReserve,
  };
};
