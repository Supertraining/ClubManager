import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { userStore } from '../stores';

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
  const user = userStore((s) => s.user?.user);

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
      const start = new Date(`${date}T${initialTime}:00-03:00`);
      const end = new Date(`${date}T${finalTime}:00-03:00`);
      const { data } = await axios.put('/courts/reserve', {
        name: courtName,
        selectedDates: {
          date,
          initialTime,
          finalTime,
          permanent,
        },
        // startTime/endTime are what the server actually uses now; the legacy
        // selectedDates object is still accepted for backward compat.
        startTime: start.toISOString(),
        endTime: end.toISOString(),
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
