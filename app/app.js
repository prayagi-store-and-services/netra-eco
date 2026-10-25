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
  // Human Safety-only temporary hold. Do not fetch or wire a download fallback while paused.
  if (repo === "prayagi-store-and-services/netra-hub") {
    var pausedDownload = document.getElementById("dl");
    if (pausedDownload) { pausedDownload.removeAttribute("href"); pausedDownload.setAttribute("aria-disabled", "true"); pausedDownload.textContent = "Download temporarily paused"; }
    var pausedMeta = document.getElementById("meta");
    if (pausedMeta) pausedMeta.textContent = "Download temporarily paused";
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
