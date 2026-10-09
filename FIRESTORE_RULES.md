# Firestore rules draft (netra-ai-jan)

`firestore.rules` in this repo root is a DRAFT. Nothing is applied by merging this file. Merging only stores the text in the repo.

## What it does
- Reads stay public for ratings, feedback, replies and the usage counters (the sites show them).
- Clients can only CREATE ratings and feedback, with allowed fields and size limits (comment up to 500, message up to 1000, stars 1 to 5). No edit, no delete.
- Replies: no client writes. The owner writes them from the Firebase console or admin tools, which are not limited by these rules.
- `netra_active/<appId>_<yyyyMMdd or yyyyMM>`: create with count 1, or update by exactly +1. No delete.
- Everything else is closed.

## Before you apply (owner, by hand)
1. Open Firebase console, project netra-ai-jan, Firestore Database, Rules tab. Copy the CURRENT rules somewhere safe first (you need them to roll back).
2. In the Rules Playground, simulate: (a) an unauthenticated create of a rating with stars 5, appId kbc, mode anonymous, createdAt now: should ALLOW. (b) stars 9: DENY. (c) update or delete any rating: DENY. (d) netra_active/netra-eco_20261009 +1: ALLOW.
3. Paste the draft, press Publish.
4. Within a few minutes check: the site embed.html still posts a rating, the apps' daily counter still counts, ratings still appear on the Eco site. If any of these stops, press "Restore" to the old rules and tell the developer which one failed.

## Known limits
- The rules cannot stop someone from sending many valid ratings (spam). Free next step: Firebase App Check, or a small rate limit later.
- `createdAt` and `reported` types follow what the current site sends (timestamp as sent by embed.html). If a legitimate client sends another field name, it will be refused; the Playground test in step 2 and the check in step 4 catch this.
- These rules were NOT tested against the live database (no write tests are allowed on production). They are reviewed by reading the current client code only.
