import React, { useState, useEffect } from 'react';
import AIService from '../../services/ai';

const RealTimeStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [activeConnections, setActiveConnections] = useState(0);

  useEffect(() => {
    loadConnectionStatus();
    
    // Subscribe to real-time events
    const unsubscribes = [
      AIService.subscribeToAIEvents('new_comment', handleNewEvent),
      AIService.subscribeToAIEvents('ai_post_generated', handleNewEvent),
      AIService.subscribeToAIEvents('live_interaction', handleNewEvent),
      AIService.subscribeToAIEvents('user_typing', handleNewEvent)
    ];

    // Update status every 5 seconds
    const interval = setInterval(loadConnectionStatus, 5000);

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe && unsubscribe());
      clearInterval(interval);
    };
  }, []);

  const loadConnectionStatus = async () => {
    try {
      const status = AIService.services.realTimeService.getConnectionStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error loading connection status:', error);
    }
  };

  const handleNewEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      type: eventData.type || 'unknown',
      data: eventData,
      timestamp: new Date().toISOString()
    };
    
    setLiveEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'new_comment': return '💬';
      case 'ai_post_generated': return '🤖';
      case 'live_interaction': return '👆';
      case 'user_typing': return '⌨️';
      default: return '📡';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'new_comment': return 'bg-blue-100 text-blue-800';
      case 'ai_post_generated': return 'bg-green-100 text-green-800';
      case 'live_interaction': return 'bg-purple-100 text-purple-800';
      case 'user_typing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionColor = (connected) => {
    return connected ? 'text-green-600' : 'text-red-600';
  };

  const simulateEvent = () => {
    const eventTypes = ['new_comment', 'ai_post_generated', 'live_interaction', 'user_typing'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const mockEvent = {
      type: randomType,
      content: `Simulated ${randomType} event`,
      user_id: `user-${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toISOString()
    };
    
    handleNewEvent(mockEvent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-3xl mr-2">⚡</span>
            Real-Time Status
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor live connections and real-time events
          </p>
        </div>
        <button
          onClick={simulateEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🎭 Simulate Event
        </button>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getConnectionColor(connectionStatus?.connected)}`}>
              {connectionStatus?.connected ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {connectionStatus?.connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {connectionStatus?.activeConnections || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Connections</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {connectionStatus?.liveInteractions || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Live Interactions</div>
          </div>
        </div>
      </div>

      {/* WebSocket Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">WebSocket Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Connection Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${getConnectionColor(connectionStatus?.connected)}`}>
                  {connectionStatus?.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connection Attempts:</span>
                <span className="font-medium">{connectionStatus?.connectionAttempts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URL:</span>
                <span className="font-medium text-xs">ws://localhost:3001</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Subscriptions</h4>
            <div className="space-y-1">
              {connectionStatus?.subscriptions?.map((sub, index) => (
                <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {sub}
                </div>
              )) || <div className="text-sm text-gray-500">No active subscriptions</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Live Events Feed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Live Events Feed</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {liveEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📡</div>
              <p>No live events yet</p>
              <p className="text-sm">Events will appear here as they happen</p>
            </div>
          ) : (
            liveEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {event.data.content || event.data.message || JSON.stringify(event.data).substring(0, 100)}
                  </p>
                  {event.data.user_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      User: {event.data.user_id}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Real-Time Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {liveEvents.filter(e => e.type === 'new_comment').length}
            </div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {liveEvents.filter(e => e.type === 'ai_post_generated').length}
            </div>
            <div className="text-sm text-gray-600">AI Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {liveEvents.filter(e => e.type === 'live_interaction').length}
            </div>
            <div className="text-sm text-gray-600">Interactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {liveEvents.filter(e => e.type === 'user_typing').length}
            </div>
            <div className="text-sm text-gray-600">Typing Events</div>
          </div>
        </div>
      </div>

      {/* Connection Health */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Connection Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Connection Status</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {connectionStatus?.connected ? 'Healthy' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Event Processing</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${liveEvents.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium">
                {liveEvents.length > 0 ? 'Active' : 'Idle'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Auto-reconnect</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStatus;