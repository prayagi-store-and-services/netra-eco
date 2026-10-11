/* Netra family sites - region notice. Owner rule: Pakistan, Bangladesh and Afghanistan are blocked.
   How it works: checks the time zone your browser reports (Asia/Karachi, Asia/Dhaka, Asia/Kabul). Nothing is sent anywhere, no IP address lookup, nothing is stored.
   Honest limit: a static site cannot see your real location. A visitor who changes the device time zone, or uses another zone, is not caught; a visitor in these countries with another zone set is not caught either. */
(function(){
"use strict";
var Z={"Asia/Karachi":1,"Asia/Dhaka":1,"Asia/Kabul":1};
var z="";try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
if(!Z[z])return;
function show(){
 document.title="Not available in your region";
 document.body.innerHTML="";
 var d=document.createElement("div");
 d.style.cssText="font-family:system-ui,sans-serif;max-width:520px;margin:20vh auto;padding:20px;text-align:center;color:#222";
 var h=document.createElement("h1");h.style.fontSize="1.4rem";h.textContent="Not available in your region";
 var p=document.createElement("p");p.textContent="Netra apps and websites are not offered in your region.";
 d.appendChild(h);d.appendChild(p);document.body.appendChild(d);
}
if(document.body)show();else document.addEventListener("DOMContentLoaded",show);
})();
