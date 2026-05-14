const CACHE_VERSION = 'sudoku-game-v1';

async function getPrecacheResources() {
  const appShell = self.registration.scope;
  const response = await fetch(appShell, { cache: 'reload' });
  const html = await response.clone().text();
  const assetUrls = Array.from(
    html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)=(["'])([^"']+)\1/g),
    ([, , assetPath]) => new URL(assetPath, appShell).toString(),
  ).filter((assetUrl) => new URL(assetUrl).origin === self.location.origin);

  return {
    appShell,
    response,
    urls: Array.from(new Set([
      appShell,
      `${appShell}index.html`,
      ...assetUrls,
    ])),
    optionalUrls: [
      `${appShell}favicon.svg`,
      `${appShell}404.html`,
    ],
  };
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const { appShell, response, urls, optionalUrls } = await getPrecacheResources();
    await cache.put(appShell, response.clone());
    await cache.put(`${appShell}index.html`, response);
    await cache.addAll(urls.filter((url) => url !== appShell && url !== `${appShell}index.html`));
    await Promise.allSettled(
      optionalUrls.map(async (url) => {
        try {
          await cache.add(url);
        } catch (error) {
          console.warn('Optional asset not cached (non-critical):', url, error);
        }
      }),
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_VERSION)
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);

      try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
      } catch (error) {
        console.warn('Navigation request served from cache after fetch failure:', request.url, error);
        return (await cache.match(request)) ?? (await cache.match(self.registration.scope));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_VERSION);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.warn('Asset request unavailable while offline:', request.url, error);
      return new Response('Content unavailable offline', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  })());
});
