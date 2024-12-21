import api from './api';

const testDriveService = {
  async submitTestDriveRequest(data: {
    name: string;
    email: string;
    phone: string;
    carId: string;
  }) {
    const response = await api.post(`/cars/${data.carId}/test-drive`, data);
    return response.data;
  },
  async createTestDrive(data: any) {
    const response = await api.post('/test-drives', data);
    return response.data;
  },
};

export default testDriveService;
