/* Netra sites - Downloads section. One file for every Netra site and the Eco site.
   Real data only: the latest download button works without any lookup (GitHub's "latest" link); the list of the
   newest 5 releases (latest + 4 older) with size and SHA-256 comes live from the published releases of that app.
   Nothing is typed by hand, so a new release shows up here by itself. If the live list cannot be read, it says Unavailable.
   No repository page is linked from here. */
(function(){
"use strict";
var me=document.currentScript,repo=me&&me.getAttribute("data-repo"),name=me&&me.getAttribute("data-name")||"this app";
if(!repo||!/^prayagi-store-and-services\/[A-Za-z0-9._-]+$/.test(repo))return;
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var box=document.getElementById("netra-downloads");
if(!box){box=mk("section");box.id="netra-downloads";var m=document.querySelector("main")||document.body;m.insertBefore(box,m.children[1]||null)}
box.innerHTML="";
box.appendChild(mk("h2","","Download "+name+" (APK)"));
var main=mk("a","btn","Download latest APK");main.href="https://github.com/"+repo+"/releases/latest/download/app-release.apk";box.appendChild(main);
var note=mk("p","sub","Android only. Allow installs from your browser once if Android asks. Check the SHA-256 below if you want to verify the file.");box.appendChild(note);
var list=mk("div","");list.id="netra-dl-list";list.textContent="Loading versions...";box.appendChild(list);
function fmt(d){try{return new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})}catch(e){return "Unavailable"}}
function render(rel){
 list.innerHTML="";var shown=0;
 rel.filter(function(r){return !r.draft&&!r.prerelease}).slice(0,5).forEach(function(r,i){
  var al=(r.assets||[]).filter(function(a){return /\.apk$/i.test(a.name)});
  var a=al.filter(function(x){return x.name!=="app-release.apk"})[0]||al[0];if(!a)return;shown++;
  var row=mk("div","rv");var t=mk("b","",r.tag_name+(i===0?" (latest)":""));row.appendChild(t);
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
