import { useEffect, useReducer, createContext } from 'react';

const INITIAL_STATE = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	loading: false,
	error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_START':
			return {
				user: null,
				loading: true, //start fetching process
				error: null,
			};
		case 'LOGIN_SUCCESS':
			return {
				user: action.payload,
				loading: false, //end fetching process
				error: null,
			};
		case 'LOGIN_FAILURE':
			return {
				user: null,
				loading: false, //end fetching process
				error: action.payload,
			};
		case 'LOGOUT':
			return {
				user: null,
				loading: false,
				error: null,
			};
		default:
			return state;
	}
};
//el useReducer es un hook similar al useState per que me permite ejecutar acciones mas complejas. va a tomar como argumento una funcion que esa funcion(SearchReducer) va tomar como argumentos state y action. Con el dispatch que es similar al setState, lo que voy a hacer es ejecutar en cualquier lado el tipo de case y según cual sea se va a actualizar el state
export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(state.user));
	}, [state.user]);

	return (
		<AuthContext.Provider
			value={{ user: state.user, loading: state.loading, error: state.error, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
