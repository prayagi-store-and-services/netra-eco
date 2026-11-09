/* Netra Ecosystem app page. Shows the newest release of one app and counts downloads started here.
   Counter: our own Firestore counter (counter.js), key dl-<code>. Anonymous: no cookies, no personal data.
   The download never waits on the counter: if it cannot be reached the file still downloads. */
(function () {
  "use strict";
  var m = document.getElementById("app"); if (!m) return;
  var code = m.getAttribute("data-code"), repo = m.getAttribute("data-repo") || "";
  var dlOverride = m.getAttribute("data-download") || "", latestUrl = m.getAttribute("data-latest") || "";
  if (!/^[a-z0-9]{2,12}$/.test(code)) return;
  if (repo && !/^prayagi-store-and-services\/[A-Za-z0-9._-]+$/.test(repo)) return;
  if (!repo && !dlOverride) return;
  // Device compatibility gate (owner command 9 Nov 19:31): like Play, an incompatible device gets no install option.
  // Honest limits: Chrome freezes the UA at "Android 10" (110+), so a real "Android 5/6" string only comes from
  // genuinely old browsers/WebViews; Android 7.0+ devices and frozen UAs pass, and the OS enforces minSdk 24 at install.
  // Desktop browsers keep the download: a PC is not an install target, the APK is for moving to an Android device.
  var gateDl=document.getElementById("dl"), gateMeta=document.getElementById("meta");
  var gateMsg=(function(){
    var ua=navigator.userAgent||"";
    if(/iPhone|iPad|iPod/i.test(ua))return "This app is not available for your device. Netra apps are Android APKs; iPhone and iPad are not supported.";
    var um=ua.match(/Android (\d+)(?:\.(\d+))?/i);
    if(um&&parseInt(um[1],10)<7)return "This app is not available for your device. It needs Android 7.0 or later; this device reports Android "+um[1]+(um[2]?"."+um[2]:"")+".";
    return null;
  })();
  if(gateMsg){
    if(gateDl){gateDl.removeAttribute("href");gateDl.setAttribute("aria-disabled","true");gateDl.textContent="Not available for your device";gateDl.style.pointerEvents="none";gateDl.style.opacity="0.6";}
    if(gateMeta)gateMeta.textContent=gateMsg;
    return;
  }
  // Human Safety has no latest/history fallback. Fail closed until this exact asset verifies.
  if (repo === "prayagi-store-and-services/netra-hub") {
    var hubDl=document.getElementById("dl"),hubMeta=document.getElementById("meta");
    hubDl.removeAttribute("href");hubDl.setAttribute("aria-disabled","true");hubDl.textContent="Download temporarily paused";
    hubMeta.textContent="Checking v1.5.9 release. Download stays paused if verification fails.";
    function validHubRelease(x){
 if(!x||x.tag_name!=="v1.5.9"||x.draft||x.prerelease||!x.published_at||isNaN(Date.parse(x.published_at)))return null;
 return (x.assets||[]).filter(function(a){return a.name==="app-release.apk"&&a.state==="uploaded"&&a.size===4455670&&a.digest==="sha256:54c3dcb9d7d7bb79c746ce01725ab09450a81357bf5d81fb130898abae7b8205"&&a.browser_download_url==="https://github.com/prayagi-store-and-services/netra-hub/releases/download/v1.5.9/app-release.apk"})[0]||null;
}
    fetch("https://api.github.com/repos/"+repo+"/releases/tags/v1.5.9",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(x){
      var a=validHubRelease(x);if(!a)throw 0;
      hubDl.href=a.browser_download_url;hubDl.removeAttribute("aria-disabled");hubDl.textContent="Download v1.5.9 APK";
      hubMeta.textContent="v1.5.9 - 4.2 MB - SHA-256: "+a.digest.slice(7);
    }).catch(function(){hubDl.style.display="none";hubMeta.style.display="none";}); // Owner rule (3 Nov): unverifiable release hides the download UI instead of showing Unavailable.
    return;
  }
  var weekly = document.createElement("section");
  weekly.setAttribute("aria-label", "Weekly security commitment");
  var weeklyTitle = document.createElement("h2");
  weeklyTitle.textContent = "Weekly security commitment";
  var weeklyPromise = document.createElement("p");
  weeklyPromise.textContent = "Netra Ecosystem will provide a weekly security patch on Saturday or Sunday.";
  var weeklyStatus = document.createElement("p");
  weeklyStatus.className = "sub";
  weeklyStatus.textContent = "This is a release commitment, not a claim that every app has already received this week's patch.";
  weekly.append(weeklyTitle, weeklyPromise, weeklyStatus);
  m.appendChild(weekly);
  var KEY = "dl-" + code;
  var dl = document.getElementById("dl"), meta = document.getElementById("meta"), cnt = document.getElementById("count");
  var url = dl.href;
  var op = document.getElementById("open");
  if (op && /Android/i.test(navigator.userAgent)) op.hidden = false;
  function showCount() {
    NetraCounter.get(KEY).then(function (v) {
      cnt.textContent = typeof v === "number" ? "Downloads counted on this page: " + v.toLocaleString() : "";
    });
  }
  if (!repo && latestUrl) {
    fetch(latestUrl, { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (x) {
      var parts = [];
      if (x && typeof x.tag === "string" && x.tag) parts.push(x.tag);
      if (x && Number.isFinite(x.size) && x.size > 0) parts.push((x.size / 1048576).toFixed(1) + " MB");
      var sha = x && typeof x.sha256 === "string" ? x.sha256 : "";
      parts.push("SHA-256: " + (/^[0-9a-f]{64}$/.test(sha) ? sha : "Unavailable"));
      meta.textContent = parts.length ? parts.join(" - ") : "Version details Unavailable right now. The button still downloads the latest APK.";
    }).catch(function () { meta.textContent = "Version details Unavailable right now. The button still downloads the latest APK."; });
  } else
  fetch("https://api.github.com/repos/" + repo + "/releases/latest", { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (x) {
    var al = (x.assets || []).filter(function (a) { return /\.apk$/i.test(a.name); });
    var a = al.filter(function (y) { return y.name !== "app-release.apk"; })[0] || al[0];
    if (!a) { meta.textContent = "Version details Unavailable right now. The button still downloads the latest APK."; return; }
    if (/^https:\/\/github\.com\/prayagi-store-and-services\//.test(a.browser_download_url)) { url = a.browser_download_url; dl.href = url; }
    var sha = (a.digest || "").replace(/^sha256:/, "");
    meta.textContent = x.tag_name + " - " + (a.size / 1048576).toFixed(1) + " MB - SHA-256: " + (/^[0-9a-f]{64}$/.test(sha) ? sha : "Unavailable");
  }).catch(function () {
    meta.textContent = "Version details Unavailable right now. The button still downloads the latest APK.";
    if(repo!=="prayagi-store-and-services/netra-eco-app"||typeof NetraVerifiedRelease!=="function")return;
    fetch("../../data/eco-release-verified.json",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(raw){
      var x=NetraVerifiedRelease(raw,Date.now());if(!x)return;
      url=x.apk;dl.href=url;dl.textContent="Download "+x.tag+" APK";
      meta.textContent="Last verified release: "+x.tag+" - "+(x.size/1048576).toFixed(1)+" MB - SHA-256: "+x.sha256+". Verified "+x.verifiedAt+". Newest version check unavailable.";
      var timer=setTimeout(function(){url="https://github.com/prayagi-store-and-services/netra-eco-app/releases/latest/download/app-release.apk";dl.href="https://github.com/prayagi-store-and-services/netra-eco-app/releases/latest/download/app-release.apk";dl.textContent="Download APK";meta.textContent="Version details Unavailable right now. The button still downloads the latest APK.";},Math.max(1,Date.parse(x.verifiedAt)+86400000-Date.now()));
    }).catch(function(){});
  });
  dl.addEventListener("click", function (e) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var go = function () { var d = go; go = function () {}; window.location.href = url; };
    try { NetraCounter.hit(KEY).then(function () { setTimeout(showCount, 300); }); } catch (x) {}
    setTimeout(go, 700);
  });
  showCount();
})();

/* Community and support loads only our own static script, no social SDK. */
(function(){var s=document.createElement('script');s.src='../../community.js';s.defer=true;document.head.appendChild(s)})();
