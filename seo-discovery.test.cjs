// Free, offline SEO regression checks. Run with: node seo-discovery.test.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const base = 'https://prayagi-store-and-services.github.io/netra-eco/';
assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
assert(html.includes(`<link rel="canonical" href="${base}">`));
assert(html.includes('itemtype="https://schema.org/WebSite"'));
assert(html.includes('itemtype="https://schema.org/Organization"'));
const directory = html.match(/<section id="about-netra"[\s\S]*?<\/section>/)?.[0];
assert(directory, 'A visible static directory is required, not a JS-only catalogue');
assert(!directory.includes('<script'));
assert(!directory.includes('<noscript'));
assert(directory.includes('itemprop="name">Netra Ecosystem'));
assert(directory.includes('Future plans are separate from current apps'));
assert(!/<meta[^>]+name="robots"[^>]+noindex/i.test(html));
assert(!/\b(?:\+?91[- ]?)?[6-9]\d{9}\b/.test(directory), 'No public mobile number in the new directory');
const llms = fs.readFileSync('llms.txt', 'utf8');
assert(llms.includes('not a guarantee of search indexing'));
assert(!llms.includes('no account, no ads'));
const projects = JSON.parse(fs.readFileSync('projects.json', 'utf8')).projects;
for (const p of projects) {
  assert(directory.includes(`href="app/${p.code}/"`), `Missing static app link: ${p.code}`);
  assert(llms.includes(`${base}app/${p.code}/`), `Missing plain-text app link: ${p.code}`);
  assert(fs.existsSync(`app/${p.code}/index.html`), `Broken local app target: ${p.code}`);
}
console.log(`PASS primary canonical, visible brand microdata and ${projects.length} static app links`);

// Guardian-only release listing must stay pinned to the verified first release.
const guardian = projects.find(p => p.id === 'netra-battery-guardian');
assert(guardian && guardian.code === 'guardian');
assert.equal(guardian.package, 'com.aistudio.netrabattery.kxmzqr');
assert.equal(guardian.download, 'https://github.com/prayagideepak-collab/Netra-Battery-Guardian/releases/download/v1.0.0/Guardian-v1.0.0.apk');
const guardianRelease = JSON.parse(fs.readFileSync('guardian-release.json', 'utf8'));
assert.equal(guardianRelease.tag, 'v1.0.0');
assert.equal(guardianRelease.size, 13300013);
assert.equal(guardianRelease.sha256, 'f115e902aa9e191c4367519f274c26bf6adaf0692f12c57493af151f1e6f467f');
assert.equal(guardianRelease.download, guardian.download);
assert(fs.readFileSync('sitemap.xml', 'utf8').includes(base + 'app/guardian/'));
assert(fs.readFileSync('app/guardian/index.html', 'utf8').includes(guardian.download));
