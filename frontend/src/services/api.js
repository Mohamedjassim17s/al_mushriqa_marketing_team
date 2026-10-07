import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Interceptor to attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload if on a protected route
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const getMeApi = () => API.get('/auth/me');

// Employee Services
export const getEmployeesApi = () => API.get('/employees');
export const createEmployeeApi = (employeeData) => API.post('/employees', employeeData);
export const updateEmployeeApi = (id, employeeData) => API.put(`/employees/${id}`, employeeData);
export const deleteEmployeeApi = (id) => API.delete(`/employees/${id}`);

// Task Services
export const getTasksApi = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.employee && filters.employee !== 'All') params.append('employee', filters.employee);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);

  return API.get(`/tasks?${params.toString()}`);
};

export const createTaskApi = (taskData) => API.post('/tasks', taskData);
export const updateTaskApi = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTaskApi = (id) => API.delete(`/tasks/${id}`);

// Dashboard Services
export const getDashboardStatsApi = () => API.get('/dashboard/stats');

export default API;
