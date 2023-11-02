import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://club-manager-backend-m4ol.onrender.com',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
//https://club-manager-backend-m4ol.onrender.com
//http://localhost:8080
export default instance;