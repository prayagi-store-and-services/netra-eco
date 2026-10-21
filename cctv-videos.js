/* CCTV recording section. Data: team-videos.json. YouTube plays only after a click (privacy-friendly nocookie embed); Instagram reels are links. */
(function(){
"use strict";
var box=document.getElementById("cctv-grid");if(!box)return;
function mk(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e}
function ok(id){return /^[A-Za-z0-9_-]{6,20}$/.test(String(id||""))}
function card(v){
 var f=mk("figure","margin:0;background:var(--card2,#211b40);border:1px solid var(--line,#3b3366);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:8px");
 var area=mk("div","aspect-ratio:9/16;max-height:420px;display:flex;align-items:center;justify-content:center;background:#000;border-radius:8px;overflow:hidden");
 if(v.source==="youtube"){
  var b=mk("button","padding:12px 18px;border-radius:999px;border:0;background:#2ecc71;color:#06210f;font-weight:700;cursor:pointer","\u25B6 Play here");
  b.type="button";b.setAttribute("aria-label","Play: "+v.title);
  b.onclick=function(){var i=document.createElement("iframe");i.src="https://www.youtube-nocookie.com/embed/"+v.id+"?autoplay=1&rel=0";i.title=v.title;i.allow="autoplay; encrypted-media; picture-in-picture";i.setAttribute("allowfullscreen","");i.referrerPolicy="strict-origin-when-cross-origin";i.style.cssText="width:100%;height:100%;border:0";area.textContent="";area.appendChild(i)};
  area.appendChild(b);
 }else{
  area.appendChild(mk("div","padding:12px;text-align:center;color:#ddd;font-size:14px","Instagram reel"));
 }
 f.appendChild(area);
 var cap=mk("figcaption","font-size:14px;line-height:1.4");cap.appendChild(mk("div","font-weight:600",v.title));
 cap.appendChild(mk("div","opacity:.75;font-size:12px;margin-top:2px",v.date+(v.ai?" \u00B7 AI-generated, fictional characters":"")));
 var a=mk("a","display:inline-block;margin-top:6px;font-size:13px",v.source==="youtube"?"Open on YouTube":"Open on Instagram");
 a.href=(v.url&&/^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/$/.test(v.url))?v.url:v.source==="youtube"?"https://www.youtube.com/shorts/"+v.id:"https://www.instagram.com/netraecosystem/reel/"+v.id+"/";
 a.target="_blank";a.rel="noopener noreferrer";cap.appendChild(a);f.appendChild(cap);return f}
fetch("team-videos.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
 var list=(j.videos||[]).filter(function(v){return v&&ok(v.id)&&v.title&&(v.source==="youtube"||v.source==="instagram")});
 list.sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
 if(!list.length)throw 0;box.textContent="";list.forEach(function(v){box.appendChild(card(v))})
}).catch(function(){box.textContent="Unavailable right now.";});
})();
