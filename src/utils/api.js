import axios from 'axios';
import token from './token';
import NavigationService from './NavigationService';

const api = axios.create({
  baseURL: 'https://api.com',
});

api.interceptors.request.use(
  async config => {
    const newConfig = config;
    const localToken = await token.getToken();

    if (localToken) {
      newConfig.headers.authorization = 'Bearer ' + localToken;

      return newConfig;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (!error.response) {
      NavigationService.navigate('NoConnectivity');
    }
    Promise.reject(error);
  }
);

export default api;
