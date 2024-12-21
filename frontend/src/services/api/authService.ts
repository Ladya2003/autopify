import { UserType } from '../../types/user';
import api from './api';

const authService = {
  async login(email: string, password: string, handleLogin?: () => void) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.message) {
        alert('Неверные почта или пароль');
      } else {
        const { access_token, refresh_token } = response.data;

        // Сохраняем токены
        access_token && localStorage.setItem('access_token', access_token);
        refresh_token && localStorage.setItem('refresh_token', refresh_token);

        handleLogin?.();
        window.location.reload();

        console.log('Вход выполнен успешно');
      }
    } catch (error: any) {
      console.error('Ошибка входа:', error.response?.data?.message);
    }
  },
  async register(email: string, password: string) {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Выход выполнен');
    window.location.reload();
  },
  async fetchUserRole(): Promise<UserType | null> {
    try {
      const response = await api.get('/auth/me');
      return response.data as UserType;
    } catch (error) {
      console.error('Ошибка при получении роли пользователя:', error);
      return null;
    }
  },
};

export default authService;
