import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../../lib/supabaseClient';

const ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  DEFAULT: 'DEFAULT',
  UPDATE_USER: 'UPDATE_USER',
};
Object.freeze(ACTIONS);

/**
 * userStore (admin) — Supabase edition.
 *
 * Same shape as the client store, kept separate so the admin and the public
 * site can be signed in to different accounts at the same time.
 */
const storeApi = (set, get) => ({
  user: {
    user: JSON.parse(sessionStorage.getItem('admin-profile') || localStorage.getItem('admin-profile') || 'null'),
    loading: false,
    error: null,
  },

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
      const next = { ...profile, id: profile.id, email: profile.email };
      set((state) => ({ user: { ...state.user, user: next } }));
      sessionStorage.setItem('admin-profile', JSON.stringify(next));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('updateUser failed:', err?.message);
    }
  },

  ACTIONS,

  setUser: (action) => {
    switch (action.type) {
      case ACTIONS.LOGIN_START:
        set((state) => { state.user = { user: null, loading: true, error: null }; });
        break;
      case ACTIONS.LOGIN_SUCCESS:
        set((state) => { state.user = { user: action.payload, loading: false, error: null }; });
        if (action.payload) sessionStorage.setItem('admin-profile', JSON.stringify(action.payload));
        break;
      case ACTIONS.LOGIN_FAILURE:
        set((state) => { state.user = { user: null, loading: false, error: action.payload }; });
        break;
      case ACTIONS.LOGOUT:
        set((state) => { state.user = { user: null, loading: false, error: null }; });
        sessionStorage.removeItem('admin-profile');
        localStorage.removeItem('admin-profile');
        break;
      case ACTIONS.DEFAULT:
        set((state) => {
          state.user = {
            user: JSON.parse(sessionStorage.getItem('admin-profile') || localStorage.getItem('admin-profile') || 'null'),
            loading: false,
            error: null,
          };
        });
        break;
      case ACTIONS.UPDATE_USER:
        set((state) => { state.user = { user: action.payload, loading: false, error: null }; });
        if (action.payload) sessionStorage.setItem('admin-profile', JSON.stringify(action.payload));
        break;
      default:
        get().user;
    }
  },
});

export const userStore = create(immer(persist(storeApi, { name: 'clubmanager.admin.user', storage: createJSONStorage(() => sessionStorage) })));
