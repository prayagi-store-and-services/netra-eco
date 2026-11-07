const assert = require('assert');
const data = require('../roadmap.json');
const all = Array.isArray(data) ? data : Object.values(data).flat();
const festival = all.find(x => x.title === 'Festival open animations');
const dns = all.find(x => x.title && x.title.includes("where each app's data goes"));
for (const item of [festival, dns]) {
  assert(item, 'scoped roadmap entry exists');
  assert.strictEqual(item.eta, null, 'no unverified countdown date');
  assert(/partial/i.test(item.status));
  assert(/date not verified/i.test(item.status));
  assert(item.missedEta, 'historical missed target preserved');
}
console.log('Both scoped roadmap entries retain partial status with no new ETA.');

const neg = data.items.find(x => (x.apps || []).includes('netra-neg'));
assert.strictEqual(neg.targetDate, '2026-11-08');
assert.strictEqual(neg.eta, null);
assert.strictEqual(neg.missedEta, '2026-11-07T20:00:00+05:30');
assert(/owner.deferred/i.test(neg.title));
assert(/not a readiness promise/.test(neg.status));
assert(/time not set/.test(neg.status));
assert(require('fs').readFileSync('roadmap.js', 'utf8').includes('Target date: '));

const catalogNeg = require('../projects.json').upcoming.find(x => x.id === 'netra-neg');
assert.strictEqual(catalogNeg.targetDate, neg.targetDate);
assert(!catalogNeg.eta);
assert.strictEqual(catalogNeg.missedEta, neg.missedEta);
assert(/Owner-deferred/.test(catalogNeg.summary));
assert(/time not set/.test(catalogNeg.summary));
assert(/not a readiness promise/.test(catalogNeg.summary));
assert.strictEqual(catalogNeg.targets.length, 1);
assert.strictEqual(catalogNeg.targets[0].targetDate, neg.targetDate);
assert(!catalogNeg.targets[0].eta);
