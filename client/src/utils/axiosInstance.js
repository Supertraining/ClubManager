import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://club-manager-api-o1cp.onrender.com',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default instance;
//https://club-manager-api-o1cp.onrender.com