import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Calendar, Store, MessageCircle, Search, Filter, AlertTriangle, Zap, Users, Tag, Heart, MessageSquare, Share2, Star, Clock, Navigation, Shield, Megaphone, Bot, ShoppingBag, Home } from 'lucide-react';

const NeighborhoodSection = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Nextdoor-style Safety Alerts data
  const safetyAlerts = [
    {
      id: 1,
      type: 'emergency',
      title: 'Power Outage in Progress',
      description: 'Affecting 1,200 homes in downtown area. Estimated restoration: 3:00 PM',
      location: 'Downtown District',
      distance: '0.3 miles',
      time: '45 min ago',
      source: 'Pacific Gas & Electric',
      severity: 'high',
      icon: Zap,
      affected: '1,200 homes',
      mapVisible: true
    },
    {
      id: 2,
      type: 'weather',
      title: 'Severe Weather Warning',
      description: 'Heavy rainfall and potential flooding expected between 2-6 PM today',
      location: 'City-wide',
      distance: 'Your area',
      time: '1h ago',
      source: 'National Weather Service',
      severity: 'medium',
      icon: AlertTriangle,
      affected: 'All residents',
      mapVisible: true
    },
    {
      id: 3,
      type: 'safety',
      title: 'Neighborhood Watch Alert',
      description: 'Suspicious activity reported on Maple Street. Residents advised to be vigilant',
      location: 'Maple Street',
      distance: '0.8 miles',
      time: '3h ago',
      source: 'Local Police Department',
      severity: 'low',
      icon: Shield,
      affected: '50+ neighbors',
      mapVisible: false
    }
  ];

  // Local News data
  const localNews = [
    {
      id: 1,
      title: 'New Bike Lane Construction Begins Monday',
      summary: 'City announces expansion of cycling infrastructure along Main Street corridor',
      source: 'City Herald',
      time: '2h ago',
      category: 'transportation',
      engagement: '45 reactions',
      image: null,
      distance: '0.5 miles'
    },
    {
      id: 2,
      title: 'Local Farmer\'s Market Wins State Award',
      summary: 'Downtown farmer\'s market recognized for sustainability and community impact',
      source: 'Local Times',
      time: '5h ago',
      category: 'community',
      engagement: '78 reactions',
      image: null,
      distance: '0.2 miles'
    },
    {
      id: 3,
      title: 'School District Announces New Arts Program',
      summary: 'Additional funding secured for music and visual arts education',
      source: 'Education Weekly',
      time: '1d ago',
      category: 'education',
      engagement: '123 reactions',
      image: null,
      distance: '1.2 miles'
    }
  ];

  // AI Recommendations (Faves) data
  const aiRecommendations = [
    {
      id: 1,
      query: 'Best pizza places near me',
      recommendation: 'Based on 127 neighbor reviews, Tony\'s Pizza and Bella Vista are the top-rated options within 1 mile',
      confidence: 95,
      sources: '127 neighbor reviews',
      businesses: ['Tony\'s Pizza', 'Bella Vista', 'Corner Slice']
    },
    {
      id: 2,
      query: 'Family-friendly hiking trails',
      recommendation: 'River Trail and Sunset Park Loop are most recommended by families with kids under 10',
      confidence: 88,
      sources: '43 family recommendations',
      businesses: ['River Trail', 'Sunset Park', 'Nature Center']
    }
  ];

  // Marketplace data
  const marketplaceItems = [
    {
      id: 1,
      title: 'Gently Used Sofa - Great Condition',
      price: '$150',
      type: 'for-sale',
      seller: 'Sarah M.',
      location: '0.3 miles away',
      time: '2h ago',
      image: null,
      category: 'furniture',
      description: 'Moving sale - comfortable 3-seater sofa, pet-free home'
    },
    {
      id: 2,
      title: 'Free Kids\' Toys and Books',
      price: 'FREE',
      type: 'free',
      seller: 'Mike & Lisa',
      location: '0.5 miles away',
      time: '4h ago',
      image: null,
      category: 'kids',
      description: 'Kids outgrew these toys, perfect for ages 3-8'
    },
    {
      id: 3,
      title: 'Professional Lawn Mower',
      price: '$75',
      type: 'for-sale',
      seller: 'David K.',
      location: '0.7 miles away',
      time: '1d ago',
      image: null,
      category: 'tools',
      description: 'Reliable gas mower, recently serviced'
    }
  ];

  // Events data
  const events = [
    {
      id: 1,
      title: 'Community Cleanup Day',
      date: 'Saturday, Jan 27',
      time: '9:00 AM - 12:00 PM',
      location: 'Central Park',
      organizer: 'Neighborhood Association',
      attendees: 45,
      distance: '0.4 miles',
      category: 'community',
      description: 'Join neighbors for quarterly park cleanup and beautification'
    },
    {
      id: 2,
      title: 'Block Party Planning Meeting',
      date: 'Tuesday, Jan 30',
      time: '7:00 PM - 8:30 PM',
      location: 'Community Center',
      organizer: 'Block Party Committee',
      attendees: 12,
      distance: '0.6 miles',
      category: 'social',
      description: 'Help plan the annual summer block party'
    },
    {
      id: 3,
      title: 'Family Game Night',
      date: 'Friday, Feb 2',
      time: '6:00 PM - 9:00 PM',
      location: 'Miller\'s Backyard',
      organizer: 'The Miller Family',
      attendees: 8,
      distance: '0.2 miles',
      category: 'family',
      description: 'Bring snacks and your favorite board games!'
    }
  ];

  // Local Businesses data
  const localBusinesses = [
    {
      id: 1,
      name: 'Corner Coffee Roasters',
      category: 'Coffee & Tea',
      rating: 4.8,
      reviews: 156,
      distance: '0.2 miles',
      status: 'Open',
      hours: '6:00 AM - 8:00 PM',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      features: ['Free WiFi', 'Outdoor Seating', 'Local Roasted']
    },
    {
      id: 2,
      name: 'Green Thumb Garden Center',
      category: 'Garden & Landscaping',
      rating: 4.6,
      reviews: 89,
      distance: '0.8 miles',
      status: 'Open',
      hours: '8:00 AM - 6:00 PM',
      phone: '(555) 234-5678',
      address: '456 Garden Way',
      features: ['Local Plants', 'Expert Advice', 'Delivery Available']
    },
    {
      id: 3,
      name: 'Pete\'s Auto Repair',
      category: 'Automotive',
      rating: 4.9,
      reviews: 203,
      distance: '1.1 miles',
      status: 'Closed',
      hours: '7:00 AM - 5:00 PM',
      phone: '(555) 345-6789',
      address: '789 Industrial Blvd',
      features: ['Certified Mechanics', 'Same Day Service', 'Fair Pricing']
    }
  ];

  const tabs = [
    { key: 'alerts', label: 'Safety Alerts', icon: Bell },
    { key: 'news', label: 'Local News', icon: Megaphone },
    { key: 'faves', label: 'AI Recommendations', icon: Bot },
    { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'businesses', label: 'Local Businesses', icon: Store }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderSafetyAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-red-600" />
            Active Safety Alerts
          </h3>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
            {safetyAlerts.length} Active
          </span>
        </div>
        
        <div className="space-y-4">
          {safetyAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon className="w-6 h-6 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{alert.title}</h4>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {alert.location} • {alert.distance}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.time}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {alert.affected}
                        </span>
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Source:</span> {alert.source}
                      </div>
                    </div>
                  </div>
                  {alert.mapVisible && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View on Map
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLocalNews = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-blue-600" />
            Local News & Updates
          </h3>
          <div className="flex space-x-2">
            {['all', 'transportation', 'community', 'education'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  selectedFilter === filter
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {localNews
            .filter(news => selectedFilter === 'all' || news.category === selectedFilter)
            .map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium capitalize">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{article.time}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Navigation className="w-3 h-3 mr-1" />
                          {article.distance}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {article.engagement}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Share2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderAIRecommendations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-purple-600" />
            AI Neighborhood Assistant (Faves)
          </h3>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ask me about local recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Try asking: "Best coffee shops", "Kids activities", "Reliable mechanics"
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Recent Recommendations</h4>
          {aiRecommendations.map((rec) => (
            <div key={rec.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">"{rec.query}"</p>
                  <p className="text-sm text-gray-700 mb-2">{rec.recommendation}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Based on {rec.sources} • {rec.confidence}% confidence
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
            Neighborhood Marketplace
          </h3>
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Post Item
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          {['all', 'for-sale', 'free', 'wanted'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                selectedFilter === filter
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'for-sale' ? 'For Sale' : filter}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketplaceItems
            .filter(item => selectedFilter === 'all' || item.type === selectedFilter)
            .map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'free' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.price}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>By {item.seller}</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location}
                      </span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200">
                    Message Seller
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Heart className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Neighborhood Events
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Create Event
          </button>
        </div>
        
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium capitalize">
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{event.distance}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {event.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Organized by {event.organizer} • {event.attendees} attending
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200">
                        Join Event
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBusinesses = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Store className="w-5 h-5 mr-2 text-orange-600" />
            Local Business Directory
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {localBusinesses.map((business) => (
            <div key={business.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{business.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      business.status === 'Open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {business.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      <span className="font-medium">{business.rating}</span>
                      <span className="text-gray-500">({business.reviews} reviews)</span>
                    </div>
                    <span className="flex items-center">
                      <Navigation className="w-4 h-4 mr-1" />
                      {business.distance}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {business.address} • {business.hours}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {business.features.map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-medium hover:bg-orange-200">
                      Call
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200">
                      Directions
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200">
                      Website
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'alerts':
        return renderSafetyAlerts();
      case 'news':
        return renderLocalNews();
      case 'faves':
        return renderAIRecommendations();
      case 'marketplace':
        return renderMarketplace();
      case 'events':
        return renderEvents();
      case 'businesses':
        return renderBusinesses();
      default:
        return renderSafetyAlerts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Neighborhood</h1>
            <p className="opacity-90">Stay connected with your local community</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Current Location</div>
            <div className="font-semibold flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Downtown District
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default NeighborhoodSection;