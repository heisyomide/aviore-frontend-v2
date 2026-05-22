import axios from 'axios';
import { getDeviceFingerprint } from '../utils/fingerprint'; // 👈 Make sure to import your utility function here

// 🚀 REGISTRY_ENDPOINT: Ensuring a fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 REQUIRED: Allows your httpOnly refresh tokens/session cookies to pass through safely
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🛰️ REQUEST_INTERCEPTOR: Injection of Identity Token & Anti-Fraud Telemetry
 * This ensures every call to NestJS includes the Bearer token and browser fingerprint.
 */
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    // 1. Existing Authorization Token Extraction
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 🛡️ NEW: Async Anti-Fraud Fingerprint Injection
    try {
      // Pull from temporary sessionStorage to prevent recalculating the canvas hash on every individual request
      let fingerprint = sessionStorage.getItem('__avr_dfp');
      
      if (!fingerprint) {
        fingerprint = await getDeviceFingerprint();
        if (fingerprint) {
          sessionStorage.setItem('__avr_dfp', fingerprint);
        }
      }

      if (fingerprint) {
        config.headers['x-device-fingerprint'] = fingerprint;
      }
    } catch (fingerprintError) {
      // Soft-catch telemetry calculation failures so standard client requests never freeze or break
      console.error('⚠️ TELEMETRY_INTERCEPTOR_EXCEPTION:', fingerprintError);
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
        console.warn("IDENTITY_EXPIRED: Session terminated by NestJS Registry.");
      }
    }
    return Promise.reject(error);
  }
);