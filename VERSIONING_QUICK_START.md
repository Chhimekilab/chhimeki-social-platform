# Versioning System - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Check Current Version
```bash
npm run version:info
```

### 2. Make Changes Using Conventional Commits
```bash
# New feature
git commit -m "feat(auth): add Google login"

# Bug fix
git commit -m "fix(posts): resolve loading issue"

# Breaking change
git commit -m "feat(api)!: redesign user API

BREAKING CHANGE: User API endpoint structure changed"
```

### 3. Create a Release
```bash
# Patch release (1.0.0 → 1.0.1)
npm run version:patch

# Minor release (1.0.0 → 1.1.0) 
npm run version:minor

# Major release (1.0.0 → 2.0.0)
npm run version:major
```

### 4. Full Release with Tests
```bash
# Runs tests, lint, and creates patch release
npm run release

# Minor release with full checks
npm run release:minor

# Major release with full checks
npm run release:major
```

## 📋 Daily Commands

| Command | Description |
|---------|-------------|
| `npm run version:info` | Show current version info |
| `npm run version:update` | Update version from git |
| `npm run version:validate` | Validate version format |
| `npm run version:prepare` | Prepare for release (tests, lint) |
| `npm run changelog` | Generate changelog |

## 🎯 Commit Types

| Type | Effect | Example |
|------|--------|---------|
| `feat:` | Minor bump | `feat(auth): add social login` |
| `fix:` | Patch bump | `fix(ui): resolve button styling` |
| `perf:` | Patch bump | `perf(api): optimize queries` |
| `BREAKING CHANGE:` | Major bump | See full example above |
| `docs:` | No bump | `docs: update README` |
| `test:` | No bump | `test: add user tests` |
| `chore:` | No bump | `chore: update dependencies` |

## 🔧 Version Display in App

The app automatically shows version info in the footer. For custom display:

```javascript
import VersionInfo, { VersionBadge } from './components/version/VersionInfo';

// Simple badge
<VersionBadge />

// Detailed info
<VersionInfo variant="detailed" showFeatures={true} />

// Debug info (dev only)
<VersionInfo variant="debug" />
```

## 🎨 Feature Flags

Check if features are enabled:

```javascript
import { isFeatureEnabled } from './utils/version';

if (isFeatureEnabled('realTimeUpdates')) {
  // Show real-time UI
}
```

Update features in `src/config/version.json`:

```json
{
  "features": {
    "realTimeUpdates": true,
    "fileUploads": false,
    "pushNotifications": true
  }
}
```

## 🚨 Emergency Rollback

If something goes wrong:

```bash
# Revert the release commit
git revert HEAD

# Or reset to previous tag
git reset --hard v1.0.0

# Update version info
npm run version:update
```

## 📊 View Release History

```bash
# View changelog
cat CHANGELOG.md

# View git tags
git tag -l

# View release commits
git log --oneline --grep="chore(release)"
```

## 🔄 CI/CD Integration

The system works with any CI/CD. Example GitHub Action:

```yaml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run test:ci
      - run: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 🆘 Troubleshooting

**Version not updating?**
```bash
npm run version:update
```

**Changelog empty?**
```bash
# Check commit format
git log --oneline
# Regenerate
npm run changelog:all
```

**Tests failing?**
```bash
# Run individually
npm run lint
npm run test:ci
npm run format
```

## 📚 Learn More

- **Full Documentation**: `VERSIONING_SYSTEM.md`
- **Conventional Commits**: https://conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/

---

**You're ready to go!** Start making commits with conventional format and the system will handle the rest automatically. 🎉