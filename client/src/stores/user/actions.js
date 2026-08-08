// Auth action types — exported standalone so they can be imported without
// pulling in the whole zustand store. This keeps `useUserAPI` light and
// avoids Rules-of-Hooks churn around the ACTIONS destructure.
export const ACTIONS = Object.freeze({
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
});
