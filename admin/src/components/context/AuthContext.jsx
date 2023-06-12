import { useReducer, createContext, useEffect } from "react";
import useFetch from "../../hooks/useFetch.jsx";

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null,
};

export const AuthContext = createContext();

let AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        user: null,
        loading: false,
        error: null
      };
    default:
      return state;
  };
};


export const AuthContextProvider = ({ children }) => {

  const { data } = useFetch('http://localhost:8080/home')

  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)


  useEffect(() => {

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: data
    })

  }, [data])


  return (
    <AuthContext.Provider value={{ user: state.user, loading: state.loading, error: state.error, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

