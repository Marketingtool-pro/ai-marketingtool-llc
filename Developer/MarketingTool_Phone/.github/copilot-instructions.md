# MarketingTool Copilot Instructions

## Build, test, and lint commands

### App root
- `npm ci`
- `npm start`
- `npm run ios`
- `npm run android`
- `npm run web`
- `npm run doctor`
- `npx tsc --noEmit` — this is the TypeScript check used by `.github/workflows/code-quality.yml`
- CI calls `npm run lint --if-present` and `npm test --if-present`, but the root `package.json` does not currently define `lint` or `test` scripts. Do not assume a runnable root lint/test suite exists.

### Firebase Functions package
- `cd functions && npm ci`
- `cd functions && npm run build`
- `cd functions && npm run lint`
- `cd functions && npm run serve`
- `cd functions && npm run shell`
- There is a checked-in spec at `functions/integration-tests/integration-test.spec.ts`, but there is no checked-in `test` script or runner config for it. Do not invent a single-test command unless you wire the runner first.

### Shipping / EAS
- Root scripts exist for store builds: `npm run ship`, `npm run ship:ios`, `npm run ship:android`
- GitHub Actions also runs `eas build` / `eas submit` from `.github/workflows/production-deploy.yml`
- Do **not** trigger EAS builds or submissions without explicit user approval; this repo has local `.claude` guardrails for that

## High-level architecture

- This repository is the phone app repo (`Marketingtool-pro/AiMarketingtool-pro-fbaf2fad`). In the local workstation layout, the matching working copy is `/Users/anshsingh/Desktop/Developer/MarketingTool_Phone`. The matching web repo is `Marketingtool-pro/web-app-router-`, with local working copy `/Users/anshsingh/Desktop/Developer/MarketingTool_Web`. Keep both local repos aligned with their GitHub repos and avoid drifting work across duplicate copies. For auth, AI generation, or webhook-driven behavior, expect fixes to sometimes require checking both repos.

- Treat `/Users/anshsingh/Desktop/Developer` as the single Marketingtool-pro organization workspace root. Keep the two product repos (`MarketingTool_Phone` and `MarketingTool_Web`) as the primary repos in that workspace rather than replacing them with a different structure.

- The mobile app is an Expo / React Native app rooted at `App.tsx` and `src/navigation/AppNavigator.tsx`. Startup is intentionally staged: the splash screen stays visible while fonts, auth bootstrap, and Firebase App Check initialize; Firebase messaging, analytics, and crashlytics are deferred until after first layout to avoid Android startup ANRs.

- Auth is hybrid. `src/services/appwrite.ts` is the main account/database client, while phone OTP verification happens through `src/services/firebaseAuth.ts`. After Firebase verifies the phone number, `src/store/authStore.ts` calls the Appwrite `phone-session` function to mint the Appwrite session used by the rest of the app.

- AI generation is also hybrid. `src/store/toolsStore.ts` loads the 314-tool catalog from `src/data/tools.js`, derives categories/free-vs-pro/icon overrides locally, and calls `src/services/aiService.ts`. That AI service currently prefers Appwrite Function `tool-executor` and falls back to Next.js APIs on `https://app.marketingtool.pro`. The separate `functions/` package contains Firebase Functions + Genkit callable flows (`toolExecutor`, `chatAi`), but the mobile app is not wired directly to those callables today.

- Backend code is split across two server packages:
  - `functions/`: Firebase Functions v2 + Genkit + Firestore
  - `appwrite-functions/msg91-proxy`: Appwrite function for Bird-backed OTP flows

- Do not assume a single backend owns all state. Profiles and Appwrite sessions live in Appwrite, while some AI/chat code writes to Firestore, and the mobile client still contains Appwrite-first AI and auth wiring.

## Key conventions

- When work spans phone + web behavior, inspect both repos and carry the intended changes through to committed/merged state instead of updating only one side.

- Make code changes in the matching workspace repo folders under `/Users/anshsingh/Desktop/Developer` so phone-app work lands in `MarketingTool_Phone` and web-app work lands in `MarketingTool_Web`.

- Keep both the phone repo and the web repo working trees clean and matched to their GitHub remotes after intended work is complete.

- Run a code review on meaningful changes before merge/push. Use the review flow on current diffs as a normal closing step, not only when the user separately asks for review.

- Default completion flow for intended code changes in this workspace: make the change, review the diffs, then merge/push the finished work unless the user explicitly says to stop earlier.

- Before changing code, read `SECURITY.md` and the relevant root-level `*.md` files that affect the task. Do not jump straight into edits without first reading the repo guidance and security notes.

- Stay in the matching local workspace repo and do not jump to unrelated folders. If phone work changes shared behavior, then read the web repo too; if web work changes shared behavior, then read the phone repo too.

- Fix issues one-by-one, including very small bugs, before giving the explanation. Do not skip listed issues, do not bypass edge cases, and do not leave a partially-checked chain of fixes.

- Keep final explanations short and after the work. Do not spend turns on extra discussion when the user has asked for action.

- Treat `package.json`, lockfile, and dependency-version changes as production-sensitive. Both apps are paid/production apps, so npm dependency updates must be intentional, reviewed, and not casually widened or downgraded.

- `app.json` is the authoritative Expo plugin list. `app.config.js` only appends require-based plugins that cannot be expressed as plain JSON. Do **not** replace `config.plugins` in `app.config.js`, or you will silently drop critical Firebase / notification / App Check plugins.

- Keep `plugins/withFirebaseDeferredInit.js` and the `deferredInit()` logic in `App.tsx` aligned. The Android manifest plugin disables Firebase auto-init at startup, and `App.tsx` re-enables messaging/analytics/crashlytics after the first layout. Changing one side without the other can reintroduce cold-start hangs and ANRs.

- Do not reintroduce `expo-status-bar` or older direct system-bar color APIs. This app intentionally uses `react-native-edge-to-edge` and `<SystemBars />` because of Android 15 behavior.

- The tool catalog source of truth is `src/data/tools.js`, not a hardcoded array inside a screen. `src/store/toolsStore.ts` derives category mapping, free/pro gating, and unique icon assignment from tool slugs and badges. Preserve slug stability and the web-app-aligned category mapping when editing tool metadata.

- Appwrite function responses are not uniform in this codebase: they may arrive as an object, a JSON string, or plain text. Reuse the normalization pattern in `src/store/authStore.ts` / `src/services/aiService.ts` instead of assuming one response shape.

- The reviewer bypass values for phone auth are intentional and must stay aligned across client and backend code. `src/store/authStore.ts` and `appwrite-functions/msg91-proxy/src/main.js` both depend on the review test phone / OTP flow.

- Keep secrets out of source. Firebase Genkit uses Secret Manager (`defineSecret(...)` in `functions/src/index.ts`), and the Appwrite function expects env vars instead of inline credentials.

- Prefer the current runtime code over older planning docs. The repo contains historical design/plan files under `docs/superpowers/` that describe earlier OTP and backend paths; verify the live wiring in `authStore.ts`, `firebaseAuth.ts`, `aiService.ts`, and the backend packages before changing cross-cutting flows.
