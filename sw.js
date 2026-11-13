// Carmen Prépa tech 2027 — fonctionnement hors ligne
// Pages : réseau d'abord (pour toujours avoir la dernière version), copie locale si pas de connexion.
// Polices : copie locale d'abord. Les données passent par l'appli (copie dans le navigateur).
const CACHE = "carmen-v1";
const PAGES = ["./", "./index.html", "./icon.png", "./lecture/", "./lecture/index.html"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(PAGES.map(p => c.add(p).catch(() => {})))));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    e.respondWith(
      fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
        .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match(u.pathname.includes("/lecture") ? "./lecture/index.html" : "./index.html")))
    );
    return;
  }
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.host)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
  }
});
