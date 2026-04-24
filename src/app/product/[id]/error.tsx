'use client';

export default function ProductError({ error }: { error: Error }) {
  console.error('🔥 PRODUCT PAGE ERROR:', error);

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Page Crash</h2>
      <pre>{error.message}</pre>
    </div>
  );
}