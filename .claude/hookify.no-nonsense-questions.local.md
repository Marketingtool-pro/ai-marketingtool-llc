---
name: no-nonsense-questions
enabled: true
event: stop
# 2026-10-30: enabled. A plain `pattern:` on a stop rule is checked against an empty field and
# never fires; matching the `transcript` field does. Hard blocking stays in stop-gates.py / mt-guard.
conditions:
  - field: transcript
    operator: regex_match
    pattern: '(?i)(should i[ ?]|shall i[ ?]|do you want|want me to|would you like|which (one|option|approach)|let me know (if|whether|which)|can i proceed|ok to proceed|option [abc123][ .,:)?])'
action: warn
---

🚫 **You are ending with a question or a choice for the owner.**

Owner rules 4, 8, 9: no unnecessary questions, no multiple-choice, never end with "should I…?" / "want me to…?".

Pick the sensible option, say in one line what you assumed, and keep working until the task is finished. Only deleting/removing something needs the owner's OK.
