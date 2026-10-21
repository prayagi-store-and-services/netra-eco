const assert = require('assert'); const fs = require('fs');
const j = JSON.parse(fs.readFileSync(__dirname + '/../team-videos.json', 'utf8'));
assert(j.videos.length >= 20);
for (const v of j.videos) { assert(/^[A-Za-z0-9_-]{6,20}$/.test(v.id), v.id); assert(['youtube','instagram'].includes(v.source)); assert(v.title && /^\d{4}-\d\d-\d\d$/.test(v.date)); assert(v.ai === true, 'AI label: ' + v.id); }
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
assert(html.includes('id="cctv-grid"') && html.includes('src="cctv-videos.js"'));
console.log('PASS cctv data and section');
