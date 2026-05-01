const CACHE = 'alrpg-checkin-v1';
const BASE  = '/Sovereign-DailyCheckIn';
const SHELL = [BASE+'/', BASE+'/index.html', BASE+'/manifest.json', BASE+'/icon-192.png', BASE+'/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('google') || url.hostname.includes('gstatic') || url.hostname.includes('firebase')) return;
  e.respondWith(caches.match(e.request).then(cached => { const net = fetch(e.request).then(r => { if(r.ok && e.request.method==='GET') caches.open(CACHE).then(c=>c.put(e.request,r.clone())); return r; }).catch(()=>cached); return cached||net; }));
});
