---
name: block-eas-build-without-permission
enabled: true
event: bash
pattern: eas\s+build
action: block
---

🛑 **EAS BUILD BLOCKED**

You are about to trigger an EAS build. This costs the user pay-as-you-go credits (100% of monthly allocation already used).

**User rule: NEVER build without explicit permission.**

The user has said repeatedly:
- "when i will permisson then used"
- "why build . not build without permission"
- "not build without my permisson"

**Required before running `eas build`:**
1. Ask the user explicitly: "Should I build now?"
2. Wait for a YES answer in plain language
3. Do NOT assume implicit permission from prior conversation

If the user has NOT said yes to building in THIS specific message exchange, do not run this command.
