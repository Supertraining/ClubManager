import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://club-manager-backend-m4ol.onrender.com',
  headers: { "Content-Type": "application/json"},
  withCredentials: true,
});

export default instance;
