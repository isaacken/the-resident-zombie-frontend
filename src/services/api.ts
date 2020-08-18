import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zssn-backend-example.herokuapp.com/'
});

export default api;