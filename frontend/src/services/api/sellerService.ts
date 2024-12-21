import api from './api';

const sellerService = {
  async getSellerById(sellerId: string) {
    const response = await api.get(`/sellers/${sellerId}`);
    return response.data;
  },
  async findRequest() {
    const response = await api.get(`/seller-requests`);
    return response.data;
  },
  async createRequest() {
    const response = await api.post('/seller-requests');
    return response.data;
  },
  async updateRequest(data: any) {
    const response = await api.put(`/seller-requests`, data);
    return response.data;
  },
};

export default sellerService;
