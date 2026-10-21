/* Netra Ecosystem home cards: send each app's Download button to its Ecosystem app page
   (/app/<code>/), where the download is counted, and show that counter on the card.
   Counter: abacus.jasoncameron.dev, namespace netra-pages, key dl-<code>. Anonymous, read only here.
   If the counter cannot be read, nothing is shown (never a made-up number). */
(function () {
  "use strict";
  var box = document.getElementById("apps"); if (!box) return;
  var AB = "https://abacus.jasoncameron.dev/get/netra-pages/dl-";
  var byId = null, done = {}, links = [];
  function count(code, line) {
    fetch(AB + code).then(function (r) { return r.json(); }).then(function (x) {
      if (typeof x.value === "number") line.textContent = "Downloads counted on the app page: " + x.value.toLocaleString();
      else if (x && x.error === "Key not found") line.textContent = "Downloads counted on the app page: 0";
    }).catch(function () {});
  }
  function apply() {
    if (!byId) return;
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id); if (!s || done[id]) return;
      var btns = s.querySelectorAll("a.btn"), dl = null, i;
      for (i = 0; i < btns.length; i++) if (/^Download/i.test(btns[i].textContent)) { dl = btns[i]; break; }
      if (!dl) return;
      done[id] = true;
      var code = byId[id];
      dl.href = "app/" + code + "/";
      dl.removeAttribute("rel");
      links.push({ el: dl, code: code });
      var line = document.createElement("div"); line.className = "sub"; line.setAttribute("data-dl-count", code);
      dl.parentNode.appendChild(line);
      count(code, line);
    });
  }
  fetch("projects.json").then(function (r) { return r.json(); }).then(function (d) {
    byId = {};
    (d.projects || []).forEach(function (p) { if (p && /^[a-z0-9]{2,12}$/.test(p.code || "") && p.id) byId[p.id] = p.code; });
    apply();
    new MutationObserver(function () {
      apply();
      /* The card's own script sets the raw release link after the release is read; keep the page link. */
      for (var i = 0; i < links.length; i++) {
        var want = "app/" + links[i].code + "/";
        if (links[i].el.getAttribute("href") !== want) links[i].el.setAttribute("href", want);
      }
    }).observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    box.addEventListener("click", function (e) {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
      for (var i = 0; i < links.length; i++) {
        if (links[i].el.contains(e.target)) {
          e.preventDefault();
          window.location.href = "app/" + links[i].code + "/";
          return;
        }
      }
    }, true);
    setTimeout(function () { apply(); }, 3000);
  }).catch(function () {});
})();
