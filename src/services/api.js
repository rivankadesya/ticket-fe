import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password, name) =>
    apiClient.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  getUsers: () =>
    apiClient.get('/auth/users'),
  getMe: () =>
    apiClient.get('/auth/me'),
  updateProfile: (name) =>
    apiClient.put('/auth/profile', { name }),
  changePassword: (current_password, new_password) =>
    apiClient.put('/auth/password', { current_password, new_password }),
};

export const ticketService = {
  createTicket: (ticketData) =>
    apiClient.post('/tickets', ticketData),
  getTickets: (filters = {}) =>
    apiClient.get('/tickets', { params: filters }),
  getTicketById: (id) =>
    apiClient.get(`/tickets/${id}`),
  updateTicket: (id, ticketData) =>
    apiClient.put(`/tickets/${id}`, ticketData),
  deleteTicket: (id) =>
    apiClient.delete(`/tickets/${id}`),
  getDashboardMetrics: () =>
    apiClient.get('/tickets/metrics'),
};

export const commentService = {
  addComment: (ticketId, comment) =>
    apiClient.post(`/tickets/${ticketId}/comments`, { comment }),
  getComments: (ticketId) =>
    apiClient.get(`/tickets/${ticketId}/comments`),
};

export default apiClient;
