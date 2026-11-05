const assert=require('node:assert/strict'),fs=require('node:fs');
const c=JSON.parse(fs.readFileSync('projects.json')),r=JSON.parse(fs.readFileSync('roadmap.json'));
for(const [id,date] of [['netra-sentinel-lite','2026-11-10'],['netra-law','2026-11-12']]){
 const a=c.upcoming.find(x=>x.id===id);assert(a);assert(!c.projects.some(x=>x.id===id));
 assert.equal(a.targets[0].targetDate,date);assert(!a.eta);assert(!a.download);assert(!a.repo);
 const i=r.items.find(x=>x.apps.includes(id));assert.equal(i.targetDate,date);assert(!i.eta);assert(!i.ships);
}
assert(r.items.some(x=>x.apps.includes('netra-trikaal')&&x.eta==='2026-10-24T20:00:00+05:30'));
console.log('Owner date-only deadlines, unreleased states and old missed dates preserved');
