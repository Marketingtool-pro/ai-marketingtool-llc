---
name: warn-planning-docs
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: docs/superpowers/(specs|plans)/.*\.md$
action: warn
---

⚠️ **You are writing a PLANNING/SPEC document.**

The user has rejected this approach repeatedly in this project:
- "what the hell" (when writing specs)
- "this is why can you clear . why ask"
- "why quiz send"
- "other next agent all fuked"

**User wants ACTION, not plans.**

If the user said "go ahead", "just do it", "start work", or gave a summary of what they want — skip the planning doc and implement directly.

Only write plans/specs if the user EXPLICITLY asks for a plan or spec in this message.
