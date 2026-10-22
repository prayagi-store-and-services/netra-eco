/* Netra family sites - "Get the Netra Ecosystem app" block.
   One shared file, hosted on the Netra Ecosystem site and loaded by every Netra site, so the block and the version always match.
   The version, size and date are read live from the latest GitHub release of netra-eco-app (no cache). If that cannot be read, the page says Unavailable; the download button still works because it always points to the newest release asset. */
(function(){
"use strict";
var REPO="prayagi-store-and-services/netra-eco-app";
var APK="https://github.com/"+REPO+"/releases/latest/download/app-release.apk";
var foot=document.querySelector("footer");if(!foot||document.getElementById("eco-app-promo"))return;
function mk(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e}
var sec=mk("section","background:var(--card,#121c30);border:1px solid var(--accent,#F59E0B);border-radius:16px;padding:18px;margin:16px auto;max-width:860px;color:var(--text,#e8eefc)");sec.id="eco-app-promo";sec.setAttribute("aria-label","Get the Netra Ecosystem app");
sec.appendChild(mk("h2","margin:0 0 6px;font-size:1.15rem","Get the Netra Ecosystem app"));
sec.appendChild(mk("p","margin:0 0 8px;font-size:.95rem","You do not need to visit the website. Install the Netra Ecosystem app and open, download and update every Netra app directly from your phone."));
var info=mk("p","margin:0 0 10px;color:var(--mute,#9db0d0);font-size:.88rem","Checking the newest version...");sec.appendChild(info);
var a=mk("a","display:inline-block;background:var(--accent,#F59E0B);color:#111;font-weight:700;text-decoration:none;border-radius:12px;padding:10px 18px","Download Netra Ecosystem APK");a.href=APK;a.rel="noopener";sec.appendChild(a);
sec.appendChild(mk("p","margin:10px 0 0;color:var(--mute,#9db0d0);font-size:.8rem","After installing, the app tells you when any Netra app has a new version. Android asks you once to allow installs from this source."));
foot.parentNode.insertBefore(sec,foot);
function size(n){return n>=1048576?(n/1048576).toFixed(1)+" MB":Math.round(n/1024)+" KB"}
fetch("https://api.github.com/repos/"+REPO+"/releases/latest?t="+Date.now(),{cache:"no-store",headers:{Accept:"application/vnd.github+json"}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
 var asset=null;(j.assets||[]).forEach(function(x){if(x.name==="app-release.apk")asset=x});
 var named=null;(j.assets||[]).forEach(function(x){if(/\.apk$/i.test(x.name)&&x.name!=="app-release.apk"&&!named)named=x});if(named&&/^https:\/\/github\.com\/prayagi-store-and-services\//.test(named.browser_download_url))a.href=named.browser_download_url;
 var when="";try{when=new Date(j.published_at).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}catch(_){}
 info.textContent="Newest version: "+(j.tag_name||"Unavailable")+(asset?" - "+size(asset.size):"")+(when?" - released "+when:"")}).catch(function(){
 info.textContent="Newest version: Unavailable right now. The button above still downloads the latest app."});
})();

/* Shared active Netra-site scroll contract: only the identity header and compact footer stay in view.
   Preserve every original footer note/link in normal-flow content. No new tracking or network calls. */
(function(){
"use strict";
var active=["/netra-eco/","/-Battery-Sentinel-Pro-Netra/","/KBC/","/netra-hub/","/prayagi-Privacy-/"];
if(active.indexOf(location.pathname)<0||document.getElementById("netra-scroll-contract"))return;
var foot=document.querySelector("footer"),head=document.querySelector("body > .top")||document.querySelector("body > nav");
if(!foot||!head)return;
// Section menus belong to the scrollable store, not to the fixed identity header.
var menu=head.querySelector("nav");
if(menu){head.parentNode.insertBefore(menu,head.nextSibling);menu.setAttribute("data-netra-store-menu","");Array.from(head.children).filter(function(e){return e.tagName==="A"}).forEach(function(a){menu.appendChild(a)})}
if(head.tagName==="NAV"){
 var links=Array.from(head.querySelectorAll(".wrap>a"));
 if(links.length){var storeLinks=document.createElement("div");storeLinks.style.cssText="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;padding:12px 16px";head.parentNode.insertBefore(storeLinks,head.nextSibling);links.forEach(function(a){storeLinks.appendChild(a)})}
}
Array.from(document.querySelectorAll("a")).forEach(function(a){if(a.textContent.indexOf("Netra Eco")>=0)a.textContent=a.textContent.replace(/Netra Eco(?!system)/g,"Netra Ecosystem")});
if(foot.id){var originalAnchor=document.createElement("span");originalAnchor.id=foot.id;foot.removeAttribute("id");foot.parentNode.insertBefore(originalAnchor,foot)}
var style=document.createElement("style");style.id="netra-scroll-contract";
style.textContent="html{scroll-padding-top:0;scroll-padding-bottom:calc(var(--netra-foot-height,48px) + 12px)}body{padding-bottom:calc(var(--netra-foot-height,48px) + 16px)!important}body>nav>.wrap{height:auto!important;min-height:56px;flex-wrap:wrap;gap:8px;padding:8px 12px}body>nav>.wrap b{min-width:0;flex:1;overflow-wrap:normal}nav[data-netra-store-menu]{position:static!important;display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px}nav[data-netra-store-menu] a{margin:0!important}.top>*{min-width:0}body>.top{position:sticky!important;top:0!important;z-index:20!important}.top~nav{position:static!important;top:auto!important}body>footer{position:fixed!important;left:0;right:0;bottom:0;z-index:20;padding:10px 14px calc(10px + env(safe-area-inset-bottom))!important;text-align:center;font:500 12px/1.4 system-ui,sans-serif;background:var(--card,#121c30);border-top:1px solid var(--line,#22314f)}body>footer a{display:inline-block;margin:0 6px}#netra-footer-notes{max-width:1100px;margin:16px auto;padding:18px 16px;color:var(--mute,#9db0d0);font-size:13px;overflow-wrap:anywhere}#netra-footer-notes .wrap{padding:0}[id]{scroll-margin-top:calc(var(--netra-head-height,64px) + 12px)}#eco-fab,.netra-fab{position:static!important;inset:auto!important;display:table!important;margin:16px auto!important;z-index:auto!important}";
document.head.appendChild(style);
var notes=document.createElement("section");notes.id="netra-footer-notes";notes.setAttribute("aria-label","Site information");
var title=document.createElement("h2");title.textContent="Site information";title.style.fontSize="1rem";notes.appendChild(title);
while(foot.firstChild)notes.appendChild(foot.firstChild);
foot.parentNode.insertBefore(notes,foot);
var home=document.createElement("a");home.href="https://prayagi-store-and-services.github.io/netra-eco/";home.textContent="Netra Ecosystem";foot.appendChild(home);
var details=document.createElement("a");details.href="#netra-footer-notes";details.textContent="Site information";foot.appendChild(details);
function measure(){var r=document.documentElement.style;r.setProperty("--netra-head-height",Math.ceil(head.getBoundingClientRect().height)+"px");r.setProperty("--netra-foot-height",Math.ceil(foot.getBoundingClientRect().height)+"px")}
measure();if(window.ResizeObserver){var observer=new ResizeObserver(measure);observer.observe(head);observer.observe(foot)}
window.addEventListener("resize",measure,{passive:true});
})();
