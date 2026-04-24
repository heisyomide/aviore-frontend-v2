'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('🔥 GLOBAL ERROR:', error);
  }, [error]);

  return (
    <html>
      <body style={{ padding: 20 }}>
        <h1 style={{ color: 'red' }}>Something broke</h1>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {error.message}
        </pre>

        <button onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}