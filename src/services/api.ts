import axios from 'axios';

const api = axios.create({
    baseURL: 'http://exp-track-api.ap-south-1.elasticbeanstalk.com/api',
});

export default api;