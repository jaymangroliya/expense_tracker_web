import axios from 'axios';
import store from '../redux/store';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;