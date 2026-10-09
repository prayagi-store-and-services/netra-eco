/* Netra family sites - upcoming-updates strip. Data: roadmap.json + projects.json on the Netra Eco site (same source as the Eco app).
   Hidden when done: status starts with "Released", or every app in an item's "ships" list already has a published release at or above that version.
   All dates are estimates (IST). Anything missing shows "Unavailable". */
(function(){
"use strict";
var BASE="https://prayagi-store-and-services.github.io/netra-eco/";
function mk(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e}
function pad(n){return n<10?"0"+n:""+n}
function parts(s){var p=String(s||"").trim().replace(/^v/,"").split(".").map(function(x){return /^\d+$/.test(x)?+x:NaN});return p.length&&p.every(function(x){return !isNaN(x)})?p:null}
function atLeast(have,want){var h=parts(have),w=parts(want);if(!h||!w)return null;for(var i=0;i<Math.max(h.length,w.length);i++){var a=h[i]||0,b=w[i]||0;if(a!==b)return a>b}return true}
function rid(app){return app==="bspn"?"battery-sentinel":(app==="eco"?"netra-eco":app)}
function countdown(ms){if(ms<=0)return "Estimate passed, still being finished";var m=Math.floor(ms/60000),h=Math.floor(m/60);
 if(h>72){var d=Math.floor(h/24);return d+"d "+pad(h%24)+"h"}return h+"h "+pad(m%60)+"m"}
function fmt(ms){try{return new Date(ms).toLocaleString("en-IN",{timeZone:"Asia/Kolkata",day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true})+" IST"}catch(e){return "Unavailable"}}
function getJSON(u){return fetch(u,{cache:"no-cache"}).then(function(r){if(!r.ok)throw 0;return r.json()})}
function latestFor(repo){var k="nrm:"+repo,c;try{c=JSON.parse(sessionStorage.getItem(k)||"null")}catch(e){}
 if(c&&Date.now()-c.t<600000)return Promise.resolve(c.v);
 return getJSON("https://api.github.com/repos/"+repo+"/releases/latest").then(function(j){var v=String(j.tag_name||"").replace(/^v/,"");try{sessionStorage.setItem(k,JSON.stringify({t:Date.now(),v:v}))}catch(e){}return v}).catch(function(){return null})}
function run(rm,pj){
 var names={};(rm.apps||[]).forEach(function(a){names[a.id]=a.name});
 var repos={};(pj.projects||[]).forEach(function(p){if(p.repo)repos[p.id]=p.repo});
 if(!repos["netra-eco"])repos["netra-eco"]="prayagi-store-and-services/netra-eco-app";var ids=Object.keys(repos);
 return Promise.all(ids.map(function(id){return latestFor(repos[id])})).then(function(vs){
  var latest={};ids.forEach(function(id,i){if(vs[i])latest[id]=vs[i]});
  var items=(rm.items||[]).filter(function(it){
   if(!it.title)return false;if(/^released/i.test(it.status||""))return false;
   var sh=it.ships||[];if(!sh.length)return true;
   return !sh.every(function(s){var h=latest[rid(s.app)];return h&&atLeast(h,s.version)===true})}).map(function(it){
   var t=Date.parse(it.eta);var v=(it.ships||[]).map(function(s){return s.version}).filter(Boolean);
   return {title:it.title,eta:isNaN(t)?null:t,app:(it.apps||[]).map(function(a){return names[a]||a}).join(", ")||"Unavailable",ver:v.length?v.join(" / "):"Unavailable",status:it.status||"Unavailable"}});
  items.sort(function(a,b){return (a.eta==null)-(b.eta==null)||(a.eta-b.eta)});
  if(!items.length)return;
  var nxt=items.filter(function(i){return i.eta!=null&&i.eta>Date.now()})[0]||items[0];
  var bar=mk("button","display:block;width:100%;background:#0b1220;color:#e8eefc;border:0;border-bottom:3px solid #F59E0B;padding:10px 14px;font:600 .9rem system-ui,sans-serif;text-align:center;cursor:pointer;min-height:44px");
  bar.id="roadmap-ticker";bar.type="button";bar.setAttribute("aria-label","Open the list of upcoming updates");
  function tick(){bar.textContent="Next update: "+nxt.app+" - "+nxt.title+" - "+(nxt.eta==null?"Unavailable":countdown(nxt.eta-Date.now())+" (est.)")+"  \u25B8 all "+items.length+" upcoming"}
  tick();setInterval(tick,30000);
  document.body.insertBefore(bar,document.body.firstChild);
  function open(){
   var ov=mk("div","position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:12px");ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");
   var box=mk("div","background:#fff;color:#111;max-width:640px;width:100%;max-height:85vh;overflow:auto;border-radius:14px;padding:16px;font-family:system-ui,sans-serif");
   var hd=mk("div","display:flex;justify-content:space-between;align-items:center;margin-bottom:8px");hd.appendChild(mk("b","font-size:1.05rem","Upcoming updates ("+items.length+")"));
   var x=mk("button","min-height:44px;min-width:44px;font-size:1.1rem;border:1px solid #ccc;border-radius:10px;background:#f4f4f4;cursor:pointer","Close");x.type="button";x.onclick=function(){document.body.removeChild(ov)};hd.appendChild(x);box.appendChild(hd);
   box.appendChild(mk("div","font-size:.8rem;color:#555;margin-bottom:8px","All dates are our own estimates (IST) and can change. Reviewed "+(rm.reviewed||"Unavailable")+"."));
   items.forEach(function(i){var c=mk("div","border-top:1px solid #e3e3e3;padding:8px 0;font-size:.88rem;line-height:1.45");
    c.appendChild(mk("div","font-weight:700",i.title));c.appendChild(mk("div","color:#444","App: "+i.app+" | Version: "+i.ver+" | Status: "+i.status));
    c.appendChild(mk("div","color:#444","ETA: "+(i.eta==null?"Unavailable":fmt(i.eta))+" | Countdown: "+(i.eta==null?"Unavailable":countdown(i.eta-Date.now()))));box.appendChild(c)});
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)document.body.removeChild(ov)};document.addEventListener("keydown",function k(e){if(e.key==="Escape"){document.removeEventListener("keydown",k);if(ov.parentNode)document.body.removeChild(ov)}});
   document.body.appendChild(ov);x.focus()}
  bar.onclick=open;
 })}
Promise.all([getJSON(BASE+"roadmap.json"),getJSON(BASE+"projects.json")]).then(function(a){return run(a[0],a[1])}).catch(function(){});
})();
