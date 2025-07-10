module.exports = {
  // Conventional commits configuration
  types: [
    { type: 'feat', section: '🚀 Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'perf', section: '⚡ Performance Improvements' },
    { type: 'refactor', section: '♻️ Code Refactoring' },
    { type: 'docs', section: '📚 Documentation' },
    { type: 'style', section: '💄 Styles' },
    { type: 'test', section: '✅ Tests' },
    { type: 'build', section: '🏗️ Build System' },
    { type: 'ci', section: '👷 CI/CD' },
    { type: 'security', section: '🔒 Security' },
    { type: 'deps', section: '📦 Dependencies' },
    { type: 'revert', section: '⏪ Reverts' },
    { type: 'chore', hidden: true }
  ],

  // Release commit message format
  releaseCommitMessageFormat: 'chore(release): v{{currentTag}} 🎉',

  // Skip asking for confirmation
  skip: {
    bump: false,
    changelog: false,
    commit: false,
    tag: false
  },

  // Files to update with new version
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json'
    },
    {
      filename: 'package-lock.json',
      type: 'json'
    },
    {
      filename: 'src/config/version.json',
      type: 'json'
    }
  ],

  // Scripts to run during release process
  scripts: {
    prebump: 'echo "🚀 Preparing new release for Chhimeki Social Platform..."',
    postbump: 'echo "✅ Version bumped to {{nextRelease.version}}"',
    prechangelog: 'echo "📝 Generating changelog..."',
    postchangelog: 'echo "✅ Changelog updated successfully"',
    precommit: 'npm run lint && npm run format && echo "🔍 Running final checks..."',
    posttag: 'echo "🏷️  Release tagged: {{nextRelease.gitTag}}"'
  },

  // Header for changelog
  header: '# Chhimeki Social Platform - Changelog\n\nAll notable changes to this project will be documented in this file.\n\n',

  // Comparison URL template for GitHub
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  
  // Issue URL template for GitHub
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',

  // Commit URL template for GitHub  
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',

  // Release commit search
  releaseCommitMessageFormat: 'chore(release): v{{currentTag}}',

  // Tag prefix
  tagPrefix: 'v',

  // Preset for conventional commits
  preset: 'angular'
};