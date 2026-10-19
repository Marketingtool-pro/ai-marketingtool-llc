---
name: fix-problems-first
enabled: true
event: stop
pattern: "(?i)(still (fails?|failing|broken|errors?)|not (yet )?fixed|pre-existing|already (broken|failing) (on|in) (master|main)|remaining (issues|errors|failures)|unrelated (failure|error)|known issue)"
action: warn
---

🔧 **You found a problem and are moving on without fixing it.**

Owner rule 2: if something is fixable, fix it — first.
- "Pre-existing" or "already broken on Master" is not a reason to leave it; fix it now if you can.
- If it truly cannot be fixed (no upstream release, needs a password), say exactly why and what would unblock it.
