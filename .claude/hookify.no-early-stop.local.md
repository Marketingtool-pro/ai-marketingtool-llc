---
name: no-early-stop
enabled: true
event: stop
# 2026-10-30: enabled. A plain `pattern:` on a stop rule is checked against an empty field and
# never fires; matching the `transcript` field does. Hard blocking stays in stop-gates.py / mt-guard.
conditions:
  - field: transcript
    operator: regex_match
    pattern: '(?i)(left (it|that|them|this)[^.]{0,20}for you|for you to (run|decide|fix|do)|you can (run|now run|try)|you(''ll| will) need to|next steps? for you|run this (command|yourself)|i(''ll| will) leave|out of scope|separate (pr|task|session)|follow[- ]up later|when you say|say \W?check|(set|setting) a [0-9-]+.?minute timer|i(''ll| will) (read|check|look)[^.]{0,40}(later|when (it|the timer)|again when))'
action: warn
---

⛔ **You are about to stop and hand work back to the owner.**

The owner has said: "not any agent 5 sec work stop", "not send command", "when problem — fixed first".

Before ending the turn:
1. If you can do it yourself, do it now — do not send the owner a command to run.
2. Re-run the failing command/check and confirm it now passes, with real output.
3. Only hand back what truly needs the owner: a password, a paid account, a browser login, or a deletion (owner rule 2) — and say exactly why.
