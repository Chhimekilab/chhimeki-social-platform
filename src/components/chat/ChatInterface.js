import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Users, 
  MessageCircle, 
  UserPlus, 
  UserMinus, 
  MoreVertical,
  Smile,
  Image,
  Mic,
  Video,
  Phone,
  PhoneOff,
  Settings,
  Flag,
  X,
  ChevronDown,
  Globe,
  Heart,
  ThumbsUp,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ChatInterface = ({ onClose }) => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedUser, setConnectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('searching'); // searching, connected, disconnected
  const [roomType, setRoomType] = useState('random'); // random, interests, location
  const [userInterests, setUserInterests] = useState(['technology', 'music', 'travel']);
  const [onlineCount, setOnlineCount] = useState(1247);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock WebSocket connection
  const ws = useRef(null);

  useEffect(() => {
    // Initialize mock WebSocket
    initializeWebSocket();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeWebSocket = () => {
    // Mock WebSocket for demo
    console.log('Connecting to chat server...');
    
    // Simulate connection delay
    setTimeout(() => {
      if (roomType === 'random') {
        findRandomStranger();
      }
    }, 2000);
  };

  const findRandomStranger = () => {
    setChatStatus('searching');
    
    // Simulate finding a stranger
    setTimeout(() => {
      const strangers = [
        { id: 'stranger_1', name: 'Anonymous User', location: 'Nepal', interests: ['music', 'movies'], isOnline: true },
        { id: 'stranger_2', name: 'Chat Partner', location: 'India', interests: ['technology', 'gaming'], isOnline: true },
        { id: 'stranger_3', name: 'Friend', location: 'USA', interests: ['travel', 'photography'], isOnline: true },
        { id: 'stranger_4', name: 'Buddy', location: 'UK', interests: ['books', 'art'], isOnline: true }
      ];
      
      const randomStranger = strangers[Math.floor(Math.random() * strangers.length)];
      setConnectedUser(randomStranger);
      setChatStatus('connected');
      
      // Add welcome message
      addSystemMessage(`Connected with ${randomStranger.name} from ${randomStranger.location}`);
      
      // Simulate stranger's first message
      setTimeout(() => {
        addMessage({
          id: Date.now(),
          text: "Hi there! 👋 How's your day going?",
          sender: 'stranger',
          timestamp: new Date(),
          type: 'text'
        });
      }, 1500);
    }, 3000);
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const addSystemMessage = (text) => {
    addMessage({
      id: Date.now(),
      text,
      sender: 'system',
      timestamp: new Date(),
      type: 'system'
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || chatStatus !== 'connected') return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    addMessage(message);
    setNewMessage('');
    
    // Simulate stranger's response
    if (Math.random() > 0.3) {
      setTimeout(() => {
        simulateStrangerResponse();
      }, 1000 + Math.random() * 2000);
    }
  };

  const simulateStrangerResponse = () => {
    const responses = [
      "That's interesting! Tell me more about it.",
      "I completely agree with you on that!",
      "Really? I've had a different experience.",
      "Haha, that's funny! 😄",
      "I've been thinking about that too lately.",
      "What do you think about the current situation?",
      "That reminds me of something that happened to me...",
      "I love talking about these topics!",
      "You seem like a really cool person!",
      "Have you tried that before?",
      "I'm curious about your perspective on this.",
      "That's a great point!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    addMessage({
      id: Date.now(),
      text: randomResponse,
      sender: 'stranger',
      timestamp: new Date(),
      type: 'text'
    });
  };

  const handleTyping = () => {
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Show typing indicator for stranger
    if (Math.random() > 0.7) {
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleSkipUser = () => {
    if (connectedUser) {
      addSystemMessage(`${connectedUser.name} left the conversation`);
      setConnectedUser(null);
      setChatStatus('searching');
      setMessages([]);
      findRandomStranger();
    }
  };

  const handleEndChat = () => {
    if (connectedUser) {
      addSystemMessage('You ended the conversation');
      setConnectedUser(null);
      setChatStatus('disconnected');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const emojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[80vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Live Chat</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>{onlineCount.toLocaleString()} online</span>
            </div>
          </div>

          {/* Chat Type Selection */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Chat Mode</h3>
            <div className="space-y-2">
              {[
                { id: 'random', label: 'Random Chat', icon: Users, desc: 'Chat with anyone' },
                { id: 'interests', label: 'Interest Match', icon: Heart, desc: 'Find similar interests' },
                { id: 'location', label: 'Local Chat', icon: Globe, desc: 'Chat with locals' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setRoomType(mode.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    roomType === mode.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <mode.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-xs text-gray-500">{mode.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Your Interests</h3>
            <div className="flex flex-wrap gap-2">
              {userInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
            <button className="text-blue-600 text-sm mt-2 hover:text-blue-700">
              + Add interests
            </button>
          </div>

          {/* Connected User Info */}
          {connectedUser && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Chat Partner</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                  {connectedUser.name[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{connectedUser.name}</div>
                  <div className="text-sm text-gray-500">{connectedUser.location}</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Common interests:</div>
                <div className="flex flex-wrap gap-1">
                  {connectedUser.interests.filter(interest => 
                    userInterests.includes(interest)
                  ).map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 mt-auto">
            {chatStatus === 'connected' && (
              <div className="space-y-2">
                <button
                  onClick={handleSkipUser}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Skip User
                </button>
                <button
                  onClick={handleEndChat}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  End Chat
                </button>
              </div>
            )}
            
            {chatStatus === 'searching' && (
              <div className="text-center">
                <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Looking for someone to chat with...</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {connectedUser ? (
                  <>
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                        {connectedUser.name[0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{connectedUser.name}</h3>
                      <p className="text-sm text-gray-500">
                        {isTyping ? 'Typing...' : 'Online'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <h3 className="font-medium text-gray-900">Waiting for connection...</h3>
                      <p className="text-sm text-gray-500">Please wait</p>
                    </div>
                  </div>
                )}
              </div>

              {connectedUser && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsVoiceCall(!isVoiceCall)}
                    className={`p-2 rounded-full transition-colors ${
                      isVoiceCall 
                        ? 'bg-green-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isVoiceCall ? <PhoneOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsVideoCall(!isVideoCall)}
                    className={`p-2 rounded-full transition-colors ${
                      isVideoCall 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Flag className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' 
                      ? 'justify-end' 
                      : message.sender === 'system'
                      ? 'justify-center'
                      : 'justify-start'
                  }`}
                >
                  {message.sender === 'system' ? (
                    <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {message.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {showEmojiPicker && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNewMessage(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:bg-gray-200 p-1 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Image className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={
                    chatStatus === 'connected' 
                      ? "Type a message..." 
                      : "Waiting for connection..."
                  }
                  disabled={chatStatus !== 'connected'}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <button
                type="submit"
                disabled={!newMessage.trim() || chatStatus !== 'connected'}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;