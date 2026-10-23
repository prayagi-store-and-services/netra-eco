# Deploy and rollback note: Eco and Jan sites

Status: grounded in what is visible in the repos and, for the Pages source, in the repo Settings > Pages screen read on 2026-10-23 (read only, nothing changed).

## What is actually hosting
- Both sites are static files served by GitHub Pages (response header `server: GitHub.com`).
  - Eco: https://prayagi-store-and-services.github.io/netra-eco/
  - Jan: https://prayagi-store-and-services.github.io/
- Neither repo has a user-written deploy workflow. Deployment is the GitHub-managed "pages build and deployment" workflow. Settings > Pages (read 2026-10-23): Source is "Deploy from a branch", branch `main`, folder `/ (root)`, no custom domain, HTTPS enforced on Eco. The "pages build and deployment" workflow publishes each push to main.
- Not claimed: atomic deploys, zero downtime, or instant rollback. No evidence for these. Expect a short delay after a push before the new files appear, and CDN caching can show old files briefly.

## Deploy (per PR)
1. Open a PR. CI must be green (Eco: Site security metadata tests, Site validation, CodeQL. Jan: Availability tests, Deployed staff login abuse tests).
2. Check the exact head commit and that the new test is in the workflow list. CI only runs listed tests.
3. Owner or reviewer merges by hand. No direct pushes to main.
4. After merge, open the live URL in a private window and check the changed section. The hourly Eco Site Monitor (site-monitor.yml, cron 17 * * * *, runs scripts/site-monitor.sh) is a smoke check only. It can also be started by hand with workflow_dispatch. The Jan repo has no monitor workflow.

## Rollback
1. On GitHub, open the merged PR and use Revert. This opens a new PR that undoes the merge. Merge it after CI is green.
2. Or revert by hand on a branch and open a PR. First check how the PR was merged (`git show --no-patch --format=%P <sha>` lists parents). A merge commit has two parents: use `git revert -m 1 <merge-commit>`. A squash merge is one ordinary commit: use `git revert <sha>`. A rebase merge adds several commits: revert each, newest first. Do not force-push main. If a revert conflicts, stop and have the PR reviewed before merging. The GitHub Revert button can be missing or can conflict, so do not rely on it.
3. After the revert merges, check the live URL again. Allow a few minutes for Pages to rebuild.
4. Eco's inline scripts are hash-pinned in the CSP. A revert restores the old script and the old hash together, so they stay consistent. Never revert only one file of a script and hash pair.
5. Pages deployment history (repo Actions tab, "pages build and deployment") shows what was published. Reading it needs repo access.

## Out of scope and unchanged
- Firebase rules (netra-ai-jan): not covered by this note. In the current workflow the published rules are changed from the Firebase console, not from this repo, and this task changed no rules, auth or billing. `firestore.rules.proposed` is only a proposal file.
- formsubmit, Apps Script and Google Forms backends. Their deploys are separate and not covered here.
- No repo settings, billing or Pages settings were changed.
- Not checked: whether Pages keeps older deployments you could re-run. Use Revert instead.
