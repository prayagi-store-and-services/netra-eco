// Slow-load status and section retry. Run: node tests/slow-load.test.js
const fs = require('node:fs');
const assert = require('node:assert/strict');
const src = fs.readFileSync('netra-site.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const helper = src.slice(src.indexOf('Slow-load status'));
assert(/Still loading\. This is taking longer than usual\./.test(helper), 'slow-load message missing');
assert(/b\.type="button"/.test(helper), 'retry must be a plain button');
assert(/WAIT_MS=15000/.test(helper), 'wait must be 15 seconds');
assert(!/setInterval|fetch\(|XMLHttpRequest|sendBeacon/.test(helper), 'helper must not poll or send requests itself');
assert(!/\d+\s*%/.test(helper), 'no invented percentages');
// Section-only retry: each loading section registers a loader, and the helper calls only that loader.
assert(/NETRA_RETRY\["whatsnew-list"\]=whatsNew/.test(src), 'whatsnew-list loader not registered');
assert(/NETRA_RETRY\.statsbox=loadStats/.test(html), 'statsbox loader not registered');
assert(/NETRA_RETRY\.rall=loadRatings/.test(html), 'rall loader not registered');
assert(/fn\(\);arm\(id\)/.test(helper), 'section retry must call only its own loader and re-arm the 15 second timer');
// No blind full-page retry: the helper never reloads, and cctv-grid also registers its own read-only loader.
const cctv = fs.readFileSync('cctv-videos.js', 'utf8');
assert(!/location\.reload|location\.href\s*=|history\.go/.test(helper), 'helper must never reload the page');
assert(/NETRA_RETRY\["cctv-grid"\]=load/.test(cctv), 'cctv-grid loader not registered');
assert(/typeof fn!=="function"\)return/.test(helper), 'section without a loader must do nothing on click');
// The retry code never touches forms or posts: no form submit/reset/value writes in the helper.
assert(!/requestSubmit|\.submit\(|\.reset\(|\.value\s*=/.test(helper), 'helper must not touch forms');
// Stats table must scroll inside its own wrapper instead of being clipped on narrow screens.
assert(/overflow-x:auto'><table/.test(html), 'stats table needs a scroll wrapper');
// Form copy: no unverified WhatsApp contact promise, honest unconfirmed wording.
assert(!/we will contact you on WhatsApp/i.test(html), 'unverified WhatsApp promise');
assert(/We could not confirm this was sent\./.test(html), 'unconfirmed-send text missing');
// WhatsApp number pattern must be a valid regular expression in both u and v modes, and keep the accepted format.
const pat = html.match(/id="cf-whatsapp"[^>]*pattern="([^"]+)"/)[1];
for (const flags of ['u', 'v']) {
  const re = new RegExp('^(?:' + pat + ')$', flags);
  for (const ok of ['+91 98765 43210', '9876543210', '+1 (415) 555-0100', '(0532) 123-4567']) assert(re.test(ok), flags + ' should accept ' + ok);
  for (const bad of ['12345', 'abcdefghij', '+91 98765 43210 99999']) assert(!re.test(bad), flags + ' should reject ' + bad);
}
console.log('slow-load test ok');
