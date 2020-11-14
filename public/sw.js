const staticCache = "staticCacheV1.0";
const dynamicCache = "dynamicCacheV1.0";
const cacheAssets = [
"/",
"/assets/css/index.css",
"/assets/css/media.css",
"/assets/js/index.js",
];

const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if (keys.length > size) {
				cache.delete(keys[0]).then(limitCacheSize(name, size));
			}
		});
	});
}

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(staticCache).then(cache => {
			cache.addAll(cacheAssets);
		})
	);
}); 

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCache && key !== dynamicCache).map(key => caches.delete(key))
			)
		})
	);
});

self.addEventListener("message", event => {if (event.data && event.data.type === "SKIP_WAITING") {self.skipWaiting();}});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request.url).then(cacheResponse => {
			return cacheResponse || fetch(event.request).then(fetchResponse => {
				return caches.open(dynamicCache).then(cache => {
					cache.put(event.request.url, fetchResponse.clone());
					limitCacheSize(dynamicCache, 20);
					return fetchResponse;
				});
			});
		}).catch(() => caches.match("/assets/html/fallback.html"))
	);
});