  import axios from 'axios';
  import { getToken } from '../utils/auth';
  import { assignLead, searchLeads } from '../../../server/controllers/leadController';
  import { getReports } from '../../../server/controllers/reportController';

  const API_URL = 'http://localhost:5050/api';

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests if it exists
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export const authAPI = {
    login: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    register: async (userData) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
  };

  export const contactsAPI = {
    getContacts: async () => {
      const response = await api.get('/contacts');
      return response.data;
    },
    getContact: async (id) => {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    },
    createContact: async (contactData) => {
      const response = await api.post('/contacts', contactData);
      return response.data;
    },
    updateContact: async (id, contactData) => {
      const response = await api.put(`/contacts/${id}`, contactData);
      return response.data;
    },
    deleteContact: async (id) => {
      const response = await api.delete(`/contacts/${id}`);
      return response.data;
    },
  };

  export const leadsAPI = {
    getLeads: async () => {
      const response = await api.get('/leads');
      return response.data;
    },
    getLead: async (id) => {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    },
    createLead: async (leadData) => {
      const response = await api.post('/leads', leadData);
      return response.data;
    },
    updateLead: async (id, leadData) => { 
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    },
    deleteLead: async (id) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    },
    assignLead: async (id, leadData) => {
      const response = await api.put(`/leads/assign/${id}`, leadData);
      return response.data;
    },
    searchLead: async (queryValue) => {
      const response = await api.get(`leads/search?query=${queryValue}`);
      return response.data;
    }
  };

  export const reportsAPI = {
    getReports: async (queryValue) => {
      const response = await api.get(`leads/search?query=${queryValue}`);
      return response.data;
    }
  };

  export const usersAPI = {
    getUsers: async () => {
      const response = await api.get('/users');
      return response.data;
    },
    getUser: async (id) => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    createUser: async (userData) => {
      const response = await api.post('/users', userData);
      return response.data;
    },
    updateUser: async (id, userData) => {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    },
    deleteUser: async (id) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    // Fetch sales reps
    getSalesReps: async () => {
      const response = await api.get('/users/salesReps');
      return response.data;
    },

    getMe: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
  };

  export default api;