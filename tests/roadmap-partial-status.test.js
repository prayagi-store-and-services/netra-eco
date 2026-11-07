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
