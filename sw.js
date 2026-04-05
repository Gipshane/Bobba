const CACHE = 'lykke-v22';
const FILES = ['./hjem-appen.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting(); // Ta over med én gang — ikke vent på at gamle faner lukkes
});

self.addEventListener('fetch', e =>
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))
  )
);

self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim()) // Overta alle åpne faner umiddelbart
  )
);

// Scheduled local notifications (best-effort — OS may kill SW)
const scheduledTimers = [];

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFS') {
    // Clear previous timers
    scheduledTimers.forEach(t => clearTimeout(t));
    scheduledTimers.length = 0;

    const notifs = event.data.notifs || [];
    notifs.forEach(n => {
      if (n.delay > 0 && n.delay < 24 * 60 * 60 * 1000) {
        const t = setTimeout(() => {
          self.registration.showNotification(n.title, {
            body: n.body,
            icon: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' rx=\'20\' fill=\'%233b7d52\'/><text y=\'.9em\' font-size=\'80\' x=\'10\'>🌱</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' rx=\'20\' fill=\'%233b7d52\'/></svg>',
            tag: n.tag || 'lykke',
            renotify: true,
            vibrate: [200, 100, 200],
          });
        }, n.delay);
        scheduledTimers.push(t);
      }
    });
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(cs => {
      if (cs.length) return cs[0].focus();
      return clients.openWindow('/');
    })
  );
});
