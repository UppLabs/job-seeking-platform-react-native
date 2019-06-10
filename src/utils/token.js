import { AsyncStorage } from 'react-native';

const getTokenExpiration = () => {
  const token = AsyncStorage.getItem('token');

  if (token) {
    const accessTokenExpiresAt = JSON.parse(token).accessTokenExpiresAt;

    return new Date(accessTokenExpiresAt);
  }

  return null;
};

const getRefreshTokenExpiration = () => {
  const token = AsyncStorage.getItem('token');

  if (token) {
    const refreshTokenExpiresAt = JSON.parse(token).refreshTokenExpiresAt;

    return new Date(refreshTokenExpiresAt);
  }

  return null;
};

const getToken = async () => {
  const locaToken = await AsyncStorage.getItem('token');

  if (locaToken) {
    const token = locaToken;

    return token;
  }

  return null;
};

const removeToken = () => {
  const locaToken = AsyncStorage.getItem('token');

  if (locaToken) {
    AsyncStorage.removeItem('token');
  }

  return null;
};

const clearAll = async () => {
  const result = await AsyncStorage.clear();

  return result;
};

const setToken = value => {
  AsyncStorage.setItem('token', value);
};

export default {
  getToken,
  setToken,
  getTokenExpiration,
  getRefreshTokenExpiration,
  removeToken,
  clearAll,
};
