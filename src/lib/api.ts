// src/lib/api.ts
import axios from 'axios';
import { toast } from 'sonner';

// Create instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    // You can attach token here if needed
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    toast.error('Request failed');
    return Promise.reject(error);
  }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => {
    // SUCCESS TOAST (optional logic)
    if (response.config.method !== 'get') {
      const message =
        response.data?.message || 'Action completed successfully';
      toast.success(message);
    }

    return response;
  },
  (error) => {
    let message = 'Something went wrong';

    if (error.response) {
      // Server responded with error
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Error ${error.response.status}`;
    } else if (error.request) {
      // No response
      message = 'Network error. Check your connection';
    } else {
      // Other errors
      message = error.message;
    }

    toast.error(message);

    return Promise.reject(error);
  }
);