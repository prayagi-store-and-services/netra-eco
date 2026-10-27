const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('netra-site.js','utf8');
class E{constructor(tag){this.tag=tag;this.children=[];this.textContent=''}appendChild(e){this.children.push(e);return e}}
const document={createElement:t=>new E(t)};
const code=src.slice(src.indexOf('function noteLines(body)'),src.indexOf('/* ---- Live stats:'));
const context={document,window:{},fetch:null};vm.createContext(context);vm.runInContext(code,context);
const text=e=>[e.textContent,...e.children.map(text)].join('');
const long='A detailed paragraph '+('readable content '.repeat(50))+'END OF NOTES';
for(const body of [long,'First paragraph.\n\nSecond paragraph.','- First\n* Second\r\n- Third',Array.from({length:12},(_,i)=>'- item'+i).join('\n'),'<img src=x onerror=alert(1)> & text']){
 const box=new E('div');context.appendNotes(box,body);const actual=text(box);
 for(const line of body.split(/\r?\n/).filter(x=>x.trim()))assert(actual.includes(line.replace(/^\s*[-*]\s+/,'')));
 assert(!actual.includes('No detailed notes'));assert(!actual.includes('No release notes'));
 assert.equal(box.children[0].children.length,body.split(/\r?\n/).filter(x=>x.trim()).length);
}
for(const body of ['',null,'  \n\r\n']){const box=new E('div');context.appendNotes(box,body);assert.equal(text(box),'No release notes were provided.')}
async function renderFamily(){const box=new E('div');context.fetch=u=>Promise.resolve({ok:true,json:()=>Promise.resolve(u==='projects.json'?{projects:[{name:'Eco',repo:'owner/eco'}]}:{tag_name:'v1',published_at:'2026-10-27',html_url:'https://example.invalid',body:long})});context.whatsNewFamily(box);await new Promise(r=>setImmediate(r));assert(text(box).includes(long))}
async function renderApp(){const box=new E('div');document.getElementById=id=>id==='whatsnew-list'?box:null;context.window.NETRA_SITE={appId:'eco',repo:'owner/eco'};context.fetch=()=>Promise.resolve({ok:true,json:()=>Promise.resolve([{tag_name:'v1',published_at:'2026-10-27',html_url:'https://example.invalid',body:long}])});context.whatsNew();await new Promise(r=>setImmediate(r));assert(text(box).includes(long))}
(async()=>{await renderFamily();await renderApp();console.log('Release notes PASS: full long paragraph, multiline, bullets12+, empty, text-only HTML, family and app renderers')})().catch(e=>{console.error(e);process.exit(1)});
