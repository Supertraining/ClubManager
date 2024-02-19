import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

const storeApi = (set, get) => ({

  user: {
    user: JSON.parse(localStorage.getItem('user'))?.state?.user?.user || JSON.parse(sessionStorage.getItem('user'))?.state?.user?.user || null,
    loading: false,
    error: null,
  },

  setUser: (action) => {
    
    switch (action.type) {
      case 'LOGIN_START':
        set((state) => {
          state.user = {
            user: null,
            loading: true,
            error: null,
          };
        });
        break;
      case 'LOGIN_SUCCESS':
        set((state) => {
          state.user = {
            user: action.payload,
            loading: false,
            error: null,
          };
        });
        break;
      case 'LOGIN_FAILURE':
        set((state) => {
          state.user = {
            user: null,
            loading: false,
            error: action.payload,
          };
        });
        break;
      case 'LOGOUT':
        set((state) => {
          state.user = {
            user: null,
            loading: false,
            error: null,
          };
        });
        break;
      case 'DEFAULT':
        set((state) => {
          state.user = {
            user: JSON.parse(localStorage.getItem('user'))?.state?.user?.user || JSON.parse(sessionStorage.getItem('user'))?.state?.user?.user || null,
            loading: false,
            error: null,
          }
        })
        break;
      case 'UPDATE_USER':
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