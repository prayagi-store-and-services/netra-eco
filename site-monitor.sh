#!/usr/bin/env bash
# Netra own site/server monitor: HTTP + content-marker checks across our sites,
# the Apps Script backend health response, and app update feeds (latest.json).
# Detection only: exits non-zero with a plain-language failure list. No alerts,
# no emails, no recovery actions - GitHub's normal workflow-failure notification
# carries the signal, and the team fixes.
set -u
BASE="https://prayagi-store-and-services.github.io"
ORG="prayagi-store-and-services"
FAIL=""
check() { # name url expected-substring
  local body code
  body=$(curl -sL -m 25 -w '\n%{http_code}' "$2" 2>/dev/null) || { FAIL="$FAIL\n- $1: no response ($2)"; return; }
  code=$(printf '%s' "$body" | tail -n1)
  body=$(printf '%s' "$body" | sed '$d')
  [ "$code" = "200" ] || { FAIL="$FAIL\n- $1: HTTP $code ($2)"; return; }
  [ -n "$3" ] && ! printf '%s' "$body" | grep -qF "$3" && { FAIL="$FAIL\n- $1: marker missing: '$3' ($2)"; return; }
}
# Root site (netra-eco) - full set
check "eco home" "$BASE/netra-eco/" "Netra"
check "eco sitemap" "$BASE/netra-eco/sitemap.xml" "<urlset"
check "eco robots" "$BASE/netra-eco/robots.txt" "Sitemap:"
check "eco llms" "$BASE/netra-eco/llms.txt" "Netra"
check "legal index" "$BASE/netra-eco/legal/" "Privacy"
for app in hub kbc guard player eco; do
  check "privacy-$app" "$BASE/netra-eco/legal/privacy-$app.html" "Crash reports (your choice)"
done
check "privacy-trikaal" "$BASE/netra-eco/legal/privacy-trikaal.html" "Privacy policy"
check "data-safety" "$BASE/netra-eco/legal/data-safety.html" "Crash reports"
# Subsites - home + sitemap + llms only (they have no robots.txt by design)
subsite() { # repo marker
  check "$2 home" "$BASE/$1/" "$2"
  check "$2 sitemap" "$BASE/$1/sitemap.xml" "<urlset"
  check "$2 llms" "$BASE/$1/llms.txt" "Netra"
}
subsite "netra-hub" "Netra Human Safety"
subsite "KBC" "KBC"
subsite "prayagi-Privacy-" "Privacy Guard"
subsite "-Battery-Sentinel-Pro-Netra" "Battery Sentinel"
subsite "meet-the-team" "Meet the Team"
check "apex home" "$BASE/" ""
# Apps Script backend health (read-only, side-effect-free default doGet)
check "apps-script health" "https://script.google.com/macros/s/AKfycbyAJG3ci-kniagsih7BXHpAPTk5h0-zKujN3Bu2VDyz5yh5fYNRor8GuVGedH1HdPmw/exec" '"ok":true'
# App update feeds: latest release must carry a parseable latest.json with the fields the updater needs
for repo in netra-hub KBC prayagi-Privacy- netra-eco-app netra-player netra-trikaal; do
  url=$(curl -s -m 20 "https://api.github.com/repos/$ORG/$repo/releases/latest" | jq -r '.assets[]? | select(.name=="latest.json") | .browser_download_url' | head -n1)
  [ -z "$url" ] && { FAIL="$FAIL\n- $repo latest.json: not found on latest release"; continue; }
  j=$(curl -sL -m 20 "$url")
  printf '%s' "$j" | jq -e '.versionName and .versionCode and .sha256 and .size' >/dev/null 2>&1 || FAIL="$FAIL\n- $repo latest.json: missing required fields ($url)"
done
if [ -n "$FAIL" ]; then
  printf 'NETRA SITE MONITOR FAILURE (%s UTC):%b\n' "$(date -u '+%Y-%m-%d %H:%M')" "$FAIL"
  exit 1
fi
echo "All checks passed ($(date -u '+%Y-%m-%d %H:%M') UTC)."
