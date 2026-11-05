const test=require('node:test'),assert=require('node:assert/strict'),valid=require('../app/release-record.js'),record=require('../data/eco-release-verified.json');
const now=Date.parse(record.verifiedAt)+1000;
test('audited record valid within24hours',()=>assert.equal(valid(record,now).tag,'v1.3.0'));
test('invalid or stale metadata never shown',()=>{for(const change of [{schema:2},{tag:'v1.3.1'},{versionCode:-1},{size:1.2},{sha256:'bad'},{repo:'evil/eco'},{apk:'https://evil.invalid/app.apk'},{source:'https://evil.invalid'},{verifiedAt:'bad'},{publishedAt:'2099-01-01'}])assert.equal(valid({...record,...change},now),null);assert.equal(valid(record,Date.parse(record.verifiedAt)-1),null);assert.equal(valid(record,Date.parse(record.verifiedAt)+86400001),null);});
