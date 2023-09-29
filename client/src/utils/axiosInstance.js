import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://clubmanager-api-4zwl-dev.fl0.io/',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default instance;
