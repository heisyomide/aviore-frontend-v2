import axios from 'axios';

// 🚀 REGISTRY_ENDPOINT: Ensuring a fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🛰️ REQUEST_INTERCEPTOR: Injection of Identity Token
 * This ensures every call to NestJS/Prisma includes the Bearer token.
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 🛡️ RESPONSE_INTERCEPTOR: Auth Integrity Watcher
 * If NestJS returns a 401 (Unauthorized), we purge the local registry 
 * to keep the user state honest.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ⚠️ AUTH_EXPIRATION_HANDLER
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear the registry to prevent "Ghost Sessions"
        localStorage.removeItem('token');
        // Optional: Trigger a redirect or toast here
        console.warn("IDENTITY_EXPIRED: Session terminated by NestJS Registry.");
      }
    }
    return Promise.reject(error);
  }
);