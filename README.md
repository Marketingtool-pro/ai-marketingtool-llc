# @marketingtool-pro/ai-marketingtool-llc

Private npm package for the Marketingtool-pro organization, published through GitHub Packages.

## Local install/auth

Set a GitHub token in your shell before installing or publishing:

```bash
export GITHUB_TOKEN=YOUR_GITHUB_TOKEN
```

This repo's `.npmrc` is already configured for the `@marketingtool-pro` scope.

## Publish

```bash
npm publish
```

Or publish from GitHub Actions with the `Publish Package` workflow.

## Full project workflow control

This repo is also the control repo for the full Marketingtool-pro project.

### Required secret

Add this Actions secret in `Marketingtool-pro/ai-marketingtool-llc`:

- `ORG_WORKFLOW_TOKEN`: GitHub token with access to the private org repos and `workflow` permission

### Manual run

Run the master workflow from GitHub or with GitHub CLI:

```bash
gh workflow run full-project.yml -f target=full -f phone_ref=main -f web_ref=main
```

Optional deploy flags:

```bash
gh workflow run full-project.yml -f target=full -f phone_ref=main -f web_ref=main -f run_phone_deploy=true -f run_web_deploy=false
```

Use `gh run watch` to follow progress.
