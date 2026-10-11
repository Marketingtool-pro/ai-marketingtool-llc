---
name: relock-needs-legacy-peer-deps
enabled: true
event: bash
pattern: npm\s+(install|i)\b(?=.*--package-lock-only)(?!.*--legacy-peer-deps)
action: block
---

Blocked: lockfiles in this repo are regenerated with --legacy-peer-deps.

Use exactly the repo command (root CLAUDE.md, .github/workflows/relock.yml):

    npm install --package-lock-only --ignore-scripts --legacy-peer-deps

Without the flag npm adds peer-dependency entries and flips dev flags, so the lockfile churns away from Master.
