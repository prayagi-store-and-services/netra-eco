/* Netra family sites - "Roadmap / Coming soon".
   Shown on the websites and inside the Netra Eco app. The single source is roadmap.json on the Netra Eco site. Every date below is OUR OWN ESTIMATE, not a promise, and is labelled that way on the page.
   Edit roadmap.json (not this file): mark an item status "Released" when it ships and change an ETA the moment the estimate changes.
   apps: bspn, kbc, netra-hub, prayagi-privacy. The mother site (Netra Eco) shows one dedicated section per app. */
(function(){
"use strict";
function run(DATA){
var s=window.NETRA_SITE||{};
var cur=window.NETRA_ROADMAP_APP||s.appId||"eco";
var foot=document.querySelector("footer");if(!foot)return;
var REVIEWED=DATA.reviewed,APPS=DATA.apps,ITEMS=DATA.items;
var cds=[];
function mk(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e}
function nameOf(id){for(var i=0;i<APPS.length;i++)if(APPS[i].id===id)return APPS[i].name;return id}
function entry(it,appName){
 var d=mk("div","border-top:1px solid var(--line,#22314f);padding:10px 0");
 var tg=mk("div","display:inline-block;font-size:.78rem;font-weight:700;border:1px solid var(--accent,#F59E0B);color:var(--accent,#F59E0B);border-radius:999px;padding:1px 10px;margin-bottom:4px","Coming to: "+appName);d.appendChild(tg);
 var t=mk("div","",null);t.appendChild(mk("b","",it.title));t.appendChild(mk("span","color:var(--accent,#F59E0B);font-size:.85rem"," - "+it.status));d.appendChild(t);
 d.appendChild(mk("div","margin:4px 0;font-size:.92rem",it.text));
 var when;if(!it.eta){when="no date yet"}else{try{when=new Date(it.eta).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}catch(_){when=it.eta}}
 d.appendChild(mk("div","font-size:.85rem;color:var(--mute,#9db0d0)",(/^released/i.test(it.status)?"Released":(it.eta?"Estimated release: "+when+" (our estimate, can change)":"Estimated release: no date yet (idea, no promise)"))));
 var c=mk("div","font-variant-numeric:tabular-nums;font-weight:700;margin-top:2px");d.appendChild(c);if(/^released/i.test(it.status)){c.textContent="Released"}else if(it.eta){cds.push([c,Date.parse(it.eta)])}else{c.textContent="No date yet"}
 return d;
}
var sec=mk("section","background:var(--card,#121c30);border:1px solid var(--line,#22314f);border-radius:16px;padding:18px;margin:16px auto;max-width:860px;color:var(--text,#e8eefc)");sec.id="roadmap";
sec.appendChild(mk("h2","margin:0 0 4px;font-size:1.15rem","Roadmap / Coming soon"));
sec.appendChild(mk("p","margin:0 0 10px;color:var(--mute,#9db0d0);font-size:.85rem","What each app is getting next. Release dates are our own estimates, not promises, and can move. Reviewed "+REVIEWED+"."));
function te(x){return x.eta?Date.parse(x.eta):Infinity}
function byEta(a,b){var x=te(a),y=te(b);return x===y?0:(x<y?-1:1)}
if(cur==="eco"){
 APPS.forEach(function(a){
  var mine=ITEMS.filter(function(i){return i.apps.indexOf(a.id)>=0}).sort(byEta);
  var box=mk("div","margin-top:14px");box.appendChild(mk("h3","margin:0 0 2px;font-size:1.05rem",a.name));
  if(!mine.length)box.appendChild(mk("div","color:var(--mute,#9db0d0);font-size:.9rem","Nothing announced yet."));
  mine.forEach(function(i){box.appendChild(entry(i,a.name))});
  sec.appendChild(box);
 });
}else{
 var mine=ITEMS.filter(function(i){return i.apps.indexOf(cur)>=0}).sort(byEta);
 if(!mine.length)return;
 mine.forEach(function(i){sec.appendChild(entry(i,nameOf(cur)))});
}
foot.parentNode.insertBefore(sec,foot);
function pad(n){return n<10?"0"+n:""+n}
function tick(){var now=Date.now();
 cds.forEach(function(a){var ms=a[1]-now;
  if(ms<=0){a[0].textContent="Estimate passed - still being finished. We will post a new estimate.";return}
  var sc=Math.floor(ms/1000);a[0].textContent="Estimated in "+Math.floor(sc/86400)+"d "+pad(Math.floor(sc%86400/3600))+"h "+pad(Math.floor(sc%3600/60))+"m "+pad(sc%60)+"s";
 });
}
tick();setInterval(tick,1000);

}
fetch("https://prayagi-store-and-services.github.io/netra-eco/roadmap.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(run).catch(function(){});
})();
