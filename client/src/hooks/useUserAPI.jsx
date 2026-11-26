import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { userStore as useUserStore } from '../stores';
import { ACTIONS } from '../stores/user/actions';
import { clubPath } from '../lib/clubRoute';

/**
 * useUserAPI — Supabase edition.
 *
 * Auth (login, logout) goes through `supabase.auth.*`.
 * Profile/admin operations go through the Express backend with the
 * Supabase access_token as Bearer.
 *
 * Backward-compatible surface: same function names + signatures as the
 * pre-migration hook where possible. Note that reservation deletes moved
 * to `useReservesAPI.deleteReserve(id)` because the data model changed
 * (reservations are no longer nested on the user document).
 */
export const useUserAPI = () => {
  const { notifyWarning, notifyError } = useNotifications();
  const axios = useAxiosInstance();
  const setUser = useUserStore((s) => s.setUser);
  const navigate = useNavigate();

  const userLogin = useCallback(async ({ username, password }) => {
    setUser({ type: ACTIONS.LOGIN_START });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(username).trim().toLowerCase(),
      password,
    });
    if (error) {
      setUser({ type: ACTIONS.LOGIN_FAILURE, payload: error.message });
      notifyWarning('Email o contraseña incorrectos.');
      throw error;
    }
    setUser({ type: ACTIONS.LOGIN_SUCCESS, payload: { id: data.user.id, email: data.user.email } });
    return data.user;
  }, [setUser, notifyWarning]);

  const joinClub = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Iniciá sesión para sumarte al club.');
      const { data } = await axios.post('/memberships/join');
      setUser({ type: ACTIONS.LOGIN_SUCCESS, payload: { id: session.user.id, email: session.user.email, role: data.role } });
      return data;
    } catch (error) {
      const detail = error.response?.data;
      notifyWarning(detail?.message || (typeof detail === 'string' ? detail : error.message));
      throw error;
    }
  }, [axios, setUser, notifyWarning]);

  const userRegister = useCallback(async ({ username, password, nombre, apellido, edad, telefono }) => {
    const { data, error } = await supabase.auth.signUp({
      email: String(username).trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: window.location.origin + clubPath('/register'),
        data: {
          first_name: nombre,
          last_name: apellido,
          age: Number(edad),
          phone: telefono,
        },
      },
    });
    if (error) {
      notifyError(error.message);
      throw error;
    }
    if (!data.session) {
      return { requiresEmailConfirmation: true, user: data.user };
    }
    setUser({ type: ACTIONS.LOGIN_SUCCESS, payload: { id: data.user.id, email: data.user.email } });
    await joinClub();
    return { user: data.user, session: data.session };
  }, [setUser, notifyError, joinClub]);

  const getAllUsers = useCallback(async () => {
    try {
      const { data } = await axios.get('/users/getAll');
      data.sort((a, b) => (a.last_name > b.last_name ? 1 : a.last_name < b.last_name ? -1 : 0));
      return data ?? [];
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }, [axios, notifyWarning]);

  const getUserById = useCallback(async (id) => {
    if (!id) return null;
    try {
      const { data } = await axios.get(`/users/user/${id}`);
      return data;
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return null;
    }
  }, [axios, notifyWarning]);

  const updateUserById = useCallback(async (id, updates) => {
    try {
      const { data } = await axios.put(`/users/update/${id}`, updates);
      return data;
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
      return null;
    }
  }, [axios, notifyWarning]);

  const updateUsersPassword = useCallback(async (targetUser, newPassword) => {
    try {
      await axios.put('/users/update', { _id: targetUser.id, password: newPassword });
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
    }
  }, [axios, notifyWarning]);

  const deleteUserById = useCallback(async (id) => {
    try {
      await axios.delete(`/users/eliminar/${id}`);
    } catch (error) {
      notifyWarning(`Hubo un problema: ${error?.response?.data?.message || error.message}`);
    }
  }, [axios, notifyWarning]);

  const closeSession = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
    } catch {
      if (useUserStore.getState().user.user) {
        notifyWarning('No se pudo cerrar la sesión. Volvé a intentarlo.');
        return;
      }
    }
    setUser({ type: ACTIONS.LOGOUT });
    navigate('/login', { replace: true });
  }, [setUser, navigate, notifyWarning]);

  return {
    userLogin,
    userRegister,
    joinClub,
    getAllUsers,
    getUserById,
    updateUserById,
    updateUsersPassword,
    deleteUserById,
    closeSession,
  };
};
