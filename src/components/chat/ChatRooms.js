import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Globe, 
  Crown, 
  Heart, 
  Music, 
  Gamepad2, 
  Briefcase, 
  Coffee, 
  Book, 
  Plane, 
  Film,
  Search,
  UserPlus,
  Zap,
  Star,
  TrendingUp,
  Volume2,
  X
} from 'lucide-react';

const ChatRooms = ({ onJoinRoom, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Mock chat rooms data
    const mockRooms = [
      {
        id: 'general',
        name: 'General Chat',
        description: 'Open discussion for everyone',
        category: 'general',
        icon: MessageSquare,
        members: 1247,
        online: 423,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'friendly',
        tags: ['general', 'casual', 'friendly']
      },
      {
        id: 'technology',
        name: 'Tech Talk',
        description: 'Discuss latest in technology',
        category: 'technology',
        icon: Zap,
        members: 856,
        online: 234,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'intellectual',
        tags: ['tech', 'programming', 'ai', 'gadgets']
      },
      {
        id: 'music',
        name: 'Music Lovers',
        description: 'Share and discover new music',
        category: 'entertainment',
        icon: Music,
        members: 2341,
        online: 567,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'chill',
        tags: ['music', 'artists', 'concerts', 'spotify']
      },
      {
        id: 'gaming',
        name: 'Gamers Unite',
        description: 'Gaming discussions and LFG',
        category: 'gaming',
        icon: Gamepad2,
        members: 1876,
        online: 445,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'competitive',
        tags: ['gaming', 'esports', 'steam', 'console']
      },
      {
        id: 'business',
        name: 'Entrepreneurs',
        description: 'Business networking and startup talks',
        category: 'business',
        icon: Briefcase,
        members: 634,
        online: 156,
        isActive: true,
        isPremium: true,
        language: 'English',
        mood: 'professional',
        tags: ['business', 'startup', 'networking', 'investment']
      },
      {
        id: 'casual',
        name: 'Coffee Break',
        description: 'Casual conversations over virtual coffee',
        category: 'lifestyle',
        icon: Coffee,
        members: 923,
        online: 278,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'relaxed',
        tags: ['casual', 'coffee', 'life', 'stories']
      },
      {
        id: 'study',
        name: 'Study Buddies',
        description: 'Study together and share knowledge',
        category: 'education',
        icon: Book,
        members: 456,
        online: 123,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'focused',
        tags: ['study', 'education', 'learning', 'books']
      },
      {
        id: 'travel',
        name: 'Travel Stories',
        description: 'Share travel experiences and tips',
        category: 'lifestyle',
        icon: Plane,
        members: 789,
        online: 167,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'adventurous',
        tags: ['travel', 'adventure', 'culture', 'photography']
      },
      {
        id: 'movies',
        name: 'Movie Night',
        description: 'Discuss movies, shows, and celebrities',
        category: 'entertainment',
        icon: Film,
        members: 1456,
        online: 356,
        isActive: true,
        isPremium: false,
        language: 'English',
        mood: 'entertaining',
        tags: ['movies', 'tv shows', 'netflix', 'celebrities']
      },
      {
        id: 'vip-lounge',
        name: 'VIP Lounge',
        description: 'Exclusive chat for premium members',
        category: 'premium',
        icon: Crown,
        members: 234,
        online: 89,
        isActive: true,
        isPremium: true,
        language: 'English',
        mood: 'exclusive',
        tags: ['premium', 'exclusive', 'vip', 'quality']
      }
    ];

    setRooms(mockRooms);
  }, []);

  const categories = [
    { id: 'all', label: 'All Rooms', icon: Globe },
    { id: 'general', label: 'General', icon: MessageSquare },
    { id: 'technology', label: 'Technology', icon: Zap },
    { id: 'entertainment', label: 'Entertainment', icon: Film },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
    { id: 'education', label: 'Education', icon: Book },
    { id: 'premium', label: 'Premium', icon: Crown }
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getMoodColor = (mood) => {
    const colors = {
      friendly: 'bg-green-100 text-green-800',
      intellectual: 'bg-blue-100 text-blue-800',
      chill: 'bg-purple-100 text-purple-800',
      competitive: 'bg-red-100 text-red-800',
      professional: 'bg-gray-100 text-gray-800',
      relaxed: 'bg-yellow-100 text-yellow-800',
      focused: 'bg-indigo-100 text-indigo-800',
      adventurous: 'bg-orange-100 text-orange-800',
      entertaining: 'bg-pink-100 text-pink-800',
      exclusive: 'bg-purple-100 text-purple-800'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800';
  };

  const getActivityLevel = (online, members) => {
    const ratio = online / members;
    if (ratio > 0.4) return { level: 'Very Active', color: 'text-green-600', icon: '🔥' };
    if (ratio > 0.2) return { level: 'Active', color: 'text-yellow-600', icon: '⚡' };
    return { level: 'Moderate', color: 'text-gray-600', icon: '💤' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat Rooms</h1>
              <p className="text-gray-600 mt-1">Join conversations happening right now</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms, topics, or interests..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex h-full">
          {/* Categories Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Live Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rooms</span>
                  <span className="font-medium">{rooms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Users</span>
                  <span className="font-medium text-green-600">
                    {rooms.reduce((sum, room) => sum + room.online, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Chats</span>
                  <span className="font-medium text-blue-600">
                    {rooms.filter(room => room.isActive).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'All Rooms' : categories.find(c => c.id === selectedCategory)?.label}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Room</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => {
                const activity = getActivityLevel(room.online, room.members);
                
                return (
                  <div
                    key={room.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onJoinRoom(room)}
                  >
                    {/* Room Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          room.isPremium ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-purple-500'
                        }`}>
                          <room.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <span>{room.name}</span>
                            {room.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                          </h3>
                          <p className="text-sm text-gray-600">{room.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Room Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{room.members.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">{room.online}</span>
                        </div>
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded-full ${getMoodColor(room.mood)}`}>
                        {room.mood}
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center space-x-1 text-sm ${activity.color}`}>
                        <span>{activity.icon}</span>
                        <span>{activity.level}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Volume2 className="w-3 h-3" />
                        <span>{room.language}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {room.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{room.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Join Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinRoom(room);
                      }}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        room.isPremium
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {room.isPremium ? 'Join Premium Room' : 'Join Room'}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
                <p className="text-gray-600">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms;