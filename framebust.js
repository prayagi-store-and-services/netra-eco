/* Clickjacking protection. GitHub Pages cannot send X-Frame-Options or frame-ancestors, so a page shown inside a
   frame from another site hides itself. Framing by our own site (same origin) is allowed. */
(function () {
  try {
    if (window.top === window.self) return;
    try { if (window.top.location.origin === window.location.origin) return; } catch (e) { /* cross-origin frame */ }
  } catch (e) { /* treat as framed */ }
  document.documentElement.style.display = "none";
})();
