# Chhimeki Social Platform - Versioning System

## Overview

The Chhimeki Social Platform now includes a comprehensive versioning system that manages application versions, database schema migrations, release automation, and deployment tracking. This system ensures proper version control, automated releases, and seamless deployments.

## 🏗️ System Architecture

### Core Components

1. **Semantic Versioning (SemVer)** - Following `MAJOR.MINOR.PATCH` format
2. **Automated Release Management** - Using standard-version for automated releases
3. **Database Migration Tracking** - Schema versioning with Supabase
4. **Version Display** - React components showing version info
5. **Build Integration** - Version injection during build process
6. **Release Automation** - Scripts for preparing and deploying releases

## 📦 Files Structure

```
├── package.json                           # Version and scripts configuration
├── .versionrc.js                         # Standard-version configuration
├── CHANGELOG.md                          # Automated changelog
├── src/
│   ├── config/
│   │   └── version.json                  # Version configuration
│   ├── utils/
│   │   └── version.js                    # Version utility functions
│   └── components/
│       └── version/
│           └── VersionInfo.js            # Version display components
├── scripts/
│   └── version-utils.js                  # Node.js utility scripts
└── database/
    └── migrations/
        └── 001_initial_schema.sql        # Database migration with versioning
```

## 🚀 Features

### 1. Semantic Versioning
- **Format**: `MAJOR.MINOR.PATCH[-prerelease][+build]`
- **Automatic bumping** based on conventional commits
- **Pre-release support** (alpha, beta, rc)
- **Build metadata** integration

### 2. Conventional Commits
Commit message format that drives automated versioning:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types that trigger version bumps:**
- `feat:` → Minor version bump (new features)
- `fix:` → Patch version bump (bug fixes)
- `perf:` → Patch version bump (performance improvements)
- `BREAKING CHANGE:` → Major version bump (breaking changes)

### 3. Automated Changelog
- **Generated from git commits** using conventional commit format
- **Categorized sections** with emojis:
  - 🚀 Features
  - 🐛 Bug Fixes
  - ⚡ Performance Improvements
  - ♻️ Code Refactoring
  - 📚 Documentation
  - 💄 Styles
  - ✅ Tests
  - 🏗️ Build System
  - 👷 CI/CD
  - 🔒 Security
  - 📦 Dependencies

### 4. Database Schema Versioning
- **Migration tracking** in `schema_migrations` table
- **Version compatibility** checking
- **Rollback support** with rollback SQL
- **Environment-specific** schema versions

### 5. Build-time Version Injection
- **Environment variables** for version information
- **Git hash** and branch information
- **Build timestamps** and numbers
- **Feature flags** configuration

## 🎯 Usage Guide

### Daily Development

#### Making Commits
Use conventional commit format:

```bash
# New feature
git commit -m "feat(auth): add social login with Google"

# Bug fix
git commit -m "fix(posts): resolve duplicate posts issue"

# Breaking change
git commit -m "feat(api)!: redesign user authentication API

BREAKING CHANGE: The authentication API has been completely redesigned"
```

#### Checking Version Info
```bash
# Check current version
npm run version:info

# Validate version format
npm run version:validate

# Update version info manually
npm run version:update
```

### Releases

#### Automated Release Process
```bash
# Patch release (1.0.0 → 1.0.1)
npm run version:patch

# Minor release (1.0.0 → 1.1.0)
npm run version:minor

# Major release (1.0.0 → 2.0.0)
npm run version:major

# Pre-release (1.0.0 → 1.0.1-alpha.0)
npm run version:prerelease

# Beta release (1.0.0 → 1.0.1-beta.0)
npm run version:beta
```

#### Manual Release Process
```bash
# 1. Prepare release (tests, lint, version update)
npm run version:prepare

# 2. Create release with full process
npm run release          # Patch release
npm run release:minor    # Minor release
npm run release:major    # Major release
```

