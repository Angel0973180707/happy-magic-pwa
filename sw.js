self.addEventListener("install",e=>{
 e.waitUntil(caches.open("hm3").then(c=>c.addAll(["./","./index.html","./styles.css","./app.js"])));
});