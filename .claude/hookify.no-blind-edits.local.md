---
name: no-blind-edits
enabled: true
event: file
pattern: .*
action: warn
---

✋ **You are editing a file. Have you read it in full first?**

Owner rule: no blind work.
- If you have not opened this file with Read in this session, stop and read it completely before this edit.
- After the edit, open it again and confirm the final content is correct (the mt-guard hook checks this before you finish).
