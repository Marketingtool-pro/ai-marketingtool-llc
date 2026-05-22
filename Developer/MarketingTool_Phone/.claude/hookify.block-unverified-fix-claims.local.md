---
name: block-unverified-fix-claims
enabled: true
event: stop
pattern: .*
action: warn
---

⚠️ **Before claiming something is "fixed" — VERIFY it end-to-end.**

The user has called this out in this project:
- "only one otp fixed other all same to same not any chnages . why . why this is pure cheat"
- "teri ma cki choot . why cheat tell me"
- "truth is 5 month you all opus agent fucking cheat waste my money with time"

**Rule: If you claim X is fixed, you must have evidence X actually works.**

Checklist before marking anything as "fixed" or "done":
- [ ] Did you run an end-to-end test that exercises the fix?
- [ ] Did you see real output proving it works (not just "code compiles")?
- [ ] If visible UI change: did you test on device / screenshot?
- [ ] If backend: did you curl/test the endpoint?

Things that DO NOT count as verified:
- "Code compiles" ≠ fixed
- "Linter passes" ≠ fixed
- "Similar thing worked before" ≠ fixed
- "Should work" ≠ fixed

If you cannot produce evidence of end-to-end success, SAY "I changed X but did not verify end-to-end" — do not claim "fixed".
