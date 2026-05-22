import axios from 'axios';
import { getDeviceFingerprint } from '../utils/fingerprint'; 

// 🚀 REGISTRY_ENDPOINT: Ensuring a clean inline fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:10000/api';
console.log('API_URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 REQUIRED: Allows httpOnly cookies/refresh tokens to pass through safely
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Synchronous in-memory variable cache backup
let cachedFingerprint: string | null = null;

/**
 * 🛰️ GLOBAL TELEMETRY INITIALIZATION ROUTINE
 * Call this inside your client-side Providers (useEffect) to compute the hash out-of-band exactly once.
 */
export const initAntiFraudTelemetry = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Check if it already exists inside the session registry
    let fingerprint = sessionStorage.getItem('__avr_dfp');
    
    if (!fingerprint) {
      // Run the heavier async browser/canvas fingerprint calculations safely
      fingerprint = await getDeviceFingerprint(); 
      if (fingerprint) {
        sessionStorage.setItem('__avr_dfp', fingerprint);
      }
    }
    
    // Lock it directly into hot memory for instantaneous lookup access
    cachedFingerprint = fingerprint;
  } catch (err) {
    console.error('⚠️ FINGERPRINT_INIT_FAILURE:', err);
  }
};

/**
 * 2. Optimized SYNCHRONOUS Axios Request Interceptor
 * Drops async processing entirely so rapid-fire concurrent dashboard queries are never throttled.
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Standard Authorization JWT Header Assignment
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
 
  
  return config;
});

/**
 * 🛡️ RESPONSE_INTERCEPTOR: Auth Integrity Watcher
 * Purges the local registry if NestJS drops a 401 Unauthorized to stop ghost sessions.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ⚠️ AUTH_EXPIRATION_HANDLER
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        console.warn("IDENTITY_EXPIRED: Session terminated by NestJS Registry.");
      }
    }
    return Promise.reject(error);
  }
);