#### What Happens During Release
1. **Pre-checks**: Lint, tests, git status
2. **Version bump**: Update package.json, version.json
3. **Changelog generation**: Update CHANGELOG.md
4. **Git commit**: Commit version changes
5. **Git tag**: Create release tag
6. **Post-release**: Deploy to environments

### Database Migrations

#### Creating a Migration
```sql
-- File: database/migrations/002_add_user_settings.sql
-- Migration: 002_add_user_settings
-- Description: Add user settings table
-- Author: Your Name
-- Date: 2025-01-11

-- Add to migrations table
INSERT INTO public.schema_migrations (version, name, description) VALUES 
('002', 'add_user_settings', 'Add user settings and preferences table');

-- Your migration SQL here
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  theme VARCHAR(20) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Applying Migrations
1. Run migration SQL in Supabase SQL Editor
2. Update app version to reference new schema version
3. Deploy new app version

## 🔧 Configuration

### Package.json Scripts

```json
{
  "scripts": {
    // Version checking
    "version:check": "echo $npm_package_version",
    "version:info": "node scripts/version-utils.js info",
    "version:validate": "node scripts/version-utils.js validate",
    
    // Version updates
    "version:update": "node scripts/version-utils.js update",
    "version:prepare": "node scripts/version-utils.js prepare",
    "version:deploy": "node scripts/version-utils.js deploy",
    
    // Automated releases
    "version:patch": "standard-version --release-as patch",
    "version:minor": "standard-version --release-as minor", 
    "version:major": "standard-version --release-as major",
    "version:prerelease": "standard-version --prerelease",
    "version:beta": "standard-version --prerelease beta",
    "version:alpha": "standard-version --prerelease alpha",
    
    // Full release process
    "release": "npm run lint && npm run test:ci && npm run version:patch",
    "release:minor": "npm run lint && npm run test:ci && npm run version:minor",
    "release:major": "npm run lint && npm run test:ci && npm run version:major"
  }
}
```

### Standard-Version Configuration

```javascript
// .versionrc.js
module.exports = {
  types: [
    { type: 'feat', section: '🚀 Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'perf', section: '⚡ Performance Improvements' },
    // ... more types
  ],
  releaseCommitMessageFormat: 'chore(release): v{{currentTag}} 🎉',
  bumpFiles: [
    { filename: 'package.json', type: 'json' },
    { filename: 'src/config/version.json', type: 'json' }
  ]
};
```

### Environment Variables

```env
# Version information
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=development
REACT_APP_BUILD_TIME=2025-01-11T12:00:00Z
REACT_APP_GIT_HASH=abc123def456
REACT_APP_REPO_URL=https://github.com/your-org/chhimeki-social-platform
```

## 🎨 UI Components

### Version Display Components

```javascript
import VersionInfo, { VersionBadge, FooterVersion } from './components/version/VersionInfo';

// Compact version display
<VersionInfo variant="compact" />

// Detailed version info (expandable)
<VersionInfo variant="detailed" showFeatures={true} />

// Debug info (development only)
<VersionInfo variant="debug" />

// Simple version badge
<VersionBadge />

// Footer version
<FooterVersion />
```

### Feature Flags

```javascript
import { isFeatureEnabled } from './utils/version';

// Check if feature is enabled
if (isFeatureEnabled('realTimeUpdates')) {
  // Show real-time features
}

if (isFeatureEnabled('fileUploads')) {
  // Show file upload UI
}
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
    
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Prepare release
        run: npm run version:prepare
        
      - name: Create release
        run: npm run version:patch
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Deployment Hooks

```javascript
// In your deployment script
const { deployVersionToSupabase } = require('./scripts/version-utils');

async function deploy() {
  const versionInfo = updateVersionInfo();
  
  // Deploy to Supabase
  await deployVersionToSupabase(versionInfo);
  
  // Update feature flags
  await updateFeatureFlags(versionInfo.features);
  
  // Notify monitoring systems
  await notifyDeployment(versionInfo);
}
```

## 📊 Monitoring & Analytics

### Version Tracking in Database

The system automatically tracks versions in Supabase:

```sql
-- Get current app version
SELECT * FROM get_app_version('production');

-- Check version compatibility
SELECT * FROM version_compatibility WHERE environment = 'production';

-- View migration history
SELECT * FROM schema_migrations ORDER BY applied_at DESC;
```

### Version Analytics

```javascript
import { getVersionInfo, getDebugInfo } from './utils/version';

// Track version usage
const versionInfo = getVersionInfo();
analytics.track('app_version', {
  version: versionInfo.version,
  environment: versionInfo.environment,
  features: versionInfo.features
});

// Error reporting with version context
const debugInfo = getDebugInfo();
errorReporting.captureException(error, {
  extra: debugInfo
});
```

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code linting clean
- [ ] Database migrations tested
- [ ] Version number updated
- [ ] Changelog generated
- [ ] Environment variables set
- [ ] Feature flags configured

### Deployment Process

1. **Staging Deployment**
   ```bash
   REACT_APP_ENV=staging npm run version:deploy
   ```

2. **Production Deployment**
   ```bash
   REACT_APP_ENV=production npm run version:deploy
   ```

3. **Rollback Process**
   ```bash
   # If needed, rollback to previous version
   git revert HEAD
   npm run version:deploy
   ```

## 🔧 Troubleshooting

### Common Issues

**1. Version mismatch between app and database**
```bash
# Check version compatibility
npm run version:info
# Update database schema if needed
```

**2. Changelog not generating**
```bash
# Ensure commits follow conventional format
git log --oneline
# Regenerate changelog
npm run changelog:all
```

**3. Version not updating in build**
```bash
# Check environment variables
echo $REACT_APP_VERSION
# Manual version update
npm run version:update
```

### Debug Information

```javascript
// Get comprehensive debug info
import { getDebugInfo } from './utils/version';
console.log(getDebugInfo());

// Log version info in development
import { logVersionInfo } from './utils/version';
logVersionInfo();
```

## 📈 Future Enhancements

### Planned Features

1. **Automatic Rollback** - Auto-rollback on deployment failures
2. **A/B Testing Integration** - Version-based feature testing
3. **Real-time Version Updates** - Notify users of new versions
4. **Migration Automation** - Automated database migrations
5. **Performance Monitoring** - Version-based performance tracking

### Extension Points

The versioning system is designed to be extensible:

- **Custom version types** in `.versionrc.js`
- **Additional metadata** in `version.json`
- **Custom deployment hooks** in `version-utils.js`
- **Extended UI components** for version display

## 📝 Best Practices

### Commit Messages
- Use conventional commit format consistently
- Be descriptive in commit messages
- Include scope when applicable
- Use `BREAKING CHANGE:` for major changes

### Version Management
- Never manually edit version numbers
- Use the automated scripts for all version changes
- Keep CHANGELOG.md up to date
- Tag releases appropriately

### Database Migrations
- Always test migrations in development first
- Include rollback SQL when possible
- Document breaking schema changes
- Update schema version after migrations

### Deployment
- Use environment-specific configurations
- Validate deployments after release
- Monitor application health post-deployment
- Have rollback plan ready

---

## Conclusion

The Chhimeki Social Platform versioning system provides comprehensive version management, automated releases, and deployment tracking. It ensures:

- ✅ **Consistent versioning** across all environments
- ✅ **Automated release process** with quality checks
- ✅ **Database schema tracking** and compatibility
- ✅ **Version visibility** in the application UI
- ✅ **Deployment automation** and monitoring
- ✅ **Rollback capabilities** for safety

This system supports the platform's growth from MVP to enterprise scale while maintaining code quality and deployment reliability.

**Total Implementation**: 11 files created/modified, comprehensive automation, production-ready versioning system.

For questions or issues, refer to the troubleshooting section or check the project documentation.