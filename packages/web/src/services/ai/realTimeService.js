import { v4 as uuidv4 } from 'uuid';

// Mock WebSocket class for development
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1; // OPEN
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
    this.listeners = {};
    
    // Simulate connection
    setTimeout(() => {
      if (this.onopen) this.onopen({ type: 'open' });
      this.emit('open', { type: 'open' });
    }, 100);
  }
  
  send(data) {
    console.log('📡 Mock WebSocket sending:', JSON.parse(data));
    
    // Simulate echo response
    setTimeout(() => {
      const message = JSON.parse(data);
      this.receive({
        type: 'echo',
        data: message,
        timestamp: new Date().toISOString()
      });
    }, 50);
  }
  
  close() {
    this.readyState = 3; // CLOSED
    if (this.onclose) this.onclose({ type: 'close' });
    this.emit('close', { type: 'close' });
  }
  
  receive(data) {
    const event = {
      type: 'message',
      data: JSON.stringify(data)
    };
    
    if (this.onmessage) this.onmessage(event);
    this.emit('message', event);
  }
  
  addEventListener(type, listener) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }
  
  removeEventListener(type, listener) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(l => l !== listener);
    }
  }
  
  emit(type, event) {
    if (this.listeners[type]) {
      this.listeners[type].forEach(listener => listener(event));
    }
  }
}

// Global WebSocket connection
let globalSocket = null;
let connectionAttempts = 0;
const maxReconnectAttempts = 5;

// Active connections and subscriptions
const activeConnections = new Map();
const subscriptions = new Map();
const liveInteractions = new Map();

/**
 * Initialize WebSocket connection
 */
export const initializeRealTimeConnection = () => {
  try {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
    
    // Use mock WebSocket for development
    globalSocket = new MockWebSocket(wsUrl);
    
    // In production, use real WebSocket:
    // globalSocket = new WebSocket(wsUrl);
    
    globalSocket.onopen = handleConnectionOpen;
    globalSocket.onclose = handleConnectionClose;
    globalSocket.onmessage = handleMessage;
    globalSocket.onerror = handleConnectionError;
    
    connectionAttempts++;
    
    return globalSocket;
    
  } catch (error) {
    console.error('Failed to initialize WebSocket connection:', error);
    return null;
  }
};

/**
 * Handle WebSocket connection open
 */
const handleConnectionOpen = (event) => {
  console.log('✅ WebSocket connected successfully');
  connectionAttempts = 0;
  
  // Send authentication if user is logged in
  const userId = getCurrentUserId();
  if (userId) {
    sendMessage({
      type: 'authenticate',
      userId: userId,
      timestamp: new Date().toISOString()
    });
  }
  
  // Notify all active connections
  activeConnections.forEach((connection, id) => {
    if (connection.onConnect) {
      connection.onConnect(event);
    }
  });
};

/**
 * Handle WebSocket connection close
 */
