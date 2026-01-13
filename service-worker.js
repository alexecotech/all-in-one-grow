// Service Worker para All In One Grow PWA
const CACHE_NAME = 'all-in-one-grow-v1';
const urlsToCache = [
  '/all-in-one-grow/',
  '/all-in-one-grow/index.html',
  '/all-in-one-grow/registro.html',
  '/all-in-one-grow/configuracion-metas.html',
  '/all-in-one-grow/desglose-mensual.html',
  '/all-in-one-grow/desglose-semanal.html',
  '/all-in-one-grow/dashboard.html',
  '/all-in-one-grow/reporte-nocturno.html'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Service Worker: Error al cachear', err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando cache antiguo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            return caches.match('/all-in-one-grow/index.html');
          });
      })
  );
});
