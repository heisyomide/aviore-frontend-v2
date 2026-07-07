// workers/index.js

// 1. Listen for the web-push notification event from Apple/Google push servers
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const payload = event.data.json();
    
    // Read the flat payload options we constructed on the NestJS backend
    const options = {
      body: payload.body || "New Update Available",
      icon: payload.icon || '/icons/icon-192.png',
      badge: payload.badge || '/icons/icon-192.png',
      vibrate: payload.vibrate || [100, 50, 100],
      data: payload.data || { url: '/dashboard/notifications' },
    };

    event.waitUntil(
      self.registration.showNotification(payload.title || "Aviorè", options)
    );
  } catch (err) {
    // Catch-all fallback if the payload isn't clean JSON text
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("Aviorè Update", { body: text })
    );
  }
});

// 2. Handle the user clicking the banner to focus or route them inside the application
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If the app is already open in the background, focus it
      for (const client of windowClients) {
        if ('focus' in client && typeof client.focus === 'function') {
          return client.focus();
        }
      }
      // If the app is completely closed, open a fresh window instance directed at the target route
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});