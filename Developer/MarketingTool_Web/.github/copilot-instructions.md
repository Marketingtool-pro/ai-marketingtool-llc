# MarketingTool Web Copilot Instructions

## Build, test, and lint commands

- `npm ci`
- `npm run dev`
- `npm start`
- `npm run build`
- `npm run preview`
- `npm test`

## High-level architecture

- This repository is the web app repo (`Marketingtool-pro/web-app-router-`). In the local workstation layout, the matching working copy is `/Users/anshsingh/Desktop/Developer/MarketingTool_Web`. The matching phone repo is `Marketingtool-pro/AiMarketingtool-pro-fbaf2fad`, with local working copy `/Users/anshsingh/Desktop/Developer/MarketingTool_Phone`.

- Treat `/Users/anshsingh/Desktop/Developer` as the single Marketingtool-pro organization workspace root. Keep the phone and web repos as the primary repos in that workspace.

- The web app uses a Vite-based React stack and has production-sensitive paid UI/dependency packages in `package.json` including MUI Pro packages. Treat package updates as product-impacting changes rather than casual maintenance edits.

- Shared product behavior can span both repos. If a web change touches auth, AI generation, data shape, webhook behavior, or other shared flows, inspect the phone repo too before changing code.

## Key conventions

- Make code changes in the matching workspace repo folders under `/Users/anshsingh/Desktop/Developer` so web-app work lands in `MarketingTool_Web` and phone-app work lands in `MarketingTool_Phone`.

- Keep both the web repo and the phone repo working trees clean and matched to their GitHub remotes after intended work is complete.

- Run a code review on meaningful changes before merge/push. Use the review flow on current diffs as a normal closing step.

- Default completion flow for intended code changes in this workspace: make the change, review the diffs, then merge/push the finished work unless the user explicitly says to stop earlier.

- Before changing code, read `SECURITY.md` if present and the relevant root-level `*.md` files that affect the task. Do not jump straight into edits without first reading repo guidance and security notes.

- Stay in the matching local workspace repo and do not jump to unrelated folders. If web work changes shared behavior, then read the phone repo too.

- Fix issues one-by-one, including very small bugs, before giving the explanation. Do not skip listed issues, do not bypass edge cases, and do not leave a partially-checked chain of fixes.

- Keep final explanations short and after the work. Do not spend turns on extra discussion when the user has asked for action.

- Treat `package.json`, lockfile, and dependency-version changes as production-sensitive. This app includes paid/licensed npm packages, so dependency updates must be intentional, reviewed, and not casually widened, removed, or downgraded.
