/* Netra sites - Downloads section. One file for every Netra site and the Eco site.
   Real data only: the latest download button works without any lookup (GitHub's "latest" link); the list of the
   newest 5 releases (latest + 4 older) with size and SHA-256 comes live from the published releases of that app.
   Nothing is typed by hand, so a new release shows up here by itself. If the live list cannot be read, it says Unavailable.
   No repository page is linked from here. */
(function(){
"use strict";
var me=document.currentScript,repo=me&&me.getAttribute("data-repo"),name=me&&me.getAttribute("data-name")||"this app",mode=me&&me.getAttribute("data-mode")||"full";
if(!repo||!/^prayagi-store-and-services\/[A-Za-z0-9._-]+$/.test(repo))return;
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
/* Human Safety uses an exact, approved release only. Never fall through to latest or historic APK links. */
if(repo==="prayagi-store-and-services/netra-hub"){
 var hold=document.getElementById("netra-downloads");
 if(!hold){hold=mk("section");hold.id="netra-downloads";(document.querySelector("main")||document.body).appendChild(hold)}
 hold.textContent="";
 var title=mk("h2","","Netra Human Safety: Release checks in progress");hold.appendChild(title);
 var status=mk("p","sub","Download remains paused until the approved v1.5.2 release is available. v1.5.1 and older builds remain held history.");hold.appendChild(status);
 fetch("https://api.github.com/repos/"+repo+"/releases/tags/v1.5.2",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(x){
  if(x.tag_name!=="v1.5.2"||x.draft||x.prerelease||!x.published_at||isNaN(Date.parse(x.published_at)))throw 0;
  var a=(x.assets||[]).filter(function(y){return y.name==="app-release.apk"&&y.state==="uploaded"&&y.size===4439086&&y.digest==="sha256:0f07aa1681888893b4e27ad194783d0ab41afc0d05787de14cd0f189e85f4245"&&y.browser_download_url==="https://github.com/prayagi-store-and-services/netra-hub/releases/download/v1.5.2/app-release.apk"})[0];
  if(!a)throw 0;
  title.textContent="Netra Human Safety v1.5.2";
  status.textContent="App-local updater removed. Owner reported heating and battery behavior resolved on the tested build; this is not a measured battery/thermal guarantee. Older held builds are not offered.";
  var link=mk("a","btn","Download v1.5.2 APK");link.href=a.browser_download_url;hold.appendChild(link);
  hold.appendChild(mk("p","sub","SHA-256: "+a.digest.slice(7)));
 }).catch(function(){title.textContent="Netra Human Safety: Release status unavailable";status.textContent="Download stays paused. The approved v1.5.2 release could not be verified. v1.5.1 and older builds remain held history."});
 return;
}
var ALIAS="https://github.com/"+repo+"/releases/latest/download/app-release.apk";
var main=null,fab=null,box=null;
if(mode==="full"){
box=document.getElementById("netra-downloads");
if(!box){box=mk("section");box.id="netra-downloads";var m=document.querySelector("main")||document.body;m.insertBefore(box,m.children[1]||null)}
box.innerHTML="";
box.appendChild(mk("h2","","Download "+name+" (APK)"));
main=mk("a","btn","Download latest APK");main.href=ALIAS;box.appendChild(main);
var note=mk("p","sub","Android only. Allow installs from your browser once if Android asks. Check the SHA-256 below if you want to verify the file.");box.appendChild(note);
}
if(mode==="full"||mode==="fab"){
fab=mk("a","netra-fab");fab.href=ALIAS;fab.setAttribute("aria-label","Download "+name+" APK");fab.title="Download "+name+" APK";fab.textContent="\u2B07 APK";
fab.style.cssText="position:fixed;right:14px;bottom:76px;z-index:9999;background:#157347;color:#fff;font:700 14px system-ui,sans-serif;padding:12px 16px;border-radius:999px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.35)";(document.querySelector("main")||document.body).appendChild(fab);
}
/* Point every download button of THIS app at the newest release's own named APK (for example KBC-v1.1.5.apk), read live with no cache.
   If that cannot be read (for example GitHub rate limit), the buttons keep the always-latest link above, which still delivers the newest file under a generic name. */
function setApk(url){
 if(main)main.href=url;if(fab)fab.href=url;
 var all=document.querySelectorAll("a[href]");
 for(var i=0;i<all.length;i++){var h=all[i].getAttribute("href")||"";if(h===ALIAS)all[i].href=url}
}
fetch("https://api.github.com/repos/"+repo+"/releases/latest",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(x){
 var al=(x.assets||[]).filter(function(y){return /\.apk$/i.test(y.name)&&y.state!=="starter"});
 var a=al.filter(function(y){return y.name!=="app-release.apk"})[0];
 if(a&&/^https:\/\/github\.com\/prayagi-store-and-services\//.test(a.browser_download_url))setApk(a.browser_download_url)
}).catch(function(){});
if(mode!=="full")return;
var list=mk("div","");list.id="netra-dl-list";list.textContent="Loading versions...";box.appendChild(list);
function fmt(d){try{return new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})}catch(e){return "Unavailable"}}
function render(rel){
 list.innerHTML="";var shown=0;
 rel.filter(function(r){return !r.draft&&!r.prerelease}).slice(0,5).forEach(function(r,i){
  var al=(r.assets||[]).filter(function(a){return /\.apk$/i.test(a.name)});
  var a=al.filter(function(x){return x.name!=="app-release.apk"})[0]||al[0];if(!a)return;shown++;
  var row=mk("div","rv");row.style.minWidth="0";row.style.overflowWrap="anywhere";var t=mk("b","",r.tag_name+(i===0?" (latest)":""));row.appendChild(t);
  row.appendChild(mk("span","dv"," "+fmt(r.published_at)+" - "+(a.size/1048576).toFixed(1)+" MB"));
  var l=mk("a","","  Download");l.href=a.browser_download_url;row.appendChild(l);
  var sha=(a.digest||"").replace(/^sha256:/,"");row.appendChild(mk("div","dv","SHA-256: "+(/^[0-9a-f]{64}$/.test(sha)?sha:"Unavailable")));
  list.appendChild(row)});
 if(!shown)list.textContent="No release has been published yet.";
}
var key="netra-dl-"+repo,cached=null;
try{cached=JSON.parse(sessionStorage.getItem(key)||"null")}catch(e){}
if(cached&&Date.now()-cached.t<600000){render(cached.d)}else{
 fetch("https://api.github.com/repos/"+repo+"/releases?per_page=6").then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){try{sessionStorage.setItem(key,JSON.stringify({t:Date.now(),d:d}))}catch(e){}render(d)}).catch(function(){list.textContent="Version list Unavailable right now. The latest download button above still works."});
}
})();
