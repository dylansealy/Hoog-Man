const staticCache = "staticCacheV1.0.1";
const dynamicCache = "dynamicCacheV1.0.1";
const cacheAssets = [
    "/Hoog-Man/dist/index.html",
    "/Hoog-Man/dist/assets/css/index.css",
    "/Hoog-Man/dist/assets/css/media.css",
    "/Hoog-Man/dist/assets/js/index.js",
    "/Hoog-Man/dist/assets/html/fallback.html",
    "/Hoog-Man/dist/assets/audio/background.webm",
    "/Hoog-Man/dist/assets/audio/death.webm",
    "/Hoog-Man/dist/assets/audio/frightened.webm",
    "/Hoog-Man/dist/assets/audio/gameCompleted.webm",
    "/Hoog-Man/dist/assets/audio/gameOver.webm",
    "/Hoog-Man/dist/assets/audio/pellet.webm"
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
        }).catch(() => caches.match("/Hoog-Man/dist/assets/html/fallback.html"))
    );
});
