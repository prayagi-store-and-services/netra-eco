const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
for(const file of ['index.html','embed.html']){
 const source=fs.readFileSync(file,'utf8');
 const csp=source.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/)[1];
 assert(source.includes('<meta name="referrer" content="strict-origin-when-cross-origin">'));
 assert(csp.includes("default-src 'none'"));assert(csp.includes("object-src 'none'"));assert(csp.includes("base-uri 'none'"));
 const scripts=csp.match(/script-src ([^;]+)/)[1];assert(!scripts.includes('unsafe-inline'));assert(!scripts.includes('unsafe-eval'));assert(!scripts.includes('https:'));
 for(const m of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(!m[2].trim())continue;
  const hash=crypto.createHash('sha256').update(m[2]).digest('base64');assert(scripts.includes("'sha256-"+hash+"'"),'Missing script hash in '+file);
 }
 assert(csp.includes('https://firestore.googleapis.com'));assert(csp.includes('https://formsubmit.co'));assert(csp.includes("frame-src 'self'"));
 assert(source.indexOf('Content-Security-Policy')<source.indexOf('<script'));
 console.log('PASS exact inline hashes and required sources:',file);
}
