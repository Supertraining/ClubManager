import axios from 'axios';
import { useMemo } from 'react';
import { supabase, API_BASE } from '../lib/supabaseClient';
import { userStore } from '../stores';

/**
 * useAxiosInstance (admin) — same shape as the client version, separate
 * Supabase storage key. Refreshes the access_token on 401.
 */
export const useAxiosInstance = () => {
  const user = userStore((s) => s.user?.user);

  return useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: { Accept: 'application/json' },
    });

    instance.interceptors.request.use(async (config) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original?._retried) {
          original._retried = true;
          const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError && session?.access_token) {
            original.headers.Authorization = `Bearer ${session.access_token}`;
            return instance(original);
          }
          await supabase.auth.signOut();
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.assign('/login');
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [user?.id]);
};
