# Netra family UI / engineering standard

Rules Deepak set for every current and future Netra app. Each app records its compliance in its own SECURITY.md entry when it ships.

## 1. Spoken output always holds audio focus (19 Oct 2026)

Any TTS, spoken announcement or alert voice in a Netra app must request transient audio focus (`AUDIOFOCUS_GAIN_TRANSIENT`) while it speaks, so other media (music, videos) pauses - never muted - and resumes afterwards. The focus must be released when the utterance finishes, errors or is stopped, and a watchdog must release it even if the speech engine never calls back. Speech never talks over a phone call.

Shipped: Netra Hub v1.4.21, Netra Ecosystem v1.2.33, KBC v1.1.32, Netra Trikaal v1.0.18. Battery Sentinel Pro Netra v2.1.25 (AnnouncementEngine). Applies to every future app by default.

## 2. Every alert/voice feature ships a clearly labelled TEST button (19 Oct 2026)

Every alert, TTS or announcement feature must have a user-facing, clearly labelled TEST button that exercises the real path (same focus, same speech engine, same notification channel) and is unmistakably marked as a test - never a false emergency. Battery Sentinel Pro Netra already had this for target alerts (TargetAlert.sendTest); the rule makes it universal.

Shipped: Netra Ecosystem v1.2.33 ("Test announcement"), KBC v1.1.32 ("Test voice"), Netra Trikaal v1.0.18 ("Test" next to Listen). Scheduled: Netra Hub (official-alert test) 20 Oct 2026.
