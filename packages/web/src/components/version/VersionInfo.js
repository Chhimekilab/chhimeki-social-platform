import React, { useState } from 'react';
import { Info, GitBranch, Calendar, Settings, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { 
  getVersionInfo, 
  getDisplayVersion, 
  isFeatureEnabled, 
  getReleaseNotesUrl,
  getDebugInfo,
  isDevelopment 
} from '../../utils/version';

const VersionInfo = ({ 
  showDetails = false, 
  showFeatures = false, 
  className = '',
  variant = 'compact' // 'compact', 'detailed', 'debug'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const versionInfo = getVersionInfo();

  const handleDebugCopy = () => {
    const debugInfo = getDebugInfo();
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    // You could add a toast notification here
    console.log('Debug info copied to clipboard');
  };

  if (variant === 'compact') {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        <span className="font-mono">{getDisplayVersion()}</span>
        {isDevelopment() && (
          <span className="ml-2 px-1 bg-yellow-100 text-yellow-800 rounded">
            DEV
          </span>
        )}
      </div>
    );
  }

  if (variant === 'debug' && isDevelopment()) {
    return (
      <div className={`bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-300 font-semibold">🐛 Debug Info</span>
          <button
            onClick={handleDebugCopy}
            className="text-green-400 hover:text-green-300 text-xs"
          >
            Copy
          </button>
        </div>
        <div className="space-y-1">
          <div>Version: {versionInfo.version}</div>
          <div>Environment: {versionInfo.environment}</div>
          <div>Git Hash: {versionInfo.gitHash}</div>
          <div>Build Time: {versionInfo.buildTime}</div>
          <div>Screen: {window.screen.width}x{window.screen.height}</div>
          <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Chhimeki Social Platform
            </h3>
            <p className="text-sm text-gray-500">
              Version {getDisplayVersion()}
            </p>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? '−' : '+'}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Version Details */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Git Hash:</span>
                <code className="text-xs bg-gray-100 px-1 rounded">
                  {versionInfo.gitHash.slice(0, 8)}
                </code>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Built:</span>
                <span className="text-xs text-gray-500">
                  {new Date(versionInfo.buildDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Environment:</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  versionInfo.environment === 'production' 
                    ? 'bg-green-100 text-green-800'
                    : versionInfo.environment === 'development'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {versionInfo.environment}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <a 
                  href={getReleaseNotesUrl(versionInfo.version)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Release Notes
                </a>
              </div>
            </div>

            {/* API Versions */}
            {versionInfo.apiVersions && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  API Versions
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(versionInfo.apiVersions).map(([api, version]) => (
                    <div key={api} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{api}:</span>
                      <code className="bg-gray-100 px-1 rounded">{version}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Flags */}
            {(showFeatures || isDevelopment()) && versionInfo.features && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Feature Flags
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(versionInfo.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center space-x-2">
                      {enabled ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-xs text-gray-600 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Development Tools */}
            {isDevelopment() && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={handleDebugCopy}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    Copy Debug Info
                  </button>
                  <button
                    onClick={() => console.table(versionInfo)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                  >
                    Log to Console
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple version badge component
export const VersionBadge = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-1 text-xs text-gray-500 ${className}`}>
      <span>v</span>
      <span className="font-mono">{getVersionInfo().version}</span>
      {isDevelopment() && (
        <span className="ml-1 px-1 bg-yellow-100 text-yellow-800 rounded text-xs">
          DEV
        </span>
      )}
    </div>
  );
};

// Footer version component
export const FooterVersion = ({ className = '' }) => {
  return (
    <div className={`text-center text-xs text-gray-500 ${className}`}>
      <div>
        Chhimeki Social Platform {getDisplayVersion()}
      </div>
      <div className="mt-1">
        Built with ❤️ using React & Supabase
      </div>
    </div>
  );
};

export default VersionInfo;