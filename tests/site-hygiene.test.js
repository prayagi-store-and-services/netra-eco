// Checks every page and file in the site. Free, no dependencies.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const skip = new Set(['.git', 'node_modules']);
function walk(d, out = []) {
 for (const n of fs.readdirSync(d, { withFileTypes: true })) {
  if (skip.has(n.name)) continue;
  const p = path.join(d, n.name);
  n.isDirectory() ? walk(p, out) : out.push(p);
 }
 return out;
}
const files = walk('.');
const html = files.filter(f => f.endsWith('.html'));
// 1. Every page has a CSP with default-src 'none', no unsafe-eval, and a referrer policy.
for (const f of html) {
 const s = fs.readFileSync(f, 'utf8');
 const m = s.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
 assert(m, 'Missing CSP: ' + f);
 assert(/default-src 'none'/.test(m[1]), "CSP must start from default-src 'none': " + f);
 assert(!/unsafe-eval/.test(m[1]), 'unsafe-eval is not allowed: ' + f);
 assert(!/script-src[^;]*'unsafe-inline'/.test(m[1]), 'script unsafe-inline is not allowed: ' + f);
 assert(/<meta name="referrer" content="[^"]+">/.test(s), 'Missing referrer policy: ' + f);
 // No inline event handlers (they would need script unsafe-inline).
 assert(!/\son(click|load|error|mouseover)\s*=/i.test(s), 'Inline event handler in ' + f);
 // External links that open a new tab must carry noopener.
 for (const a of s.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) assert(/noopener/.test(a[0]), 'target=_blank without noopener in ' + f);
}
// 2. No secrets or private keys committed.
const patterns = [/AIza[0-9A-Za-z_-]{35}/, /ghp_[0-9A-Za-z]{36}/, /github_pat_[0-9A-Za-z_]{40,}/, /-----BEGIN [A-Z ]*PRIVATE KEY/, /AKIA[0-9A-Z]{16}/, /xox[baprs]-[0-9A-Za-z-]{10,}/, /sk_live_[0-9A-Za-z]{20,}/];
for (const f of files) {
 if (!/\.(html|js|json|md|yml|yaml|txt|rules|css)$/.test(f)) continue;
 const s = fs.readFileSync(f, 'utf8');
 for (const p of patterns) assert(!p.test(s), 'Possible secret in ' + f + ' (' + p + ')');
}
// 3. Scripts are loaded only from our own site.
for (const f of html) {
 for (const m of fs.readFileSync(f, 'utf8').matchAll(/<script\b[^>]*\ssrc="([^"]+)"/gi)) {
  const u = m[1];
  assert(!/^https?:\/\//.test(u) || u.startsWith('https://prayagi-store-and-services.github.io/'), 'Outside script in ' + f + ': ' + u);
 }
}
console.log('PASS site hygiene:', html.length, 'pages,', files.length, 'files');
