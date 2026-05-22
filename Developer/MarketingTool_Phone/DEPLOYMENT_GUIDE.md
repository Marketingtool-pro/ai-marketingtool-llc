# Deployment Pipeline Setup Guide

## Overview
This deployment pipeline provides automated CI/CD for the Marketing AI app across iOS, Android, and backend services.

## GitHub Actions Workflows

### 1. Build and Test (`build-and-test.yml`)
- Runs on push to `main` and `develop`, and on pull requests
- Installs dependencies
- Runs linting and tests
- Builds preview versions on `develop` branch via EAS

### 2. Production Deploy (`production-deploy.yml`)
- Triggered on push to `main` or version tags
- Builds production binaries for iOS and Android
- Automatically submits to Apple App Store and Google Play Store
- Requires `EXPO_TOKEN` and `APPLE_APP_SPECIFIC_PASSWORD` secrets

### 3. Code Quality (`code-quality.yml`)
- Runs TypeScript type checking
- Performs npm audit for security vulnerabilities
- Verifies dependency integrity

## Setup Instructions

### Prerequisites
1. GitHub repository with this project
2. EAS Account (https://expo.dev)
3. Expo CLI: `npm install -g eas-cli`

### 1. Generate Secrets

```bash
# Generate Expo token
eas credentials

# Copy the token from EAS dashboard
# Navigate to: https://expo.dev/settings/personal-access-tokens
```

### 2. Add GitHub Secrets
In your GitHub repository settings (Settings → Secrets and variables → Actions):

```
EXPO_TOKEN=<your_eas_token>
APPLE_APP_SPECIFIC_PASSWORD=<your_app_specific_password>
```

### 3. Update EAS Configuration
Update `eas.json` with your build profiles:

```bash
eas build:configure
```

### 4. Configure Environment Variables
1. Copy `.env.production` to `.env` in your deployment environment
2. Fill in all required values (database passwords, API keys, etc.)
3. **DO NOT** commit `.env` to version control

### 5. Set Up Backend Infrastructure (Optional)

Deploy backend services using Docker Compose:

```bash
# Development
docker compose -f docker-compose.dev.yml up -d

# Production
docker compose -f docker-compose.prod.yml up -d
```

### 6. Branch Strategy

- **`main`** branch: Production releases
  - Merges trigger production builds and store submissions
  - Use semantic versioning tags (v1.0.0)
  
- **`develop`** branch: Staging/preview builds
  - Every push builds preview versions
  - Good for testing before production release

- **Feature branches**: Standard Git flow
  - Create branches from `develop`
  - PR to `develop` for code review
  - Triggers linting and tests only

## Build Profiles

### Development
```bash
eas build --platform all --profile development
```
- For development client testing
- Includes debug symbols
- Faster builds

### Preview
```bash
eas build --platform all --profile preview
```
- For testing on real devices
- Internal distribution only
- Automated on develop branch

### Production
```bash
eas build --platform all --profile production
```
- For App Store/Play Store submission
- Optimized and signed
- Triggered on main branch

## Manual Deployment

### Build without submission
```bash
eas build --platform all --profile production --non-interactive
```

### Submit after building
```bash
eas submit --platform all --profile production --non-interactive
```

### Full build + submit cycle
```bash
eas build --platform all --profile production --non-interactive && \
eas submit --platform all --profile production --non-interactive
```

## Monitoring and Debugging

### View Build Logs
```bash
# List builds
eas builds

# View specific build
eas build:view <build-id>
```

### Check Submission Status
```bash
# List submissions
eas submissions

# View specific submission
eas submission:view <submission-id>
```

### GitHub Actions Logs
Navigate to: **Actions** → select workflow → view build logs

## Troubleshooting

### "Build failed: Provisioning profile not found"
- Run `eas credentials` and configure iOS provisioning
- Ensure Bundle ID matches `app.json`

### "Build failed: Keystore not found (Android)"
- Run `eas credentials` and configure Android Keystore
- Ensure package name matches `app.json`

### "Submission failed: App Store Connect rejected"
- Check App Store Connect logs
- Verify bundle version is incremented
- Review app review guidelines

### GitHub Actions Secret Issues
- Verify secret names match workflow files exactly
- Secrets are case-sensitive
- Re-check after adding/updating secrets

## Versioning

Version bumping workflow:

```bash
# On main branch
npm version patch    # 1.3.3 → 1.3.4
npm version minor    # 1.3.3 → 1.4.0
npm version major    # 1.3.3 → 2.0.0
git push --tags
```

This triggers the production deployment pipeline automatically.

## Security Best Practices

1. **Never commit secrets** (.env files, API keys)
2. **Rotate credentials regularly** on Expo and Apple/Google developer accounts
3. **Review deployment logs** for security issues
4. **Enable two-factor authentication** on Expo, Apple, and Google accounts
5. **Limit GitHub Actions permissions** to necessary scopes
6. **Use environment-specific secrets** (dev, staging, production)

## Next Steps

1. **Set up CI/CD monitoring**: Integrate with Slack/Discord for build notifications
2. **Add automated testing**: Expand test coverage before deployment
3. **Set up metrics**: Monitor app crashes, performance, and user analytics
4. **Configure rollback**: Plan versioning strategy for quick rollbacks
5. **Document runbooks**: Create runbooks for common incidents
