/* Writes app/<code>/index.html for every app in projects.json. Run: node scripts/gen-app-pages.js
   `node scripts/gen-app-pages.js --check` fails if any page is missing or out of date. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'projects.json'), 'utf8'));
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function page(p) {
  const hub = p.repo === "prayagi-store-and-services/netra-hub";
  const notice = "v1.5.5 adds official IMD subdivision / NDMA CAP reports matched on the phone. Green reports stay silent; verified Yellow, Orange and Red IMD warnings can notify and speak. Checks are about 30 minutes, subject to Android delays, not every forecast or district nowcast. Beta/testing, not an emergency-service replacement; physical-phone delivery unverified. Hub does not download or install APKs. Updates are handled through Netra Ecosystem only. Older builds are not offered.";
  return `<!doctype html>
<html lang="en">
<head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.github.com https://firestore.googleapis.com; frame-src 'none'; media-src 'none'; form-action 'none'; upgrade-insecure-requests"><meta name="referrer" content="strict-origin-when-cross-origin"><script src="../../framebust.js"></script><script src="../../counter.js"></script><script src="https://prayagi-store-and-services.github.io/netra-eco/geoblock.js"></script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} - Netra Ecosystem</title>
<meta name="description" content="${hub ? "Netra Human Safety v1.5.5. Exact release verification before download; updates through Netra Ecosystem only." : `Download ${esc(p.name)} from the Netra Ecosystem. ${esc(p.summary)}`}">
<link rel="icon" type="image/svg+xml" href="../../logo.svg">
<link rel="stylesheet" href="../app.css">
</head>
<body>
<main id="app" data-code="${esc(p.code)}" data-repo="${esc(p.repo || '')}" data-name="${esc(p.name)}" data-icon="${esc(p.icon || '')}"${p.download ? ` data-download="${esc(p.download)}"` : ''}${p.download && p.latestJson ? ` data-latest="${esc(p.latestJson)}"` : ''}>
<p class="back"><a href="../../">Netra Ecosystem</a></p>
<h1>${esc(p.name)}</h1>
<p class="type">${esc(p.type || '')}</p>
<p>${esc(p.summary)}</p>
${hub ? `<aside role="note" style="border:2px solid #fbbf24;border-radius:12px;padding:16px;overflow-wrap:anywhere"><p>${esc(notice)}</p></aside>
<p><a id="dl" class="btn" aria-disabled="true">Download temporarily paused</a></p>` : `<p><a id="dl" class="btn" href="${p.download ? esc(p.download) : `https://github.com/${esc(p.repo)}/releases/latest/download/app-release.apk`}">Download APK</a></p>`}
<p id="open" hidden><a class="btn btn2" href="intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${esc(p.package)};S.browser_fallback_url=${encodeURIComponent('https://prayagi-store-and-services.github.io/netra-eco/app/' + p.code + '/')};end">Open app (if installed)</a></p>
<p id="meta" class="sub"${hub ? ' style="overflow-wrap:anywhere"' : ''}>Loading the latest version...</p>
<p id="count" class="sub"></p>
${hub ? "" : `<p class="sub">Android only. On an Android phone the Open app button launches the app if it is installed; if Android cannot find it, you stay on this page to download it. A browser cannot always tell whether an app is installed. Allow installs from your browser once if Android asks. Downloads started from this page are counted anonymously (no cookies, no personal data).</p>`}
${p.site ? `<p><a href="${esc(p.site)}">About ${esc(p.name)}</a></p>` : ''}
${p.privacy ? `<p class="sub">Legal: <a href="${esc(p.privacy)}">Privacy policy</a> &middot; <a href="../../legal/data-safety.html#${esc(p.code)}">Data safety</a> &middot; <a href="../../legal/">All legal documents</a></p>` : ''}
</main>
<script src="../app.js"></script>
</body>
</html>
`;
}
const check = process.argv.includes('--check');
const codes = new Set(); let bad = 0;
for (const p of catalog.projects) {
  if (!/^[a-z0-9]{2,12}$/.test(p.code || '')) throw new Error('bad or missing code for ' + p.id);
  if (codes.has(p.code)) throw new Error('duplicate code ' + p.code); codes.add(p.code);
  const file = path.join(root, 'app', p.code, 'index.html'), html = page(p);
  if (check) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== html) { console.error('out of date: ' + file); bad++; } }
  else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html); }
}
if (check) { if (bad) process.exit(1); console.log('app pages up to date: ' + codes.size); }
else console.log('wrote ' + codes.size + ' app pages');
