import React, { useState } from 'react';
import AIService from '../../services/ai';

const AIControls = ({ onServiceToggle }) => {
  const [config, setConfig] = useState({
    contentInterval: 5,
    trendsInterval: 15,
    enableModeration: true,
    qualityThreshold: 0.7
  });
  const [saving, setSaving] = useState(false);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      await AIService.updateConfig({
        scheduler: {
          contentInterval: config.contentInterval,
          trendsInterval: config.trendsInterval
        },
        moderation: {
          enabled: config.enableModeration,
          qualityThreshold: config.qualityThreshold
        }
      });
      alert('✅ Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('❌ Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const clearLogs = async () => {
    try {
      await AIService.clearLogs();
      alert('✅ Logs cleared successfully!');
    } catch (error) {
      console.error('Error clearing logs:', error);
      alert('❌ Failed to clear logs');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="text-3xl mr-2">🎛️</span>
          AI Controls
        </h2>
        <p className="text-gray-600 mt-1">
          Manage AI services and configuration
        </p>
      </div>

      {/* Service Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Service Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onServiceToggle('start')}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">▶️</span>
            Start AI Services
          </button>
          <button
            onClick={() => onServiceToggle('stop')}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">⏹️</span>
            Stop AI Services
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Generation Interval (minutes)
            </label>
            <input
              type="number"
              value={config.contentInterval}
              onChange={(e) => handleConfigChange('contentInterval', parseInt(e.target.value))}
              min="1"
              max="60"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trends Update Interval (minutes)
            </label>
            <input
              type="number"
              value={config.trendsInterval}
              onChange={(e) => handleConfigChange('trendsInterval', parseInt(e.target.value))}
              min="5"
              max="120"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Threshold
            </label>
            <input
              type="range"
              value={config.qualityThreshold}
              onChange={(e) => handleConfigChange('qualityThreshold', parseFloat(e.target.value))}
              min="0.1"
              max="1"
              step="0.1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low (0.1)</span>
              <span>Current: {config.qualityThreshold}</span>
              <span>High (1.0)</span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableModeration"
              checked={config.enableModeration}
              onChange={(e) => handleConfigChange('enableModeration', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="enableModeration" className="text-sm font-medium text-gray-700">
              Enable AI Moderation
            </label>
          </div>

          <button
            onClick={saveConfiguration}
            disabled={saving}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Manual Operations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Manual Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={clearLogs}
            className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🗑️</span>
            Clear Logs
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🔄</span>
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIControls;