/**
 * Chat Service
 * Handles real-time chat functionality, WebSocket connections, and user matching
 */

class ChatService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.currentUser = null;
    this.messageHandlers = new Set();
    this.statusHandlers = new Set();
    this.userHandlers = new Set();
    this.onlineUsers = new Map();
    this.chatHistory = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Initialize WebSocket connection
  connect(user) {
    if (this.isConnected) {
      console.log('Already connected to chat server');
      return;
    }

    this.currentUser = user;
    
    // For demo purposes, we'll simulate WebSocket with setTimeout
    // In production, use: new WebSocket('wss://your-chat-server.com')
    this.simulateWebSocketConnection();
  }

  // Simulate WebSocket connection for demo
  simulateWebSocketConnection() {
    console.log('Connecting to chat server...');
    
    setTimeout(() => {
      this.isConnected = true;
      this.notifyStatusHandlers('connected');
      console.log('Connected to chat server');
      
      // Simulate online users
      this.simulateOnlineUsers();
      
      // Start heartbeat
      this.startHeartbeat();
    }, 1000);
  }

  // Simulate online users
  simulateOnlineUsers() {
    const mockUsers = [
      { id: 'user1', name: 'Anonymous User', location: 'Nepal', status: 'online' },
      { id: 'user2', name: 'Chat Partner', location: 'India', status: 'online' },
      { id: 'user3', name: 'Friend', location: 'USA', status: 'typing' },
      { id: 'user4', name: 'Buddy', location: 'UK', status: 'online' },
      { id: 'user5', name: 'Stranger', location: 'Canada', status: 'away' }
    ];

    mockUsers.forEach(user => {
      this.onlineUsers.set(user.id, user);
    });

    this.notifyUserHandlers({ type: 'users_update', users: Array.from(this.onlineUsers.values()) });
  }

  // Start heartbeat to keep connection alive
  startHeartbeat() {
    setInterval(() => {
      if (this.isConnected) {
        // Simulate random user activities
        this.simulateUserActivity();
      }
    }, 5000);
  }

  // Simulate random user activities
  simulateUserActivity() {
    const users = Array.from(this.onlineUsers.values());
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    if (Math.random() > 0.7) {
      const activities = ['joined', 'left', 'typing', 'stopped_typing'];
      const activity = activities[Math.floor(Math.random() * activities.length)];
      
      this.notifyUserHandlers({
        type: 'user_activity',
        user: randomUser,
        activity
      });
    }
  }

  // Find random stranger for 1-on-1 chat
  findRandomStranger(interests = []) {
    return new Promise((resolve) => {
      this.notifyStatusHandlers('searching');
      
      // Simulate search delay
      setTimeout(() => {
        const strangers = [
          { 
            id: 'stranger_1', 
            name: 'Anonymous User', 
            location: 'Nepal', 
            interests: ['music', 'movies'],
            isOnline: true,
            avatar: 'AU'
          },
          { 
            id: 'stranger_2', 
            name: 'Chat Partner', 
            location: 'India', 
            interests: ['technology', 'gaming'],
            isOnline: true,
            avatar: 'CP'
          },
          { 
            id: 'stranger_3', 
            name: 'Friend', 
            location: 'USA', 
            interests: ['travel', 'photography'],
            isOnline: true,
            avatar: 'FR'
          },
          { 
            id: 'stranger_4', 
            name: 'Buddy', 
            location: 'UK', 
            interests: ['books', 'art'],
            isOnline: true,
            avatar: 'BD'
          }
        ];

        // Find stranger with matching interests if specified
        let matchedStranger;
        if (interests.length > 0) {
          matchedStranger = strangers.find(stranger => 
            stranger.interests.some(interest => interests.includes(interest))
          );
        }
        
        const selectedStranger = matchedStranger || strangers[Math.floor(Math.random() * strangers.length)];
        
        this.notifyStatusHandlers('connected');
        resolve(selectedStranger);
      }, 2000 + Math.random() * 2000);
    });
  }

  // Join chat room
  joinRoom(roomId, roomData = null) {
    this.currentRoom = roomId;
    
    // Simulate joining room
    setTimeout(() => {
      this.notifyStatusHandlers('joined_room', { roomId, roomData });
      
      // Load room history
      this.loadRoomHistory(roomId);
      
      // Notify room members
      this.notifyMessageHandlers({
        id: Date.now(),
        type: 'system',
        text: `${this.currentUser?.full_name || 'You'} joined the room`,
        timestamp: new Date(),
        sender: 'system'
      });
    }, 500);
  }

  // Leave current room
  leaveRoom() {
    if (this.currentRoom) {
      this.notifyMessageHandlers({
        id: Date.now(),
        type: 'system',
        text: `${this.currentUser?.full_name || 'You'} left the room`,
        timestamp: new Date(),
        sender: 'system'
      });
      
      this.currentRoom = null;
      this.notifyStatusHandlers('left_room');
    }
  }

  // Send message
  sendMessage(text, type = 'text', metadata = {}) {
    if (!this.isConnected) {
      console.error('Not connected to chat server');
      return false;
    }

    const message = {
      id: Date.now(),
      text,
      type,
      sender: 'user',
      timestamp: new Date(),
      metadata,
      roomId: this.currentRoom,
      userId: this.currentUser?.id
    };

    // Add to chat history
    if (this.currentRoom) {
      if (!this.chatHistory.has(this.currentRoom)) {
        this.chatHistory.set(this.currentRoom, []);
      }
      this.chatHistory.get(this.currentRoom).push(message);
    }

    // Notify message handlers
    this.notifyMessageHandlers(message);

    // Simulate response (for demo)
    if (Math.random() > 0.3) {
      setTimeout(() => {
        this.simulateResponse();
      }, 1000 + Math.random() * 3000);
    }

    return true;
  }

  // Simulate response from other users
  simulateResponse() {
    const responses = [
      "That's really interesting! 🤔",
      "I totally agree with you on that point",
      "Haha, that made me laugh! 😂",
      "What do you think about that?",
      "I've had a similar experience",
      "Tell me more about it",
      "That's a great perspective!",
      "I never thought of it that way",
      "Thanks for sharing that",
      "You're absolutely right",
      "That's fascinating!",
      "I love hearing different viewpoints"
    ];

    const users = Array.from(this.onlineUsers.values());
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const responseMessage = {
      id: Date.now(),
      text: randomResponse,
      type: 'text',
      sender: 'stranger',
      timestamp: new Date(),
      user: randomUser,
      roomId: this.currentRoom
    };

    this.notifyMessageHandlers(responseMessage);
  }

  // Load room chat history
  loadRoomHistory(roomId) {
    // Simulate loading history
    setTimeout(() => {
      const mockHistory = [
        {
          id: Date.now() - 10000,
          text: "Welcome to the room! 👋",
          type: 'text',
          sender: 'stranger',
          timestamp: new Date(Date.now() - 10000),
          user: { name: 'Room Admin', avatar: 'RA' }
        },
        {
          id: Date.now() - 5000,
          text: "Hope everyone is having a great day!",
          type: 'text',
          sender: 'stranger',
          timestamp: new Date(Date.now() - 5000),
          user: { name: 'Regular User', avatar: 'RU' }
        }
      ];

      mockHistory.forEach(message => {
        this.notifyMessageHandlers(message);
      });
    }, 500);
  }

  // Send typing indicator
  sendTyping(isTyping) {
    if (this.isConnected && this.currentRoom) {
      // Simulate typing notification to other users
      if (Math.random() > 0.5) {
        setTimeout(() => {
          this.notifyUserHandlers({
            type: 'user_typing',
            isTyping,
            user: { name: 'Someone', id: 'typing_user' }
          });
        }, 500);
      }
    }
  }

  // Get online user count
  getOnlineCount() {
    return this.onlineUsers.size;
  }

  // Get room list
  getRoomList() {
    return [
      { id: 'general', name: 'General Chat', members: 1247, online: 423 },
      { id: 'technology', name: 'Tech Talk', members: 856, online: 234 },
      { id: 'music', name: 'Music Lovers', members: 2341, online: 567 },
      { id: 'gaming', name: 'Gamers Unite', members: 1876, online: 445 }
    ];
  }

  // Event handlers management
  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onStatusChange(handler) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  onUserUpdate(handler) {
    this.userHandlers.add(handler);
    return () => this.userHandlers.delete(handler);
  }

  // Notify handlers
  notifyMessageHandlers(message) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  notifyStatusHandlers(status, data = null) {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status, data);
      } catch (error) {
        console.error('Error in status handler:', error);
      }
    });
  }

  notifyUserHandlers(data) {
    this.userHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in user handler:', error);
      }
    });
  }

  // Disconnect from chat server
  disconnect() {
    if (this.isConnected) {
      this.isConnected = false;
      this.currentRoom = null;
      this.notifyStatusHandlers('disconnected');
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      console.log('Disconnected from chat server');
    }
  }

  // Reconnect to chat server
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(this.currentUser);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.notifyStatusHandlers('connection_failed');
    }
  }

  // Report user (moderation)
  reportUser(userId, reason) {
    console.log(`Reported user ${userId} for: ${reason}`);
    // In production, send report to moderation system
    return true;
  }

  // Block user
  blockUser(userId) {
    console.log(`Blocked user: ${userId}`);
    // In production, add to blocked users list
    return true;
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;