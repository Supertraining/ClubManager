import { useMemo } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * useNotifications — same surface as before, but the returned object is
 * memoised so consumers (useCallback deps, useEffect deps) don't see a new
 * reference on every render. That was triggering Rules-of-Hooks warnings
 * downstream when `useCallback([..., notifyWarning])` re-created the callback
 * mid-render.
 */
export const useNotifications = () => {
  return useMemo(
    () => ({
      notify: (text) => toast(`${text}`, { autoClose: 2000 }),
      notifySuccess: (text) =>
        toast.success(`${text}`, { position: 'bottom-right', autoClose: 1000, theme: 'dark' }),
      notifyWarning: (text) =>
        toast.warn(`${text}`, { position: 'bottom-right', autoClose: 2000, theme: 'dark' }),
      notifyError: (text) =>
        toast.error(`${text}`, { position: 'bottom-right', autoClose: 1000, theme: 'dark' }),
    }),
    [],
  );
};
