const assert=require('node:assert/strict'),fs=require('node:fs');
const c=JSON.parse(fs.readFileSync('projects.json')),r=JSON.parse(fs.readFileSync('roadmap.json'));
for(const [id,date]of [['netra-geocam','2026-11-07'],['netra-photo','2026-11-07'],['netra-news','2026-11-15'],['netra-browser','2026-11-13']]){
 const apps=c.upcoming.filter(x=>x.id===id);assert.equal(apps.length,1);const a=apps[0];assert(!c.projects.some(x=>x.id===id));assert.equal(a.targets[0].targetDate,date);for(const k of ['eta','repo','download','package','latestJson'])assert(!a[k]);const i=r.items.find(x=>x.apps.includes(id));assert.equal(i.targetDate,date);assert(!i.eta);assert(!i.ships);
}
assert(c.upcoming.find(x=>x.id==='netra-browser').targets[0].label.includes('estimate'));
assert(c.upcoming.find(x=>x.id==='netra-geocam').summary.includes('deferred'));
console.log('Decided Future apps present once, unreleased, date-only, scope/estimate honest');
