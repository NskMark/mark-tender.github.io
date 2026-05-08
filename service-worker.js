const CACHE_NAME = 'expert-tender-v1';
const urlsToCache = [
  './',
  './index.html',
  './tenders.html',
  './about.html',
  './contacts.html',
  './style.css',
  './icon.svg'
];

// Установка: кэшируем все файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэш открыт');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Ошибка кэширования:', err))
  );
  self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Запросы: сначала ищем в кэше, потом в интернете
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
