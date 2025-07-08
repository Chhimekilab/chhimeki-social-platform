import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Bell, 
  MessageSquare,
  Home,
  Newspaper,
  TrendingUp,
  Users2,
  MapPin,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';

const Header = ({ activeTab, onTabChange, currentUser, notifications, messages }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'news', name: 'News', icon: Newspaper },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'communities', name: 'Communities', icon: Users2 },
    { id: 'neighborhood', name: 'Neighborhood', icon: MapPin },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      analyticsService.trackSearch(query, 0);
    }
  };

  return (
    <header className="modern-nav sticky top-0 z-50">
      <div className="bbc-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Chhimeki</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Your Connected Community</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
              >
                <Search className="w-5 h-5" />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 fade-in">
                  <div className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search people, posts, communities..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        autoFocus
                      />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="text-sm font-medium text-gray-700">Popular Searches</div>
                      <div className="space-y-2">
                        {['Tech Innovation', 'Local Events', 'Community News'].map((term, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{term}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  analyticsService.trackEvent('notifications_panel_toggle', { 
                    action: !isNotificationsOpen ? 'open' : 'close' 
                  });
                }}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50 relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-25 cursor-pointer transition-colors ${!notification.read ? 'bg-red-25' : ''}`}
                        onClick={() => {
                          analyticsService.trackNotificationClick(notification.id, notification.type, 'view');
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {notification.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-semibold">{notification.user}</span> {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsMessagesOpen(!isMessagesOpen);
                  analyticsService.trackEvent('messages_panel_toggle', { 
                    action: !isMessagesOpen ? 'open' : 'close' 
                  });
                }}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50 relative"
              >
                <MessageSquare className="w-5 h-5" />
                {messages.some(m => m.unread) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              {isMessagesOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Messages</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`p-4 hover:bg-gray-25 cursor-pointer transition-colors ${message.unread ? 'bg-red-25' : ''}`}
                        onClick={() => {
                          analyticsService.trackMessage(message.user, 'view', message.message.length);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {message.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{message.user}</p>
                            <p className="text-sm text-gray-600 truncate">{message.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                          {message.unread && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2 ml-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                {getAvatarInitials(currentUser?.full_name)}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 slide-in">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;