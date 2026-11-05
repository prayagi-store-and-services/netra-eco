#!/usr/bin/env node
// Run after a verified public publish. Never records drafts, attempts or scheduled posts.
const fs=require('node:fs');const path=require('node:path');
const allowed={youtube:['www.youtube.com','youtube.com','youtu.be'],instagram:['www.instagram.com','instagram.com'],facebook:['www.facebook.com','facebook.com'],x:['x.com','www.x.com'],telegram:['t.me']};
function verifiedUrl(p){try{const u=new URL(p.url);return u.protocol==='https:'&&!u.username&&!u.password&&allowed[p.platform]?.includes(u.hostname)}catch{return false}}
const root=path.resolve(__dirname,'..');const keys=['youtube','instagram','facebook','x','telegram'];
function istDate(t){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t))}
function build(ledger,now=new Date()){
 const counts=Object.fromEntries(keys.map(k=>[k,0]));const seen=new Set();const date=istDate(now);
 for(const p of ledger.posts||[]){if(!keys.includes(p.platform)||typeof p.id!=='string'||!p.id||!Number.isFinite(Date.parse(p.publishedAt))||new Date(p.publishedAt)>now||!verifiedUrl(p))throw Error('Invalid verified post');const key=p.platform+':'+p.id;if(seen.has(key))continue;seen.add(key);if(istDate(p.publishedAt)===date)counts[p.platform]++}
 return {schemaVersion:1,timezone:'Asia/Kolkata',date,generatedAt:now.toISOString(),counts};
}
if(require.main===module){const ledger=JSON.parse(fs.readFileSync(path.join(root,'data/social-post-ledger.json'),'utf8'));fs.writeFileSync(path.join(root,'data/social-posts.json'),JSON.stringify(build(ledger),null,2)+'\n')}
module.exports={build,istDate};
