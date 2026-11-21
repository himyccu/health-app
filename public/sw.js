/* HAYLEY 健康管家 Service Worker
 * 策略：
 * 1. 導覽請求採 network-first（8 秒沒回應就回快取），確保重新部署後拿到最新 index.html。
 * 2. 靜態資源採 stale-while-revalidate，開啟速度與更新兼顧。
 * 3. 安裝時 skipWaiting、啟用時 clients.claim，讓新版本立即接手。
 * 4. 快取有上限，長期使用不會無限膨脹。
 */

const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `hayley-health-${CACHE_VERSION}`;
const MAX_CACHE_ENTRIES = 80;
const NAVIGATION_TIMEOUT_MS = 8000;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/cover.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(
    keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)),
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch(() => {
            /* 單一資源失敗不阻擋安裝 */
          }),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 頁面導覽：先連網拿最新版本，斷網或連線過慢時才回退快取。
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), NAVIGATION_TIMEOUT_MS);
        try {
          const fresh = await fetch(request, { signal: controller.signal });
          if (fresh.ok) {
            await cache.put('/index.html', fresh.clone());
            event.waitUntil(trimCache(CACHE_NAME, MAX_CACHE_ENTRIES));
          }
          return fresh;
        } catch {
          return (
            (await cache.match('/index.html')) ||
            (await cache.match('/')) ||
            new Response('目前沒有網路連線，請稍後再試。', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          );
        } finally {
          clearTimeout(timer);
        }
      })(),
    );
    return;
  }

  // 靜態資源：先回快取，同時在背景更新。
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) {
        event.waitUntil(
          fetch(request)
            .then(async (response) => {
              if (response.ok) {
                await cache.put(request, response);
                await trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
              }
            })
            .catch(() => {
              /* 離線時沿用快取 */
            }),
        );
        return cached;
      }

      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response.clone());
          await trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
        }
        return response;
      } catch {
        return new Response('', { status: 504 });
      }
    })(),
  );
});
