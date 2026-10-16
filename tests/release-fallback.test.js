const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
assert(!html.includes('Not released yet'),'absence of release data must never imply unreleased');
const start=html.indexOf('  var rel=row('),end=html.indexOf('/*LIVE-END*/',start);
assert(start>0&&end>start);
const code=html.slice(start,end).trim();
async function test(response){
 const fields=[];let task;
 const context={row(k,v){const dd={textContent:v,hidden:false,previousElementSibling:{hidden:false}};fields.push(dd);return dd},el(){return {appendChild(){},insertBefore(){},firstChild:null}},p:{repo:'owner/repo',site:null,name:'test'},b:{appendChild(){}},w:{appendChild(){}},s:{appendChild(){}},box:{appendChild(){}},gh(){return {then(fn){task=Promise.resolve(response).then(fn)}}},when(v){return 'date:'+v}};
 vm.runInNewContext(code,context);await task;return fields;
}
(async()=>{
 for(const response of [null,{},[]]){const f=await test(response);assert(f.every(d=>d.hidden&&d.previousElementSibling.hidden));assert(f.every(d=>d.textContent===''))}
 const known=await test({tag_name:'v1.2.3',published_at:'2026-10-15',assets:[{name:'app-release.apk',size:1048576,browser_download_url:'https://example.invalid/a.apk'}]});
 assert(known.every(d=>!d.hidden&&!d.previousElementSibling.hidden));assert.equal(known[0].textContent,'v1.2.3');assert.equal(known[2].textContent,'1.0 MB');
 const partial=await test({tag_name:'v1.2.3',assets:[]});assert(!partial[0].hidden);assert(partial[1].hidden&&partial[2].hidden);
 console.log('release fallback tests PASS: missing/failed/partial/valid data');
})().catch(e=>{console.error(e);process.exit(1)});
