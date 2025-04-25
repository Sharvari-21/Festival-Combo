const CACHE_NAME = 'festival-combo-shop-v1';
const FILES_TO_CACHE = [
  '/Festival-Combo/',
  '/Festival-Combo/index.html',
  '/Festival-Combo/styles.css',
  '/Festival-Combo/manifest.json',
  '/Festival-Combo/serviceworker.js',
  '/Festival-Combo/offline.html',           // ✅ Added
  '/Festival-Combo/color_new.webp',
  '/Festival-Combo/diwalisweets.webp',
  '/Festival-Combo/holicolors.webp',
  '/Festival-Combo/christmas.webp',
  '/Festival-Combo/icon-192.png',
  '/Festival-Combo/icon-512.png',
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching files");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch", event.request.url);
  const requestURL = new URL(event.request.url);

  if (requestURL.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch(() => caches.match('/Festival-Combo/offline.html'));
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((res) => {
          return res || caches.match('/Festival-Combo/offline.html');
        })
      )
    );
  }
});

// Sync Event (placeholder)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(
      (async () => {
        console.log("Sync event triggered: 'sync-data'");
        // Future sync logic
      })()
    );
  }
});

// Push Notification
self.addEventListener("push", function (event) {
  if (event && event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        method: "pushMessage",
        message: event.data.text(),
      };
    }

    if (data.method === "pushMessage") {
      console.log("Push notification sent");
      event.waitUntil(
        self.registration.showNotification("Maharashtrian Handloom", {
          body: data.message,
        })
      );
    }
  }
});
