import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
//https://club-manager-api-o1cp.onrender.com
//http://localhost:8080
export default instance;