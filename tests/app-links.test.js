const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
execFileSync('node', ['scripts/gen-app-pages.js', '--check'], { stdio: 'inherit' });
const cat = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
for (const p of cat.projects) {
  const html = fs.readFileSync('app/' + p.code + '/index.html', 'utf8');
  assert(html.includes('data-code="' + p.code + '"'));
  assert(!/<script>[^<]/.test(html), 'no inline script');
  assert(html.includes("connect-src 'self' https://api.github.com https://abacus.jasoncameron.dev;"));
}
const js = fs.readFileSync('app/app.js', 'utf8');
new (require('node:vm').Script)(js);
const home = fs.readFileSync('index.html', 'utf8');
assert(home.includes('<script src="home-links.js"></script>'), 'home cards script is loaded');
const hl = fs.readFileSync('home-links.js', 'utf8');
new (require('node:vm').Script)(hl);
assert(hl.includes('"app/" + code + "/"') && hl.includes('netra-pages/dl-'));
for (const p of cat.projects) assert(/^[a-z0-9]{2,12}$/.test(p.code), 'code for ' + p.id);
console.log('app deep-link tests PASS:', cat.projects.map(p => p.code).join(','));
