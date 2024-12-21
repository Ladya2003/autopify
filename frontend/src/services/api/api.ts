import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Интерсептор для обработки истечения токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка - истёкший токен
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === 'Token expired'
    ) {
      try {
        const refreshToken = localStorage.getItem('refresh_token'); // Получаем Refresh Token
        const response = await axios.post(
          'http://localhost:3000/auth/refresh',
          {
            refresh_token: refreshToken,
          },
        );

        const newAccessToken = response.data.access_token;

        // Сохраняем новый Access Token
        localStorage.setItem('access_token', newAccessToken);

        // Повторяем оригинальный запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Не удалось обновить токен:', refreshError);
        // Если Refresh Token тоже истёк, перенаправляем на страницу входа
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
