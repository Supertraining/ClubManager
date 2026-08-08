import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { userStore } from '../stores';

/**
 * useUserAPI — Supabase edition (admin).
 *
 * The admin app signs users in with Supabase Auth, then uses the
 * access_token to call the Express backend. The backend's `isAdmin`
 * middleware (via `verifyAccessToken`) enforces admin-only endpoints.
 */
export const useUserAPI = () => {
  const { notifyWarning, notifyError } = useNotifications();
  const axios = useAxiosInstance();
  const { setUser, ACTIONS } = userStore((s) => s);
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
  }, [setUser, ACTIONS, notifyWarning]);

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
    await supabase.auth.signOut();
    setUser({ type: ACTIONS.LOGOUT });
    navigate('/login');
  }, [setUser, ACTIONS, navigate]);

  return {
    userLogin,
    getAllUsers,
    getUserById,
    updateUserById,
    updateUsersPassword,
    deleteUserById,
    closeSession,
  };
};
