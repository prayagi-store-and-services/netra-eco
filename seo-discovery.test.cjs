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
