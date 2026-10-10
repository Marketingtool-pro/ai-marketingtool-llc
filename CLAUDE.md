# ai-marketingtool-llc

## Repo facts
- Default branch is `Master` (capital M). Lowercase `master` has unrelated history — open PRs with `--base Master`. CI workflows trigger on `Master`.
- Every GitHub Action must be pinned to a full commit SHA with a version comment (`uses: owner/action@<40-char sha> # vX.Y.Z`); tag refs like `@v4` fail at "Set up job".
- Commit with the noreply email `304695078+help772@users.noreply.github.com`; pushes with a private email are rejected.

## Apps
| Path | Stack | Verify |
|---|---|---|
| `/` | TypeScript (`@marketingtool-pro/ai-marketingtool-llc`) | `npm run typecheck` |
| `Developer/MarketingTool_Web` | Vite + React | `npm run build`, `npm test` (vitest) |
| `Developer/MarketingTool_Phone` | Expo 55 / React Native | `npx tsc --noEmit` |
| `Developer/MarketingTool_Phone/functions` | Firebase Functions + Genkit | `npm run build` (tsc) |

Web imports use the `@/` alias (`@/components/...`); bare `components/...` breaks `vite build`.

## Dependencies
- Relock with `npm install --package-lock-only --ignore-scripts --legacy-peer-deps` (same as `.github/workflows/relock.yml`).
- Security fixes go in `overrides` in each app's `package.json`. Check with `osv-scanner scan -L <path>/package-lock.json`.
- Known blocked findings (do not force majors): `@opentelemetry/core` 1.x (genkit pins `~1.25`), `image-size` 1.x (Expo metro), `braces` / `node-forge` (no fix released), dev-only `esbuild`, `ts-deepmerge`, `postcss-selector-parser`.
- CLI tools (`vercel`, `npm`, `forever`) belong in global installs, never in `dependencies`.
