const fs=require('fs'),assert=require('assert'),vm=require('vm');
const js=fs.readFileSync('community.js','utf8');new vm.Script(js);new vm.Script(fs.readFileSync('contact.js','utf8'));
for(const u of ['https://www.youtube.com/@NetraEcosystem','https://www.instagram.com/netraecosystem/','https://www.facebook.com/netraecosystem','https://x.com/netraecosystem','https://t.me/Netraecosystem'])assert(js.includes(u));
assert(!/fetch\(|localStorage|sendBeacon/.test(js));assert(js.includes('Nothing is followed, liked or posted automatically.'));
const e=fs.readFileSync('embed.html','utf8');assert(e.includes('Choose 1 to 5 stars'));assert(!e.includes('<option value="5" selected'));assert(e.includes('up to 100 records'));assert(e.includes('No score can be shown'));assert(e.includes('Number.isInteger(x.stars)'));assert(e.includes('stars.disabled=!rating'));
const c=fs.readFileSync('contact.html','utf8');assert(c.includes('not publish'));assert(c.includes('name="consent" required'));assert(c.includes('role="status"'));assert(!/firestore/.test(c));
assert(fs.readFileSync('app/app.js','utf8').includes('../../community.js'));
console.log('PASS official social allowlist, no social network calls, per-app context, consent, neutral rating and honest sample limits');
