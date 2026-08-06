const CACHE_NAME = "homecare-v3.2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./main.js",
    "./record.html",
    "./record.js",
    "./manifest.json"
];


// ===============================
// 설치
// ===============================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

    self.skipWaiting();

});


// ===============================
// 활성화
// ===============================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


// ===============================
// 파일 불러오기
// ===============================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
        .then(response => {

            return response || fetch(event.request);

        })

    );

});