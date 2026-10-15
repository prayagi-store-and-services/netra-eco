const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('eco-promo.js','utf8').split('/* Shared active Netra-site scroll contract:')[1];
assert(source,'shared contract exists');
const script='/* Shared active Netra-site scroll contract:'+source;
class E{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.attrs={};this.style={setProperty(k,v){this[k]=v}};this._text='';this.id=''}
 get firstChild(){return this.children[0]||null} get nextSibling(){const a=this.parentNode?.children||[];return a[a.indexOf(this)+1]||null}
 appendChild(e){if(e.parentNode)e.parentNode.removeChild(e);this.children.push(e);e.parentNode=this;return e}
 removeChild(e){this.children.splice(this.children.indexOf(e),1);e.parentNode=null}
 insertBefore(e,b){if(!b)return this.appendChild(e);if(e.parentNode)e.parentNode.removeChild(e);const i=this.children.indexOf(b);assert(i>=0);this.children.splice(i,0,e);e.parentNode=this;return e}
 setAttribute(k,v){this.attrs[k]=v} removeAttribute(k){if(k==='id')this.id='';else delete this.attrs[k]}
 set textContent(v){this._text=v;this.children=[]} get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 getBoundingClientRect(){return{height:this.tagName==='FOOTER'?38:64}}
 descendants(){return this.children.flatMap(x=>[x,...x.descendants()])}
 querySelector(s){return this.querySelectorAll(s)[0]||null}
 querySelectorAll(s){const a=this.descendants();if(s==='a')return a.filter(x=>x.tagName==='A');if(s==='nav')return a.filter(x=>x.tagName==='NAV');if(s==='.wrap>a')return a.filter(x=>x.tagName==='A'&&x.parentNode.attrs.class==='wrap');return[]}
}
function fixture(path,native){
 const body=new E('body'),head=new E(native?'nav':'div'),foot=new E('footer'),html=new E('html'),dochead=new E('head');
 const wrap=new E('div');wrap.attrs.class='wrap';if(native)head.appendChild(wrap);
 const menu=new E('nav');if(!native)head.appendChild(menu);
 const oldLink=new E('a');oldLink.textContent='Netra Eco (mother website)';(native?wrap:head).appendChild(oldLink);
 const note=new E('p');note.textContent='Original privacy note with ratings and counter';foot.appendChild(note);foot.id='about';body.appendChild(head);body.appendChild(foot);
 const doc={body,head:dochead,documentElement:html,createElement:t=>new E(t),getElementById:id=>[body,dochead,...body.descendants(),...dochead.descendants()].find(e=>e.id===id)||null,querySelector:s=>s==='footer'?foot:s==='body > .top'?(native?null:head):s==='body > nav'?(native?head:null):null,querySelectorAll:s=>body.querySelectorAll(s)};
 const context={document:doc,location:{pathname:path},window:{ResizeObserver:false,addEventListener(){}},console};vm.runInNewContext(script,context);
 return{body,head,foot,doc,oldLink,note,menu};
}
for(const path of ['/netra-eco/','/-Battery-Sentinel-Pro-Netra/','/KBC/','/netra-hub/','/prayagi-Privacy-/']){
 const f=fixture(path,path.includes('Battery'));
 assert(f.doc.getElementById('netra-scroll-contract'));
 const notes=f.doc.getElementById('netra-footer-notes');assert(notes);assert(notes.textContent.includes('Original privacy note'));
 assert.equal(f.note.parentNode,notes,'original legal/privacy content preserved');
 assert(f.doc.getElementById('about'),'original footer anchor preserved');assert.equal(f.foot.id,'');
 assert.equal(f.oldLink.textContent,'Netra Ecosystem (mother website)');assert.notEqual(f.oldLink.parentNode,f.head,'menus/links not pinned in identity header');
 assert.equal(f.foot.children.length,2);assert.equal(f.foot.children[0].textContent,'Netra Ecosystem');
 assert.equal(f.doc.documentElement.style['--netra-foot-height'],'38px');
 vm.runInNewContext(script,{document:f.doc,location:{pathname:path},window:{},console});
 assert.equal(f.body.descendants().filter(e=>e.id==='netra-footer-notes').length,1,'idempotent setup');
}
for(const path of ['/netra-player/','/netra-trikaal/','/','/KBC/privacy.html']){
 const f=fixture(path,false);assert.equal(f.doc.getElementById('netra-scroll-contract'),null);assert.equal(f.note.parentNode,f.foot);
}
console.log('PASS five active roots: footer preservation, compact chrome, link/menu relocation, measurement, idempotence; unrelated paths unchanged');
