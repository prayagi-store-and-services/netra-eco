/* Official links only. No social SDK, tracking pixel, automatic follow or rating. */
(function(){
'use strict';
var ROOT='https://prayagi-store-and-services.github.io/netra-eco/';
var SOCIAL=[['YouTube','Subscribe','https://www.youtube.com/@NetraEcosystem','▶'],['Instagram','Follow','https://www.instagram.com/netraecosystem/','◎'],['Facebook','Follow','https://www.facebook.com/netraecosystem','f'],['X','Follow','https://x.com/netraecosystem','𝕏'],['Telegram','Join channel','https://t.me/Netraecosystem','➤']];
function el(t,text){var n=document.createElement(t);if(text)n.textContent=text;return n}
function link(text,url){var a=el('a',text);a.href=url;a.rel='noopener noreferrer';return a}
function mount(){
 if(document.getElementById('netra-community'))return;
 var host=document.querySelector('main');if(!host)return;
 var s=el('section');s.id='netra-community';s.setAttribute('aria-label','Netra community and support');
 var st=el('style');st.textContent='#netra-community{margin:28px 0;padding:20px;border:1px solid var(--line,#31415d);border-radius:18px;background:var(--card,#111c2e);color:var(--text,#e8eefc);overflow-wrap:anywhere}#netra-community h2{font-size:1.5rem;margin:0 0 8px}#netra-community .netra-socials{position:static;min-height:0;padding:0;background:none;border:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}#netra-community a{color:var(--accent,#4fd1a5)}#netra-community .netra-socials a{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--line,#31415d);border-radius:12px;text-decoration:none;min-height:88px}#netra-community .netra-socials a:focus-visible{outline:3px solid var(--accent,#4fd1a5);outline-offset:3px}#netra-community .netra-social-icon{font-size:1.5rem;font-weight:700}#netra-community p{line-height:1.6}#netra-community iframe{width:100%;min-height:1120px;border:0}';document.head.appendChild(st);
 s.appendChild(el('h2','Connect with Netra Ecosystem'));
 s.appendChild(el('p','Choose a platform to follow, subscribe or join. These links open our official profiles. Nothing is followed, liked or posted automatically.'));
 var grid=el('div');grid.className='netra-socials';grid.setAttribute('role','navigation');grid.setAttribute('aria-label','Official social profiles');
 SOCIAL.forEach(function(x){var a=link('',x[2]),icon=el('span',x[3]);icon.className='netra-social-icon';icon.setAttribute('aria-hidden','true');a.append(icon,el('strong',x[0]),el('span',x[1]));a.setAttribute('aria-label',x[1]+' on '+x[0]);grid.appendChild(a)});s.appendChild(grid);
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
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
