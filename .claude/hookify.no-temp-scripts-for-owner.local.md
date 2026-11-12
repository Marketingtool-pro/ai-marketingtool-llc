---
name: no-temp-scripts-for-owner
enabled: true
event: stop
# 2026-10-30: enabled. A plain `pattern:` on a stop rule is checked against an empty field and
# never fires; matching the `transcript` field does. Hard blocking stays in stop-gates.py / mt-guard.
conditions:
  - field: transcript
    operator: regex_match
    pattern: '(?i)(claude/jobs/[^/ ]+/tmp/|/tmp/)[^ ]*[.](sh|py)'
action: warn
---

You are handing the owner a file that lives in a session temp folder.

The owner said "tem folder": ~/.claude/jobs/<id>/tmp and /tmp are deleted with the session, so the command stops working later.

Before ending the turn:
1. Move the script somewhere permanent (for Claude/Mac config: ~/.claude/scripts/; for project work: inside ~/ai-marketingtool-llc).
2. Test it from the new path.
3. Give the owner the permanent path only.
