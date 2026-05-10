const CACHE_NAME = 'lorena-johan-cache-v1'
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/background.avif',
  '/assets/intro.avif',
  '/assets/end/lorena-and-johan-title.avif',
  '/assets/end/text.avif',
  '/assets/end/wedding-site-button.png',
  '/assets/ok.png',
  '/assets/go.png',
  '/assets/skip.png',
  '/assets/clicked-go-and-wedding-site.ogg',
  '/assets/clicked-ok-and-skip-and-player.ogg',
  '/assets/soundtrack.mp3',
  '/assets/lorena-background.avif',
  '/assets/johan-background.avif',
  '/assets/lorena-all-spritesheet.avif',
  '/assets/johan-all-spritesheet.avif',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== location.origin) {
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cachedResponse) =>
        cachedResponse || fetch('/index.html')
      )
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})
