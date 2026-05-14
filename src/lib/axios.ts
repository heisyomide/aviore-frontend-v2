import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 1. Clean the URL to prevent double slashes (e.g., .../api//auth)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for session_id cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh State Registry
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ==========================================
// REQUEST INTERCEPTOR: Attach Bearer Token
// ==========================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR: Handle Expired Tokens
// ==========================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 and not a refresh attempt itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use a clean axios instance for refresh to avoid interceptor loops
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { access_token } = data;
        
        // Update storage
        localStorage.setItem('access_token', access_token);
        
        // Apply to default headers for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        processQueue(null, access_token);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // CRITICAL: If refresh fails, wipe everything and kick to login
        if (typeof window !== 'undefined') {
          localStorage.clear();
          // Use window.location for a hard reset of the app state
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?session=expired';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);