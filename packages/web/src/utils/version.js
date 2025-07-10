import versionConfig from '../config/version.json';

/**
 * Get the current application version
 * @returns {string} Current version
 */
export const getVersion = () => {
  return process.env.REACT_APP_VERSION || versionConfig.version || '1.0.0';
};

/**
 * Get the full version information
 * @returns {object} Complete version information
 */
export const getVersionInfo = () => {
  return {
    version: getVersion(),
    buildDate: versionConfig.buildDate,
    gitHash: versionConfig.gitHash || process.env.REACT_APP_GIT_HASH || 'unknown',
    environment: process.env.REACT_APP_ENV || versionConfig.environment || 'development',
    features: versionConfig.features,
    apiVersions: versionConfig.apiVersions,
    buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString()
  };
};

/**
 * Get a formatted version string for display
 * @returns {string} Formatted version string
 */
export const getDisplayVersion = () => {
  const version = getVersion();
  const env = process.env.REACT_APP_ENV || 'development';
  
  if (env === 'production') {
    return `v${version}`;
  }
  
  return `v${version}-${env}`;
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return versionConfig.features?.[featureName] || false;
};

/**
 * Get version comparison for updates
 * @param {string} currentVersion - Current version
 * @param {string} latestVersion - Latest available version
 * @returns {object} Comparison result
 */
export const compareVersions = (currentVersion, latestVersion) => {
  const current = parseVersion(currentVersion);
  const latest = parseVersion(latestVersion);
  
  if (current.major < latest.major) return { hasUpdate: true, type: 'major' };
  if (current.major > latest.major) return { hasUpdate: false, type: 'newer' };
  
  if (current.minor < latest.minor) return { hasUpdate: true, type: 'minor' };
  if (current.minor > latest.minor) return { hasUpdate: false, type: 'newer' };
  
  if (current.patch < latest.patch) return { hasUpdate: true, type: 'patch' };
  if (current.patch > latest.patch) return { hasUpdate: false, type: 'newer' };
  
  return { hasUpdate: false, type: 'current' };
};

/**
 * Parse a semantic version string
 * @param {string} version - Version string to parse
 * @returns {object} Parsed version object
 */
const parseVersion = (version) => {
  const cleaned = version.replace(/^v/, '');
  const parts = cleaned.split('-')[0].split('.');
  
  return {
    major: parseInt(parts[0] || '0', 10),
    minor: parseInt(parts[1] || '0', 10),
    patch: parseInt(parts[2] || '0', 10),
    prerelease: cleaned.includes('-') ? cleaned.split('-')[1] : null
  };
};

/**
 * Get version info for debugging
 * @returns {object} Debug information
 */
export const getDebugInfo = () => {
  const info = getVersionInfo();
  
  return {
    ...info,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
};

/**
 * Check if the app is running in development mode
 * @returns {boolean} Whether in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.REACT_APP_ENV === 'development';
};

/**
 * Check if the app is running in production mode
 * @returns {boolean} Whether in production mode
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production' && 
         process.env.REACT_APP_ENV === 'production';
};

/**
 * Get release notes URL for a specific version
 * @param {string} version - Version to get release notes for
 * @returns {string} URL to release notes
 */
export const getReleaseNotesUrl = (version) => {
  const baseUrl = process.env.REACT_APP_REPO_URL || 'https://github.com/your-org/chhimeki-social-platform';
  return `${baseUrl}/releases/tag/v${version}`;
};

/**
 * Log version information to console
 */
export const logVersionInfo = () => {
  if (isDevelopment()) {
    const info = getVersionInfo();
    console.group('🎯 Chhimeki Social Platform - Version Info');
    console.log('Version:', info.version);
    console.log('Environment:', info.environment);
    console.log('Build Date:', info.buildDate);
    console.log('Git Hash:', info.gitHash);
    console.log('Features:', info.features);
    console.log('API Versions:', info.apiVersions);
    console.groupEnd();
  }
};

// Auto-log version info in development
if (isDevelopment() && typeof window !== 'undefined') {
  setTimeout(logVersionInfo, 1000);
}

export default {
  getVersion,
  getVersionInfo,
  getDisplayVersion,
  isFeatureEnabled,
  compareVersions,
  getDebugInfo,
  isDevelopment,
  isProduction,
  getReleaseNotesUrl,
  logVersionInfo
};