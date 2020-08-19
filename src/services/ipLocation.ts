import axios from 'axios';

const ipLocation = axios.create({
  baseURL: 'http://www.geoplugin.net/'
});

export default ipLocation;