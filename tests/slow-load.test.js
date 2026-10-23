// Slow-load status: placeholders still saying "Loading..." get an honest message and a manual retry button.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const src = fs.readFileSync('netra-site.js', 'utf8');
assert(/Still loading\. This is taking longer than usual\./.test(src), 'slow-load message missing');
assert(/type="button"|b\.type="button"/.test(src), 'retry must be a plain button');
assert(/Never reload over unsent or unconfirmed form state/.test(src), 'reload guard missing');
assert(!/setInterval|fetch\(/.test(src.slice(src.indexOf('Slow-load status'))), 'slow-load helper must not poll or send requests');
assert(!/\d+\s*%/.test(src.slice(src.indexOf('Slow-load status'))), 'no invented percentages');
console.log('slow-load test ok');
