/* Netra Ecosystem app page. Shows the newest release of one app and counts downloads started here.
   Counter: our own Firestore counter (counter.js), key dl-<code>. Anonymous: no cookies, no personal data.
   The download never waits on the counter: if it cannot be reached the file still downloads. */
(function () {
  "use strict";
  var m = document.getElementById("app"); if (!m) return;
  var code = m.getAttribute("data-code"), repo = m.getAttribute("data-repo");
  if (!/^[a-z0-9]{2,12}$/.test(code) || !/^prayagi-store-and-services\/[A-Za-z0-9._-]+$/.test(repo)) return;
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
  fetch("https://api.github.com/repos/" + repo + "/releases/latest", { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (x) {
    var al = (x.assets || []).filter(function (a) { return /\.apk$/i.test(a.name); });
    var a = al.filter(function (y) { return y.name !== "app-release.apk"; })[0] || al[0];
    if (!a) { meta.textContent = "Version details Unavailable right now. The button still downloads the latest APK."; return; }
    if (/^https:\/\/github\.com\/prayagi-store-and-services\//.test(a.browser_download_url)) { url = a.browser_download_url; dl.href = url; }
    var sha = (a.digest || "").replace(/^sha256:/, "");
    meta.textContent = x.tag_name + " - " + (a.size / 1048576).toFixed(1) + " MB - SHA-256: " + (/^[0-9a-f]{64}$/.test(sha) ? sha : "Unavailable");
  }).catch(function () { meta.textContent = "Version details Unavailable right now. The button still downloads the latest APK."; });
  dl.addEventListener("click", function (e) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var go = function () { var d = go; go = function () {}; window.location.href = url; };
    try { NetraCounter.hit(KEY).then(function () { setTimeout(showCount, 300); }); } catch (x) {}
    setTimeout(go, 700);
  });
  showCount();
})();
