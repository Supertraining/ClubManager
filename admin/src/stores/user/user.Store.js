import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  DEFAULT: 'DEFAULT',
  UPDATE_USER: 'UPDATE_USER'
};
Object.freeze(ACTIONS);

const storeApi = (set, get) => ({

  user: {
    user: JSON.parse(localStorage.getItem('user'))?.state?.user?.user || JSON.parse(sessionStorage.getItem('user'))?.state?.user?.user || null,
    loading: false,
    error: null,
  },

  updateUser: async () => {

    let { user } = get().user

    const instance = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
      headers: {
        Authorization: user ? `Bearer ${user.token}` : '',
        Accept: 'application/json',
      },
      withCredentials: true,
    });
    try {

      const { data: userById } = await instance.get(`/users/user/${user._id}`);
     
      const updatedUser = { ...userById, token: user.token };

      set((state) => ({
        user: {
          ...state.user,
          user: updatedUser,
        },
      }));
    } catch (error) {
      console.error('Error updating user:', error);
    }

  },

  ACTIONS: ACTIONS,

  setUser: (action) => {

    switch (action.type) {
      case ACTIONS.LOGIN_START:
        set((state) => {
          state.user = {
            user: null,
            loading: true,
            error: null,
          };
        });
        break;
      case ACTIONS.LOGIN_SUCCESS:
        set((state) => {
          state.user = {
            user: action.payload,
            loading: false,
            error: null,
          };
        });
        break;
      case ACTIONS.LOGIN_FAILURE:
        set((state) => {
          state.user = {
            user: null,
            loading: false,
            error: action.payload,
          };
        });
        break;
      case ACTIONS.LOGOUT:
        set((state) => {
          state.user = {
            user: null,
            loading: false,
            error: null,
          };
        });
        break;
      case ACTIONS.DEFAULT:
        set((state) => {
          state.user = {
            user: JSON.parse(localStorage.getItem('user'))?.state?.user?.user || JSON.parse(sessionStorage.getItem('user'))?.state?.user?.user || null,
            loading: false,
            error: null,
          }
        })
        break;
      case ACTIONS.UPDATE_USER:
        set((state) => {
          state.user = {
            user: action.payload,
            loading: false,
            error: null,
          };
        });
        break;
      default:
        get().user
    }
  },

})

export const userStore = create((immer(persist(storeApi, { name: 'user', storage: createJSONStorage(() => sessionStorage) }))));