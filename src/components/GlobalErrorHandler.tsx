'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.group('🔥 GLOBAL ERROR CAUGHT');
      console.error('Message:', event.message);
      console.error('Filename:', event.filename);
      console.error('Line:', event.lineno);
      console.error('Column:', event.colno);
      console.error('Stack:', event.error?.stack);
      console.groupEnd();

      // Optional: Send to your backend or logging service
      // api.post('/log-error', { message: event.message, stack: event.error?.stack, url: window.location.href });
    };

    // Handle unhandled promise rejections (very common with async stores)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.group('🔥 UNHANDLED PROMISE REJECTION');
      console.error('Reason:', event.reason);
      console.error('Stack:', event.reason?.stack);
      console.error('URL:', window.location.href);
      console.groupEnd();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}