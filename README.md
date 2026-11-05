# Netra Ecosystem

Mother website for all Netra / Prayagi Team projects.

To add a project, add one entry to `projects.json` (id, name, type, summary, repo, optional site). The page builds its section automatically and reads release and activity live from GitHub. Missing values show "Unavailable".

## Upcoming targets

Upcoming entries can use `targets` with a label, either `eta` (known time with offset) or `targetDate` (calendar date only), and an optional note. Legacy `eta` entries still work. Known-time timers show total hours at 72 hours or less; date-only targets show an approximate hours range near the target day instead of inventing a launch hour. Cards are announcements, not release confirmation or download links.

## Netra Ecosystem app 1.3.0

Compact app browsing, dedicated app details and an Updates list for known installed Netra apps. Update all queues verified APK downloads; Android still confirms every install. Downloaded does not mean installed. No new permission, broad inventory scan or automatic no-confirm updating. Charge's actual release signer is narrowly verified. Privacy policy explains local package checks and existing user-initiated HTTPS submissions, which are not end-to-end encrypted. Optional conditional automatic updates remain a separate unmerged review/device-test candidate, not part of1.3.0.
