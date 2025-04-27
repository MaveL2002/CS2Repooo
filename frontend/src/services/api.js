// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const residentService = {
  // Get all residents
  getAllResidents: async () => {
    const response = await api.get('/residents');
    return response.data;
  },

  // Get resident by ID
  getResidentById: async (id) => {
    const response = await api.get(`/residents/${id}`);
    return response.data;
  },

  // Create new resident
  createResident: async (residentData) => {
    const response = await api.post('/residents', residentData);
    return response.data;
  },

  // Update resident
  updateResident: async (id, residentData) => {
    const response = await api.put(`/residents/${id}`, residentData);
    return response.data;
  },

  // Delete resident
  deleteResident: async (id) => {
    const response = await api.delete(`/residents/${id}`);
    return response.data;
  }
};

export const backupService = {
  // Download backup in JSON format
  downloadJSON: async () => {
    const response = await api.get('/backup/json', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Download backup in CSV format
  downloadCSV: async () => {
    const response = await api.get('/backup/csv', {
      responseType: 'blob'
    });
    return response.data;
  }
};

export const qrCodeService = {
  // Generate QR code for resident
  generateQRCode: async (residentId) => {
    const response = await api.get(`/qr/${residentId}`);
    return response.data;
  }
};

export default api;