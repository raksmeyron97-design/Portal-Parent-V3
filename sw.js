const CACHE_NAME = 'krusmart-parent-portal-v3'; // ឡើង Version

// ១. ឯកសារដែលត្រូវរក្សាទុកជាមុន (Pre-cache) ពេល Install
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './pwa-install.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './firebase-config.js' // កុំភ្លេចបន្ថែមវា បើមិនអញ្ចឹង Index អត់ស្គាល់ Firebase ទេ
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 កំពុងរក្សាទុកឯកសារចូល Cache (App Shell)...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch(err => {
            console.error('❌ បរាជ័យក្នុងការ Cache ឯកសារ:', err);
        })
    );
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🧹 កំពុងលុប Cache ចាស់:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// ៣. Fetch Event ថ្មីដែលឆ្លាតវៃជាងមុន
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // [ចំណុចទី១] កុំប៉ះពាល់ការទាញទិន្នន័យពី Firebase Firestore/Auth 
    // ទុកឱ្យ Firebase SDK ជាអ្នកចាត់ចែង Offline Caching ដែលអ្នកទើបតែបានបើក
    if (requestUrl.hostname.includes('firestore.googleapis.com') ||
        requestUrl.hostname.includes('identitytoolkit.googleapis.com')) {
        return; 
    }

    // [ចំណុចទី២] សម្រាប់ CDN (Tailwind, Fonts, Icons, រូបភាពផ្សេងៗ)
    // ប្រើរូបមន្ត: Stale-While-Revalidate (បង្ហាញចាស់សិន ទាញថ្មីលាក់ក្រោយ)
    if (requestUrl.hostname.includes('cdn.tailwindcss.com') ||
        requestUrl.hostname.includes('fonts.googleapis.com') ||
        requestUrl.hostname.includes('fonts.gstatic.com') ||
        requestUrl.hostname.includes('unpkg.com') || // សម្រាប់ Lucide Icons និង QR Code
        requestUrl.hostname.includes('ptec.edu.kh') || // សម្រាប់រូប Background
        requestUrl.hostname.includes('api.dicebear.com')) { // សម្រាប់រូប Avatar
        
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Save the new response for next time
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
                }).catch(() => {
                    console.log('🌐 ប្រើប្រាស់ Cache សម្រាប់ CDN ដោយសារ Offline');
                });
                
                // Return cache immediately if exists, otherwise wait for network
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // [ចំណុចទី៣] សម្រាប់ឯកសារធម្មតា (HTML, JS, CSS ក្នុងម៉ាស៊ីន)
    // ប្រើរូបមន្ត: Cache First, falling back to Network
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).catch(() => {
                console.log('🌐 មិនមានការតភ្ជាប់អ៊ីនធឺណិតទេ (Offline)');
                // អាចបន្ថែមការបង្ហាញទំព័រ Offline HTML ក៏បានបើសិនជាវាជា Request ប្រភេទ Document
            });
        })
    );
});