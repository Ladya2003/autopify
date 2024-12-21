import api from './api';

const userService = {
  async fetchSellers() {
    try {
      const response = await api.get('/users/sellers');
      return response.data;
    } catch (error: any) {
      console.error(
        'Ошибка получения списка машин:',
        error.response?.data?.message,
      );
      // alert(
      //   error.response?.data?.statusCode
      //     ? 'Forbidden resource'
      //     : 'An error occurred while fetching cars. Please try again.',
      // );
    }
  },
  async fetchUser(id: string) {
    const response = await api.get(`/users/user?userId=${id}`);
    return response.data;
  },
  async updateUser(data: any) {
    const response = await api.put(`/users`, data);
    return response.data;
  },
};

export default userService;
