const staticCache = "staticCacheV1.0";
const dynamicCache = "dynamicCacheV1.0";
const cacheAssets = [
    "/PO-2D-games-maken/dist/index.html",
    "/PO-2D-games-maken/dist/assets/css/index.css",
    "/PO-2D-games-maken/dist/assets/css/media.css",
    "/PO-2D-games-maken/dist/assets/js/index.js",
    "/PO-2D-games-maken/dist/assets/html/fallback.html"
];
const limitCacheSize = async (name, size) => {
    try {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        if (keys.length > size) {
            await cache.delete(keys[0]);
            limitCacheSize(name, size);
        }
    } catch (error) {console.log(error);}
};
self.addEventListener("install", event => {
    const initialCacheAssets = async () => {
        try {
            const cache = await caches.open(staticCache);
            await cache.addAll(cacheAssets);
        } catch (error) {console.log(error);}
    };
    event.waitUntil(initialCacheAssets());
});

self.addEventListener("activate", event => {
    const cacheVersionCheck = async () => {
        try {
            const keys = await caches.keys();
            const deletions = keys
                .filter(key => key !== staticCache && key !== dynamicCache)
                .map(key => caches.delete(key));
            for (const success of deletions) {await success;}
        } catch (error) {console.log(error);}
    };
    event.waitUntil(cacheVersionCheck());
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
        }).catch(() => caches.match("/PO-2D-games-maken/dist/assets/html/fallback.html"))
    );
});
