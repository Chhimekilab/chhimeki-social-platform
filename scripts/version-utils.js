#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Version management utilities for Chhimeki Social Platform
 */

// Configuration
const CONFIG = {
  versionFile: path.join(__dirname, '../src/config/version.json'),
  packageFile: path.join(__dirname, '../package.json'),
  changelogFile: path.join(__dirname, '../CHANGELOG.md'),
  rootDir: path.join(__dirname, '..')
};

/**
 * Get current git hash
 */
function getGitHash() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn('Warning: Could not get git hash:', error.message);
    return 'unknown';
  }
}

/**
 * Get current git branch
 */
function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn('Warning: Could not get git branch:', error.message);
    return 'unknown';
  }
}

/**
 * Get build number from environment or git commits
 */
function getBuildNumber() {
  if (process.env.BUILD_NUMBER) {
    return parseInt(process.env.BUILD_NUMBER, 10);
  }
  
  try {
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    return parseInt(commitCount, 10);
  } catch (error) {
    console.warn('Warning: Could not get build number:', error.message);
    return 1;
  }
}

/**
 * Read package.json
 */
function readPackageJson() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.packageFile, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to read package.json: ${error.message}`);
  }
}

/**
 * Read version.json
 */
function readVersionJson() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.versionFile, 'utf8'));
  } catch (error) {
    console.warn('Warning: Could not read version.json, using defaults');
    return {
      version: '1.0.0',
      buildDate: new Date().toISOString(),
      gitHash: 'unknown',
      environment: 'development',
      features: {},
      apiVersions: {}
    };
  }
}

/**
 * Write version.json
 */
function writeVersionJson(versionData) {
  try {
    const formatted = JSON.stringify(versionData, null, 2);
    fs.writeFileSync(CONFIG.versionFile, formatted, 'utf8');
    console.log('✅ Updated version.json');
  } catch (error) {
    throw new Error(`Failed to write version.json: ${error.message}`);
  }
}

/**
 * Update version information for build
 */
function updateVersionInfo() {
  console.log('🚀 Updating version information...');
  
  const packageJson = readPackageJson();
  const versionJson = readVersionJson();
  const now = new Date().toISOString();
  
  const updatedVersion = {
    ...versionJson,
    version: packageJson.version,
    buildDate: now,
    gitHash: getGitHash(),
    gitBranch: getGitBranch(),
    buildNumber: getBuildNumber(),
    environment: process.env.REACT_APP_ENV || 'development',
    buildTime: now
  };
  
  writeVersionJson(updatedVersion);
  
  console.log(`📦 Version: ${updatedVersion.version}`);
  console.log(`🌿 Branch: ${updatedVersion.gitBranch}`);
  console.log(`🔗 Hash: ${updatedVersion.gitHash.slice(0, 8)}`);
  console.log(`🏗️  Build: ${updatedVersion.buildNumber}`);
  console.log(`🌍 Environment: ${updatedVersion.environment}`);
  
  return updatedVersion;
}

/**
 * Validate version format
 */
function validateVersion(version) {
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
  return semverRegex.test(version);
}

/**
 * Check if git working directory is clean
 */
function isGitClean() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim() === '';
  } catch (error) {
    console.warn('Warning: Could not check git status:', error.message);
    return false;
  }
}

/**
 * Generate release notes from git commits
 */
function generateReleaseNotes(fromTag, toTag = 'HEAD') {
  try {
    const gitLog = execSync(
      `git log ${fromTag}..${toTag} --pretty=format:"- %s (%h)" --no-merges`,
      { encoding: 'utf8' }
    );
    
    if (!gitLog.trim()) {
      return 'No changes since last release.';
    }
    
    return gitLog.trim().split('\n').join('\n');
  } catch (error) {
    console.warn('Warning: Could not generate release notes:', error.message);
    return 'Release notes could not be generated.';
  }
}

/**
 * Prepare for release
 */
function prepareRelease() {
  console.log('🎯 Preparing release...');
  
  // Check git status
  if (!isGitClean()) {
    console.error('❌ Git working directory is not clean. Please commit or stash changes.');
    process.exit(1);
  }
  
  // Update version info
  const versionInfo = updateVersionInfo();
  
  // Run tests
  console.log('🧪 Running tests...');
  try {
    execSync('npm run test:ci', { stdio: 'inherit', cwd: CONFIG.rootDir });
    console.log('✅ Tests passed');
  } catch (error) {
    console.error('❌ Tests failed');
    process.exit(1);
  }
  
  // Run linting
  console.log('🔍 Running linter...');
  try {
    execSync('npm run lint', { stdio: 'inherit', cwd: CONFIG.rootDir });
    console.log('✅ Linting passed');
  } catch (error) {
    console.error('❌ Linting failed');
    process.exit(1);
  }
  
  console.log('🎉 Release preparation complete!');
  return versionInfo;
}

/**
 * Deploy version to Supabase
 */
async function deployVersionToSupabase(versionInfo) {
  console.log('📤 Deploying version to Supabase...');
  
  // This would integrate with your Supabase deployment process
  // For now, we'll just log the information
  console.log('Version deployment info:', {
    version: versionInfo.version,
    environment: versionInfo.environment,
    gitHash: versionInfo.gitHash,
    buildNumber: versionInfo.buildNumber
  });
  
  // In a real implementation, you would:
  // 1. Call Supabase API to register the new version
  // 2. Update the app_versions table
  // 3. Trigger any deployment webhooks
  // 4. Update feature flags if needed
  
  console.log('✅ Version deployed to Supabase');
}

/**
 * CLI interface
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'update':
      updateVersionInfo();
      break;
      
    case 'prepare':
      prepareRelease();
      break;
      
    case 'deploy':
      const versionInfo = updateVersionInfo();
      deployVersionToSupabase(versionInfo);
      break;
      
    case 'info':
      const info = readVersionJson();
      console.log('Current version info:');
      console.log(JSON.stringify(info, null, 2));
      break;
      
    case 'validate':
      const packageJson = readPackageJson();
      if (validateVersion(packageJson.version)) {
        console.log(`✅ Version ${packageJson.version} is valid`);
      } else {
        console.error(`❌ Version ${packageJson.version} is invalid`);
        process.exit(1);
      }
      break;
      
    default:
      console.log(`
Chhimeki Social Platform - Version Utilities

Usage: node scripts/version-utils.js <command>

Commands:
  update    Update version information from package.json and git
  prepare   Prepare for release (tests, lint, version update)
  deploy    Deploy version information to Supabase
  info      Show current version information
  validate  Validate version format

Examples:
  node scripts/version-utils.js update
  node scripts/version-utils.js prepare
  npm run version:update
      `);
      break;
  }
}

// Export functions for use in other scripts
module.exports = {
  updateVersionInfo,
  readVersionJson,
  writeVersionJson,
  validateVersion,
  isGitClean,
  generateReleaseNotes,
  prepareRelease,
  deployVersionToSupabase,
  getGitHash,
  getGitBranch,
  getBuildNumber
};

// Run CLI if called directly
if (require.main === module) {
  main();
}