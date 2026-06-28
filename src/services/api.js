import axios from 'axios';

// Single Axios instance with base config
const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — logs every outgoing call
api.interceptors.request.use((config) => {
  console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Response interceptor — maps errors to a human-readable string
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request ? 'No response from server. Is Express running?' : error.message);
    return Promise.reject(new Error(message));
  }
);

// ── API helpers ────────────────────────────────────────────────────────────
export const fetchEmployees = (params = {}) => api.get('/employees', { params });
export const createEmployee = (data)         => api.post('/employees', data);
export const updateEmployee = (id, data)     => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id)           => api.delete(`/employees/${id}`);