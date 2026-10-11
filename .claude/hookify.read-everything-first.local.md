---
name: read-everything-first
enabled: true
event: prompt
# A plain `pattern:` on a prompt rule checks a field hookify never fills, so it never fired.
# `user_prompt` is filled (empty string at worst), so `.*` now matches every message.
conditions:
  - field: user_prompt
    operator: regex_match
    pattern: .*
action: warn
---

📖 **Owner rule: no blind work. Understand first.**

Before changing anything for this request:
1. Read every file involved **in full** — the files named, the files they import, the config that drives them, and the CI/workflow that runs them.
2. Read the full output of any error, log or CI run the owner pasted — not just the last line.
3. If the request is about "the project", look at the whole project, not one folder.

Do not guess. Do not edit a file you have not opened.
