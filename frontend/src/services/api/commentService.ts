import api from './api';

const commentService = {
  async fetchComments(carId: string) {
    const response = await api.get(`/comments/${carId}`);
    return response.data;
  },
  async createComment(carId: string, data: any) {
    const response = await api.post(`/comments/${carId}`, data);
    return response.data;
  },
  async fetchSellerComments(sellerId: string) {
    const response = await api.get(`/comments/seller/${sellerId}`);
    return response.data;
  },
  async createSellerComment(sellerId: string, data: any) {
    const response = await api.post(`/comments/seller/${sellerId}`, data);
    return response.data;
  },
};

export default commentService;
