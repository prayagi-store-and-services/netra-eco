/* Official links only. No social SDK, tracking pixel, automatic follow or rating. */
(function(){
'use strict';
var ROOT='https://prayagi-store-and-services.github.io/netra-eco/';
var SOCIAL=[['YouTube','Subscribe','https://www.youtube.com/@NetraEcosystem','▶'],['Instagram','Follow','https://www.instagram.com/netraecosystem/','◎'],['Facebook','Follow','https://www.facebook.com/netraecosystem','f'],['X','Follow','https://x.com/netraecosystem','𝕏'],['Telegram','Join channel','https://t.me/Netraecosystem','➤']];
function el(t,text){var n=document.createElement(t);if(text)n.textContent=text;return n}
function link(text,url){var a=el('a',text);a.href=url;a.rel='noopener noreferrer';return a}
function day(now){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
function socialRow(where){
 var row=el('nav');row.className='netra-logo-row';row.setAttribute('aria-label','Official social profiles '+where);
 SOCIAL.forEach(function(x){var key=x[0].toLowerCase(),a=link('',x[2]),img=el('img');img.src=ROOT+'assets/social/'+key+'.svg';img.alt='';img.width=28;img.height=28;a.className='netra-logo-button';a.dataset.platform=key;a.setAttribute('aria-label',x[0]);img.setAttribute('aria-hidden','true');a.appendChild(img);row.appendChild(a)});return row;
}
function badges(data){
 document.querySelectorAll('.netra-logo-badge').forEach(function(n){n.remove()});
 document.querySelectorAll('.netra-logo-button').forEach(function(a){var key=a.dataset.platform;a.setAttribute('aria-label',SOCIAL.find(function(x){return x[0].toLowerCase()===key})[0])});
 if(!navigator.onLine||!data||data.schemaVersion!==1||data.timezone!=='Asia/Kolkata'||data.date!==day(new Date())||!Number.isFinite(Date.parse(data.generatedAt))||day(new Date(data.generatedAt))!==data.date||Date.parse(data.generatedAt)>Date.now()+300000)return;
 document.querySelectorAll('.netra-logo-button').forEach(function(a){var n=data.counts&&data.counts[a.dataset.platform];if(!Number.isInteger(n)||n<=0||n>9999)return;var badge=el('span',n>99?'99+':String(n));badge.className='netra-logo-badge';badge.setAttribute('aria-hidden','true');a.appendChild(badge);a.setAttribute('aria-label',a.getAttribute('aria-label')+': '+n+' posts today')});
}
var currentFeed=null;
async function refresh(){currentFeed=null;badges(null);if(!navigator.onLine)return;try{var r=await fetch(ROOT+'data/social-posts.json',{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)return;var text=await r.text();if(text.length>32768)return;currentFeed=JSON.parse(text);badges(currentFeed)}catch(e){badges(null)}}
function mountSocial(){
 if(document.querySelector('.netra-logo-row'))return;
 var st=el('style');st.textContent='.netra-logo-row{display:flex;gap:40px;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;padding:8px 20px;max-width:100%;box-sizing:border-box;scrollbar-width:thin}.netra-logo-button{position:relative;display:grid;place-items:center;flex:0 0 58px;width:58px;height:58px;border-radius:50%;background:#fff;border:1px solid #ececf0;text-decoration:none}.netra-logo-button img{display:block;object-fit:contain}.netra-logo-button:focus-visible{outline:3px solid #198579;outline-offset:2px}.netra-logo-badge{position:absolute;right:0;top:0;min-width:19px;height:19px;padding:0 3px;display:grid;place-items:center;box-sizing:border-box;border:2px solid white;border-radius:12px;background:#b3261e;color:white;font:bold 11px Arial}';document.head.appendChild(st);
 var header=document.querySelector('header');if(header)header.after(socialRow('header'));else document.body.prepend(socialRow('header'));
 var footer=document.querySelector('footer');if(footer)footer.before(socialRow('footer'));else document.body.appendChild(socialRow('footer'));
 refresh();window.addEventListener('offline',function(){currentFeed=null;badges(null)});window.addEventListener('online',refresh);document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});setInterval(function(){badges(currentFeed)},60000);
}
function mount(){
 if(document.getElementById('netra-community'))return;
 var host=document.querySelector('main');if(!host)return;
 var s=el('section');s.id='netra-community';s.setAttribute('aria-label','Netra community and support');
 var st=el('style');st.textContent='#netra-community{margin:28px 0;padding:20px;border:1px solid var(--line,#31415d);border-radius:18px;background:var(--card,#111c2e);color:var(--text,#e8eefc);overflow-wrap:anywhere}#netra-community h2{font-size:1.5rem;margin:0 0 8px}#netra-community .netra-socials{position:static;min-height:0;padding:0;background:none;border:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}#netra-community a{color:var(--accent,#4fd1a5)}#netra-community .netra-socials a{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--line,#31415d);border-radius:12px;text-decoration:none;min-height:88px}#netra-community .netra-socials a:focus-visible{outline:3px solid var(--accent,#4fd1a5);outline-offset:3px}#netra-community .netra-social-icon{font-size:1.5rem;font-weight:700}#netra-community p{line-height:1.6}#netra-community iframe{width:100%;min-height:1120px;border:0}';document.head.appendChild(st);
 s.appendChild(el('h2','Reviews and feedback'));
 s.appendChild(el('p','Nothing is followed, liked or posted automatically.'));
 var config=window.NETRA_SITE||{},app=document.getElementById('app'),code=app&&app.getAttribute('data-code');
 var ids={bspn:'battery-sentinel',kbc:'kbc',hub:'netra-hub',privacy:'prayagi-privacy',trikaal:'netra-trikaal',player:'netra-player',eco:'netra-eco',charge:'netra-charge'};
 var id=config.appId||ids[code]||'netra-eco';
 var feedback=el('p');feedback.appendChild(link('Rate this app, read reviews or send feedback',ROOT+'embed.html?app='+encodeURIComponent(id)));s.appendChild(feedback);
 s.appendChild(el('p','Honest ratings are welcome, positive or critical. No reward, forced follow or five-star request. Reviews are community submissions, not verified purchases.'));
 s.appendChild(el('h2','Contact us privately'));
 s.appendChild(el('p','For a complaint or feedback you do not want to publish, use this private contact form. Only what you enter is sent after you agree.'));
 if(app){s.appendChild(link('Open private contact form',ROOT+'contact.html?app='+encodeURIComponent(id)));host.appendChild(s);return;}
 s.appendChild(link('Open private contact form in its own page',ROOT+'contact.html?app='+encodeURIComponent(id)));
 var f=el('iframe');f.title='Private Netra contact form';f.loading='lazy';f.src=ROOT+'contact.html?app='+encodeURIComponent(id);s.appendChild(f);
 host.appendChild(s);
}
function start(){mountSocial();mount()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
