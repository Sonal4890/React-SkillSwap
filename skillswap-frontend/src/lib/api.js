import axios from 'axios';

// Prefer same-origin during dev (via Vite proxy). Fall back to explicit URL if provided.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      const target = '/login';
      if (path !== target && path !== '/register') {
        window.location.href = target;
      }
    }
    // Handle blocked users (403)
    if (status === 403 && typeof window !== 'undefined') {
      const message = error?.response?.data?.message;
      if (message && message.includes('Blocked')) {
        const path = window.location.pathname;
        const target = '/login';
        if (path !== target && path !== '/register') {
          // Store the error message in sessionStorage to show on login page
          sessionStorage.setItem('blockedError', message);
          window.location.href = target;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
