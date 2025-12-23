import api from './api';

const authService = {

  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.post('/auth/me');
    return response.data;
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};
export default authService;
