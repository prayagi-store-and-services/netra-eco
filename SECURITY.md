# Security Policy

This repository holds the Netra Ecosystem website (the mother website for all Netra apps) and the shared JavaScript files the other Netra family sites load from it.

## Supported Versions

the Netra Ecosystem website is a website deployed to GitHub Pages. The live site is always the current supported version; fixes are deployed to the live site directly. There are no supported older versions.

## Scope

- The site is static HTML/CSS/JavaScript served by GitHub Pages, with a strict Content-Security-Policy.
- The contact and app-request forms send their contents through FormSubmit to the developer's email; they are not shown publicly.
- Ratings, suggestions and complaints are stored in Google Firebase (Firestore) and shown publicly; email addresses are never shown.
- The site has no user accounts and no login.
- Changes to the shared files (`downloads.js`, `eco-promo.js`, `geoblock.js`) affect every Netra family site that loads them.

## Reporting a Vulnerability

If you discover a security vulnerability in the Netra Ecosystem website, please report it privately.

Please do **not** create a public GitHub issue for an undisclosed security vulnerability.

### Preferred Reporting Method

Use GitHub's private vulnerability reporting feature for this repository when available.

If private vulnerability reporting is not available, contact the repository maintainer privately through the GitHub repository/account rather than publicly disclosing the vulnerability.

### Include the Following Information

Please provide:

- A clear description of the vulnerability
- The affected version, release, or commit
- Steps required to reproduce the issue
- Expected behavior
- Actual behavior
- Potential security impact
- Relevant logs, screenshots, or proof-of-concept information when appropriate

Do not include passwords, API keys, authentication tokens, personal information, or other sensitive information in a vulnerability report.

## What Happens After a Report

Security reports will be reviewed and investigated.

When a report is received, the maintainer may:

1. Verify and reproduce the reported issue.
2. Determine the affected components and versions.
3. Assess the security impact.
4. Develop and test an appropriate fix.
5. Release a security update when necessary.
6. Publish appropriate security information after the issue has been addressed.

The exact response time may vary depending on the severity and complexity of the vulnerability.

## Responsible Disclosure

Please allow reasonable time for investigation and remediation before publicly disclosing a security vulnerability.

Public disclosure before a fix is available may increase risk to users.
