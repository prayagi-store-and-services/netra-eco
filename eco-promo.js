/* Netra family sites - "Get the Netra Eco app" block.
   One shared file, hosted on the Netra Eco site and loaded by every Netra site, so the block and the version always match.
   The version, size and date are read live from the latest GitHub release of netra-eco-app (no cache). If that cannot be read, the page says Unavailable; the download button still works because it always points to the newest release asset. */
(function(){
"use strict";
var REPO="prayagi-store-and-services/netra-eco-app";
var APK="https://github.com/"+REPO+"/releases/latest/download/app-release.apk";
var PAGE="https://github.com/"+REPO+"/releases/latest";
var foot=document.querySelector("footer");if(!foot||document.getElementById("eco-app-promo"))return;
function mk(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e}
var sec=mk("section","background:var(--card,#121c30);border:1px solid var(--accent,#F59E0B);border-radius:16px;padding:18px;margin:16px auto;max-width:860px;color:var(--text,#e8eefc)");sec.id="eco-app-promo";
sec.appendChild(mk("h2","margin:0 0 6px;font-size:1.15rem","Get the Netra Eco app"));
sec.appendChild(mk("p","margin:0 0 8px;font-size:.95rem","You do not need to visit the website. Install the Netra Eco app and open, download and update every Netra app directly from your phone."));
var info=mk("p","margin:0 0 10px;color:var(--mute,#9db0d0);font-size:.88rem","Checking the newest version...");sec.appendChild(info);
var a=mk("a","display:inline-block;background:var(--accent,#F59E0B);color:#111;font-weight:700;text-decoration:none;border-radius:12px;padding:10px 18px","Download Netra Eco APK");a.href=APK;a.rel="noopener";sec.appendChild(a);
var b=mk("a","display:inline-block;margin-left:12px;color:var(--accent,#F59E0B);font-size:.9rem","Release page");b.href=PAGE;b.rel="noopener";sec.appendChild(b);
sec.appendChild(mk("p","margin:10px 0 0;color:var(--mute,#9db0d0);font-size:.8rem","After installing, the app tells you when any Netra app has a new version. Android asks you once to allow installs from this source."));
foot.parentNode.insertBefore(sec,foot);
function size(n){return n>=1048576?(n/1048576).toFixed(1)+" MB":Math.round(n/1024)+" KB"}
fetch("https://api.github.com/repos/"+REPO+"/releases/latest?t="+Date.now(),{cache:"no-store",headers:{Accept:"application/vnd.github+json"}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
 var asset=null;(j.assets||[]).forEach(function(x){if(x.name==="app-release.apk")asset=x});
 var when="";try{when=new Date(j.published_at).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}catch(_){}
 info.textContent="Newest version: "+(j.tag_name||"Unavailable")+(asset?" - "+size(asset.size):"")+(when?" - released "+when:"")}).catch(function(){
 info.textContent="Newest version: Unavailable right now. The button above still downloads the latest app."});
})();
