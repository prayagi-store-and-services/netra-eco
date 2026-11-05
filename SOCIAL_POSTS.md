# Public social post counts

Only verified public publishes belong in data/social-post-ledger.json. Each entry needs platform, canonical post ID, real URL and actual publishedAt timestamp. Do not add planned, failed, scheduled or unverified posts. Edit/delete corrections must update the ledger before regenerating. No platform credentials or user data belong here.

Run `node scripts/gen-social-posts.js` after a verified publish. It deduplicates platform+ID and derives today in Asia/Kolkata. Commit ledger and generated data together through a focused green PR. Clients reject another date and hide counts on unavailable/invalid/offline data, so midnight needs no client tracking or scheduled write. The feed is not an unread-message count. No click tracking.

The initial two Telegram entries were verified from their public post timestamps on 5 November2026. Other platforms have no verified publishes today reported by the posting workflow. A publish not recorded here will not create a badge; do not guess or scrape counts from a draft.
