const CACHE="hm-v5";
self.addEventListener("install",(e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    "./","./index.html","./app.js","./manifest.json",
    "./icons/icon-192.png","./icons/icon-512.png"
  ])));
});
self.addEventListener("activate",(e)=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch",(e)=>{
  const req=e.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;

  const accept=req.headers.get("accept")||"";
  if(accept.includes("text/html")){
    e.respondWith(
      fetch(req).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(req, copy));
        return r;
      }).catch(()=>caches.match(req))
    );
    return;
  }

  e.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
