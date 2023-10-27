import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default instance;
//https://club-manager-api-o1cp.onrender.com