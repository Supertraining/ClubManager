import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { supabase } from '../../lib/supabaseClient';

const ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
};
Object.freeze(ACTIONS);

/**
 * userStore — Supabase edition.
 *
 * The store only holds the *user identity* (id, email). The Supabase client
 * (in `lib/supabaseClient.js`) owns the actual session/access_token. The
 * access_token is read on-demand by the axios interceptor in
 * `hooks/useAxiosInstance.jsx` via `supabase.auth.getSession()`.
 *
 * `persist` keeps the user object across reloads — when the app boots it
 * tries to re-hydrate the Supabase session from localStorage. If the
 * refresh token is still valid, the user is still signed in.
 */
const storeApi = (set, get) => ({
  reserveDeleted: false,

  user: {
    user: JSON.parse(localStorage.getItem('user-profile') || 'null'),
    loading: false,
    error: null,
  },

  ACTIONS,

  setUser: (action) => {
    switch (action.type) {
      case ACTIONS.LOGIN_START:
        set((state) => {
          state.user = { user: null, loading: true, error: null };
        });
        break;
      case ACTIONS.LOGIN_SUCCESS:
        set((state) => {
          state.user = { user: action.payload, loading: false, error: null };
        });
        // Persist a tiny profile blob (NOT the token — Supabase keeps that).
        if (action.payload) {
          localStorage.setItem('user-profile', JSON.stringify(action.payload));
        }
        break;
      case ACTIONS.LOGIN_FAILURE:
        set((state) => {
          state.user = { user: null, loading: false, error: action.payload };
        });
        break;
      case ACTIONS.LOGOUT:
        set((state) => {
          state.user = { user: null, loading: false, error: null };
        });
        localStorage.removeItem('user-profile');
        break;
      case ACTIONS.UPDATE_USER:
        set((state) => {
          state.user = { user: action.payload, loading: false, error: null };
        });
        if (action.payload) {
          localStorage.setItem('user-profile', JSON.stringify(action.payload));
        }
        break;
      default:
        get().user;
    }
  },

  /**
   * Refresh the profile from the backend (e.g. after the admin updates your
   * name or phone). Keeps the same id/email but pulls the latest data.
   */
  updateUser: async () => {
    const current = get().user.user;
    if (!current?.id) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/users/user/${current.id}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      if (!res.ok) return;
      const profile = await res.json();
      set((state) => ({
        user: { ...state.user, user: { ...profile, id: profile.id, email: profile.email } },
      }));
      localStorage.setItem('user-profile', JSON.stringify({ ...profile, id: profile.id, email: profile.email }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('updateUser failed:', err?.message);
    }
  },

  setReserveDeleted: (value) => {
    set((state) => { state.reserveDeleted = value; });
  },
});

export const userStore = create(immer(persist(storeApi, { name: 'clubmanager.user' })));
