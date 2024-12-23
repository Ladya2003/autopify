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
  async fetchTestDrives(carId: string) {
    const response = await api.get(`/test-drives?carId=${carId}`);
    return response.data;
  },
  async fetchTestDrivesByUserId(userId: string) {
    const response = await api.get(
      `/test-drives/test-drives-userId/?userId=${userId}`,
    );
    return response.data;
  },
  async updateTestDrive(testDriveId: string, data: any) {
    const response = await api.put(`/test-drives/${testDriveId}`, data);
    return response.data;
  },
};

export default testDriveService;
