import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';

// Fallback: same origin (Render frontend -> backend via full URL in env)
const resolvedBaseUrl = apiBaseUrl ? apiBaseUrl : window.location.origin;


const api = axios.create({
baseURL: resolvedBaseUrl,

withCredentials: true
});

// If backend is on a different origin, Authorization header is still enough.
// Do not rely on credentials unless backend explicitly supports it.


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

