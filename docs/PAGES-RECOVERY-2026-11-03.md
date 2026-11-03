# Temporary direct Pages recovery, 3 November 2026

At 19:15 IST the custom domain netraeco.dpdns.org failed DNS resolution from a direct
client and Google's public resolver (SERVFAIL, authoritative nameservers not responding).
The existing github.io catalog/roadmap URLs redirected there, affecting older Eco clients.
The public provider status said operational, so a provider-wide outage is not established.

The owner approved a reversible removal of the custom-domain redirect at 19:16 IST.
Before the change: cname netraeco.dpdns.org, legacy Pages from main:/, HTTPS enforced.
The setting is temporarily cname null, serving the existing github.io project URL directly.
CNAME is removed in this PR to prevent a later deployment restoring the broken redirect.
No DNS record, repository visibility, signing secret or unrelated setting is changed.

At 19:17:49 IST the owner made GitHub the primary home for every site and app data.
Do not restore a Pages custom domain: that redirects GitHub back to a DNS dependency.
A future optional domain landing/alias needs separate hosting that directs to GitHub, not
GitHub-to-domain redirection. Dead DNS cannot perform an automatic redirect.

Changed Pages cname to null (existing main:/ publishing source unchanged):
- netra-eco: previously netraeco.dpdns.org
- -Battery-Sentinel-Pro-Netra: previously battery.netraeco.dpdns.org
- netra-hub: previously hub.netraeco.dpdns.org
- KBC: previously kbc.netraeco.dpdns.org
- prayagi-Privacy-: previously privacy.netraeco.dpdns.org

The root prayagi-store-and-services.github.io and meet-the-team Pages sites already had no
custom domain and were left unchanged. GitHub's setting operation deleted each repository's
CNAME file automatically. No manual direct-main pushes were made.

App catalog/roadmap primary data: the same public repository on raw.githubusercontent.com,
with direct github.io as fallback. No third-party data copy or invented app status.
