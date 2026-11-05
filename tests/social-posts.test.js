const {test}=require('node:test');const assert=require('node:assert/strict');const {build,istDate}=require('../scripts/gen-social-posts');
test('daily IST counts are deduplicated and not carried forward',()=>{const p={platform:'telegram',id:'47',url:'https://t.me/Netraecosystem/47',publishedAt:'2026-11-05T05:39:49Z'};assert.equal(build({posts:[p,p]},new Date('2026-11-05T07:00:00Z')).counts.telegram,1);assert.equal(build({posts:[p]},new Date('2026-11-05T18:30:00Z')).counts.telegram,0);assert.equal(istDate('2026-11-05T18:30:00Z'),'2026-11-06')});
test('bad evidence rejected',()=>{assert.throws(()=>build({posts:[{platform:'bad'}]}))});

test('platform evidence cannot point at an unrelated host',()=>{assert.throws(()=>build({posts:[{platform:'telegram',id:'1',url:'https://example.com/post',publishedAt:'2026-11-05T00:00:00Z'}]},new Date('2026-11-05T07:00:00Z')))});
