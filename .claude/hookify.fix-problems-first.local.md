---
name: fix-problems-first
enabled: true
event: stop
# 2026-10-30: enabled. A plain `pattern:` on a stop rule is checked against an empty field and
# never fires; matching the `transcript` field does. Hard blocking stays in stop-gates.py / mt-guard.
conditions:
  - field: transcript
    operator: regex_match
    pattern: '(?i)(still (fails?|failing|broken|errors?)|not (yet )?fixed|pre-existing|already (broken|failing) (on|in) (master|main)|remaining (issues|errors|failures)|unrelated (failure|error)|known issue)'
action: warn
---

🔧 **You found a problem and are moving on without fixing it.**

Owner rule 2: if something is fixable, fix it — first.
- "Pre-existing" or "already broken on Master" is not a reason to leave it; fix it now if you can.
- If it truly cannot be fixed (no upstream release, needs a password), say exactly why and what would unblock it.
