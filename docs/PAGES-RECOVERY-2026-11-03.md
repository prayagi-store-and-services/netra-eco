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

Restoration is a separate deliberate action after authoritative/public DNS resolution and
HTTPS content are verified: restore CNAME netraeco.dpdns.org and the Pages custom domain,
keep HTTPS enabled, then test old-client catalog and roadmap URLs through the redirect.
Do not restore merely because the provider status page reports green.
