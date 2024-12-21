import api from './api';

const carService = {
  async fetchCars(filters: Record<string, any> = {}) {
    try {
      const response = await api.get('/cars', { params: filters });
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
  async fetchCar(carId: string) {
    const response = await api.get(`/cars/cars?carId=${carId}`);
    return response.data;
  },
  async fetchModels(selectedBrand: string) {
    const response = await api.get(`/cars/brands?brand=${selectedBrand}`);
    return response.data;
  },
  async fetchBrands() {
    const response = await api.get(`/cars/brands`);
    return response.data;
  },
  async createCar(data: any) {
    const response = await api.post('/cars', data);
    return response.data;
  },
  async updateCar(carId: string, data: any) {
    const response = await api.put(`/cars/${carId}`, data);
    return response.data;
  },
  async deleteCar(carId: string) {
    const response = await api.delete(`/cars/${carId}`);
    return response.data;
  },
};

export default carService;
