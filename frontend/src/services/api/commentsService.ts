import api from './api';

const commentsService = {
  async fetchComments(carId: string) {
    const response = await api.get(`/cars/${carId}/comments`);
    return response.data;
  },
  async addComment(carId: string, text: string) {
    const response = await api.post(`/cars/${carId}/comments`, { text });
    return response.data;
  },
};

export default commentsService;