const handleConnectionClose = (event) => {
  console.log('❌ WebSocket connection closed');
  
  // Attempt to reconnect
  if (connectionAttempts < maxReconnectAttempts) {
    const delay = Math.pow(2, connectionAttempts) * 1000; // Exponential backoff
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${connectionAttempts + 1}/${maxReconnectAttempts})`);
    
    setTimeout(() => {
      initializeRealTimeConnection();
    }, delay);
  } else {
    console.error('🚫 Max reconnection attempts reached');
  }
  
  // Notify all active connections
  activeConnections.forEach((connection, id) => {
    if (connection.onDisconnect) {
      connection.onDisconnect(event);
    }
  });
};

/**
 * Handle WebSocket error
 */
const handleConnectionError = (error) => {
  console.error('❌ WebSocket error:', error);
  
  activeConnections.forEach((connection, id) => {
    if (connection.onError) {
      connection.onError(error);
    }
  });
};

/**
 * Handle incoming WebSocket messages
 */
const handleMessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    console.log('📨 Received message:', message);
    
    // Route message to appropriate handlers
    switch (message.type) {
      case 'new_comment':
        handleNewComment(message.data);
        break;
      case 'new_post':
        handleNewPost(message.data);
        break;
      case 'user_typing':
        handleUserTyping(message.data);
        break;
      case 'live_interaction':
        handleLiveInteraction(message.data);
        break;
      case 'ai_post_generated':
        handleAIPostGenerated(message.data);
        break;
      default:
        // Broadcast to all subscribed handlers
        broadcastToSubscriptions(message.type, message.data);
    }
    
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
};

/**
 * Send message through WebSocket
 */
const sendMessage = (message) => {
  if (globalSocket && globalSocket.readyState === 1) {
    globalSocket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket not connected, message queued');
    // In production, implement message queuing
  }
};

/**
 * Get current user ID (placeholder)
 */
const getCurrentUserId = () => {
  // In production, get from auth context
  return localStorage.getItem('currentUserId') || 'demo-user-123';
};

/**
 * Subscribe to real-time events
 */
export const subscribe = (eventType, callback, options = {}) => {
  const subscriptionId = uuidv4();
  
  if (!subscriptions.has(eventType)) {
    subscriptions.set(eventType, new Map());
  }
  
  subscriptions.get(eventType).set(subscriptionId, {
    callback,
    options,
    createdAt: new Date().toISOString()
  });
  
  console.log(`📡 Subscribed to ${eventType} with ID: ${subscriptionId}`);
  
  // Return unsubscribe function
  return () => {
    if (subscriptions.has(eventType)) {
      subscriptions.get(eventType).delete(subscriptionId);
      console.log(`❌ Unsubscribed from ${eventType}`);
    }
  };
};

/**
 * Unsubscribe from all events
 */
export const unsubscribeAll = () => {
  subscriptions.clear();
  console.log('❌ Unsubscribed from all events');
};

/**
 * Broadcast message to all subscribers
 */
const broadcastToSubscriptions = (eventType, data) => {
  if (subscriptions.has(eventType)) {
    subscriptions.get(eventType).forEach((subscription, id) => {
      try {
        subscription.callback(data);
      } catch (error) {
        console.error(`Error in subscription callback for ${eventType}:`, error);
      }
    });
  }
};

/**
 * Handle new comment received
 */
const handleNewComment = (commentData) => {
  console.log('💬 New comment received:', commentData);
  broadcastToSubscriptions('new_comment', commentData);
  broadcastToSubscriptions(`post_${commentData.post_id}_comments`, commentData);
};

/**
 * Handle new post received
 */
const handleNewPost = (postData) => {
  console.log('📝 New post received:', postData);
  broadcastToSubscriptions('new_post', postData);
  
  if (postData.is_ai_generated) {
    broadcastToSubscriptions('ai_post', postData);
  }
};

/**
 * Handle user typing indicator
 */
const handleUserTyping = (typingData) => {
  console.log('⌨️ User typing:', typingData);
  broadcastToSubscriptions('user_typing', typingData);
  broadcastToSubscriptions(`post_${typingData.post_id}_typing`, typingData);
};

/**
 * Handle live interaction
 */
const handleLiveInteraction = (interactionData) => {
  console.log('👆 Live interaction:', interactionData);
  
  const key = `${interactionData.post_id}_${interactionData.user_id}`;
  liveInteractions.set(key, {
    ...interactionData,
    timestamp: new Date().toISOString()
  });
  
  // Clean up old interactions
  setTimeout(() => {
    liveInteractions.delete(key);
  }, 30000); // 30 seconds
  
  broadcastToSubscriptions('live_interaction', interactionData);
  broadcastToSubscriptions(`post_${interactionData.post_id}_interactions`, interactionData);
};

/**
 * Handle AI post generated
 */
const handleAIPostGenerated = (postData) => {
  console.log('🤖 AI post generated:', postData);
  broadcastToSubscriptions('ai_post_generated', postData);
};

/**
 * Send typing indicator
 */
export const sendTypingIndicator = (postId, isTyping = true) => {
  const userId = getCurrentUserId();
  
  sendMessage({
    type: 'typing_indicator',
    data: {
      post_id: postId,
      user_id: userId,
      is_typing: isTyping,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Send live interaction
 */
export const sendLiveInteraction = (postId, interactionType, data = {}) => {
  const userId = getCurrentUserId();
  
  sendMessage({
    type: 'live_interaction',
    data: {
      post_id: postId,
      user_id: userId,
      interaction_type: interactionType,
      interaction_data: data,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Join a post's live thread
 */
export const joinLiveThread = (postId, callbacks = {}) => {
  const connectionId = uuidv4();
  
  activeConnections.set(connectionId, {
    postId,
    joinedAt: new Date().toISOString(),
    ...callbacks
  });
  
  // Subscribe to post-specific events
  const unsubscribeComment = subscribe(`post_${postId}_comments`, callbacks.onNewComment || (() => {}));
  const unsubscribeTyping = subscribe(`post_${postId}_typing`, callbacks.onUserTyping || (() => {}));
  const unsubscribeInteraction = subscribe(`post_${postId}_interactions`, callbacks.onLiveInteraction || (() => {}));
  
  // Send join message
  sendMessage({
    type: 'join_thread',
    data: {
      post_id: postId,
      user_id: getCurrentUserId(),
      timestamp: new Date().toISOString()
    }
  });
  
  // Send live interaction to indicate viewing
  sendLiveInteraction(postId, 'viewing');
  
  console.log(`🎯 Joined live thread for post: ${postId}`);
  
  // Return leave function
  return () => {
    activeConnections.delete(connectionId);
    unsubscribeComment();
    unsubscribeTyping();
    unsubscribeInteraction();
    
    // Send leave message
    sendMessage({
      type: 'leave_thread',
      data: {
        post_id: postId,
        user_id: getCurrentUserId(),
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`👋 Left live thread for post: ${postId}`);
  };
};

/**
 * Get live interaction count for a post
 */
export const getLiveInteractionCount = (postId) => {
  let count = 0;
  liveInteractions.forEach((interaction, key) => {
    if (interaction.post_id === postId) {
      count++;
    }
  });
  return count;
};

/**
 * Get current live interactions for a post
 */
export const getLiveInteractions = (postId) => {
  const interactions = [];
  liveInteractions.forEach((interaction, key) => {
    if (interaction.post_id === postId) {
      interactions.push(interaction);
    }
  });
  return interactions;
};

/**
 * Simulate real-time events for development
 */
export const simulateRealTimeEvents = () => {
  if (!globalSocket) return;
  
  console.log('🎭 Starting real-time event simulation...');
  
  // Simulate new comments every 30 seconds
  setInterval(() => {
    const mockComment = {
      id: uuidv4(),
      post_id: 'demo-post-123',
      user_id: 'ai-user-456',
      content: 'This is a simulated real-time comment! 💬',
      author: 'AI Assistant',
      timestamp: new Date().toISOString()
    };
    
    globalSocket.receive({
      type: 'new_comment',
      data: mockComment
    });
  }, 30000);
  
  // Simulate AI posts every 60 seconds
  setInterval(() => {
    const mockAIPost = {
      id: uuidv4(),
      content: '🤖 This is a simulated AI-generated post about trending topics! What do you think?',
      author: 'Chhimeki AI',
      is_ai_generated: true,
      trend_topic: 'Simulated Trend',
      timestamp: new Date().toISOString()
    };
    
    globalSocket.receive({
      type: 'ai_post_generated',
      data: mockAIPost
    });
  }, 60000);
  
  // Simulate random live interactions
  setInterval(() => {
    const interactions = ['viewing', 'typing', 'reacting'];
    const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)];
    
    globalSocket.receive({
      type: 'live_interaction',
      data: {
        post_id: 'demo-post-123',
        user_id: `user-${Math.floor(Math.random() * 100)}`,
        interaction_type: randomInteraction,
        timestamp: new Date().toISOString()
      }
    });
  }, 10000);
};

/**
 * Get connection status
 */
export const getConnectionStatus = () => {
  return {
    connected: globalSocket && globalSocket.readyState === 1,
    connectionAttempts,
    activeConnections: activeConnections.size,
    subscriptions: Array.from(subscriptions.keys()),
    liveInteractions: liveInteractions.size
  };
};

/**
 * Disconnect and cleanup
 */
export const disconnect = () => {
  if (globalSocket) {
    globalSocket.close();
    globalSocket = null;
  }
  
  activeConnections.clear();
  subscriptions.clear();
  liveInteractions.clear();
  
  console.log('🔌 Disconnected from real-time service');
};

// Auto-initialize connection
if (typeof window !== 'undefined') {
  initializeRealTimeConnection();
  
  // Start simulation in development
  if (process.env.REACT_APP_ENV === 'development') {
    setTimeout(simulateRealTimeEvents, 5000);
  }
}

export default {
  initializeRealTimeConnection,
  subscribe,
  unsubscribeAll,
  sendTypingIndicator,
  sendLiveInteraction,
  joinLiveThread,
  getLiveInteractionCount,
  getLiveInteractions,
  getConnectionStatus,
  disconnect,
  simulateRealTimeEvents
};