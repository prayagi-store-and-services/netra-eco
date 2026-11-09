# ATIF v3.0 - applicable parts for the Netra Ecosystem website

ATIF v3.0 (Absolute Truth & Intelligence Framework) is the owner's permanent master rule, issued 9 Nov 2026. Canonical full text: private governance copy (`netra-intruder`, `docs/ATIF-v3.0.md`). This file lists only the parts that apply to THIS site.

## Applicable parts and why

- Part 01, 02: app pages, versions, sizes and descriptions must be accurate.
- Part 04, 06: version/size metadata comes from each app's published release (`latest.json`); no invented features, counts or dates. Missed roadmap dates stay visible rather than being silently removed.
- Part 09: download metadata must match the current published release; stale version data is a defect to fix, not to leave.
- Part 14: install/update flows state that Android confirms every install.
- Part 17, 20: every app's page copy stays in sync with that app's verified behaviour.

## Data this site shows, and its status

- Per-app pages with version, size, What's new and download links - sourced from real release metadata.
- Festival/seasonal presentation elements - decorative, no factual claims.

## Standing rule

A version, size, date or changelog appears on this site only when it matches the real published release. Unreleased work is labelled planned/future.

## Source labels (owner-approved 9 Nov 2026)

Every user-visible data claim carries a short source label. UI strings stay short; the label for each claim lives in this file's "Data this app shows" list and in WHATS_NEW/release notes (e.g. "Source: Android BatteryManager"). In-app visible source labels are planned and ship only after the owner's UI preview.

## Stale data: OLD marking (owner-approved 9 Nov 2026)

Any dated or versioned claim that stops matching reality is marked "OLD (as of <date>)" at the next check and corrected in the same or a following PR. Stale claims are never silently edited and never left unmarked.

## Weekly audit (owner-approved 9 Nov 2026)

A weekly audit records each material claim as VERIFIED or NOT VERIFIED in `docs/ATIF-AUDIT.md`, newest first. Failures and NOT VERIFIED items are listed first in every audit and every report.
