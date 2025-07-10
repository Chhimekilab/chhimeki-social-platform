import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Shield, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  MessageSquare,
  Calendar,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  Eye,
  ThumbsUp,
  BarChart3,
  Navigation
} from 'lucide-react';

import locationService from '../../services/locationService';
import safetyService from '../../services/safetyService';
import marketplaceService from '../../services/marketplaceService';

const NeighborhoodDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userLocation, setUserLocation] = useState(null);
  const [currentNeighborhood, setCurrentNeighborhood] = useState(null);
  const [safetyReports, setSafetyReports] = useState([]);
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [localBusinesses, setLocalBusinesses] = useState([]);
  const [communityPolls, setCommunityPolls] = useState([]);
  const [lostAndFound, setLostAndFound] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [safetyFilters, setSafetyFilters] = useState({});
  const [marketplaceFilters, setMarketplaceFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNeighborhoodData();
  }, []);

  const loadNeighborhoodData = async () => {
    try {
      setLoading(true);
      
      // Get user's current location
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      
      // Find nearest neighborhood
      const neighborhood = await locationService.findNearestNeighborhood(
        location.latitude, 
        location.longitude
      );
      setCurrentNeighborhood(neighborhood);
      
      if (neighborhood) {
        // Load neighborhood-specific data
        const [reports, listings, businesses, polls, items] = await Promise.all([
          safetyService.getSafetyReports({ neighborhoodId: neighborhood.id, radiusMiles: 3 }),
          marketplaceService.getMarketplaceListings({ radiusMiles: 5 }),
          marketplaceService.getLocalBusinesses({ radiusMiles: 2 }),
          safetyService.getCommunityPolls(neighborhood.id),
          safetyService.getLostAndFoundItems({ neighborhoodId: neighborhood.id })
        ]);
        
        setSafetyReports(reports);
        setMarketplaceListings(listings);
        setLocalBusinesses(businesses);
        setCommunityPolls(polls);
        setLostAndFound(items);
      }
    } catch (error) {
      console.error('Failed to load neighborhood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
    await loadNeighborhoodData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading neighborhood data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'safety', name: 'Safety', icon: Shield },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag },
    { id: 'businesses', name: 'Local Businesses', icon: Users },
    { id: 'community', name: 'Community', icon: MessageSquare },
    { id: 'lost-found', name: 'Lost & Found', icon: Search }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Location */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Neighborhood</h1>
              {currentNeighborhood ? (
                <p className="text-gray-600">
                  {currentNeighborhood.name} • {currentNeighborhood.population.toLocaleString()} residents
                </p>
              ) : (
                <p className="text-gray-600">Location not set</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLocationUpdate}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Update Location</span>
          </button>
        </div>

        {currentNeighborhood && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Safety Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-green-900">{currentNeighborhood.safetyRating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(currentNeighborhood.safetyRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Active Reports</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">
                {safetyReports.filter(r => r.status === 'active').length}
              </span>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">Local Listings</span>
              </div>
              <span className="text-2xl font-bold text-orange-900">{marketplaceListings.length}</span>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Local Businesses</span>
              </div>
              <span className="text-2xl font-bold text-purple-900">{localBusinesses.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Neighborhood Activity</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Safety Reports */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-red-500" />
                      Latest Safety Reports
                    </h4>
                    <div className="space-y-3">
                      {safetyReports.slice(0, 3).map((report) => (
                        <div key={report.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            report.severity === 'critical' ? 'bg-red-500' :
                            report.severity === 'high' ? 'bg-orange-500' :
                            report.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{report.title}</p>
                            <p className="text-xs text-gray-600">{report.neighborhood} • {safetyService.getTimeSinceIncident(report.incidentTime)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Marketplace */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-green-500" />
                      New Marketplace Listings
                    </h4>
                    <div className="space-y-3">
                      {marketplaceListings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{listing.title}</p>
                            <p className="text-xs text-gray-600">
                              {marketplaceService.formatPrice(listing.price)} • {listing.neighborhood}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Polls */}
              {communityPolls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Community Polls</h3>
                  <div className="space-y-4">
                    {communityPolls.filter(p => p.status === 'active').slice(0, 2).map((poll) => (
                      <div key={poll.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{poll.title}</h4>
                            <p className="text-sm text-gray-600">{poll.description}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {poll.totalVotes} votes
                          </span>
                        </div>
                        {!poll.userHasVoted && (
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Vote Now →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Safety Tab */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Safety Reports</h3>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Report Incident</span>
                </button>
              </div>

              {/* Safety Filters */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={safetyFilters.incidentType || ''}
                  onChange={(e) => setSafetyFilters({...safetyFilters, incidentType: e.target.value || undefined})}
                >
                  <option value="">All Types</option>
                  <option value="crime">Crime</option>
                  <option value="emergency">Emergency</option>
                  <option value="suspicious_activity">Suspicious Activity</option>
                  <option value="accident">Accident</option>
                </select>
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={safetyFilters.severity || ''}
                  onChange={(e) => setSafetyFilters({...safetyFilters, severity: e.target.value || undefined})}
                >
                  <option value="">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Safety Reports List */}
              <div className="space-y-4">
                {safetyReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {safetyService.getSeverityDisplay(report.severity)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {safetyService.getIncidentTypeDisplay(report.incidentType)}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>{report.locationDescription}</span>
                          <span>•</span>
                          <span>{safetyService.getTimeSinceIncident(report.incidentTime)}</span>
                          <span>•</span>
                          <span>{locationService.formatDistance(report.distance)} away</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 text-green-600 hover:text-green-800">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{report.upvotes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                          <MessageSquare className="w-4 h-4" />
                          <span>{report.commentCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Local Marketplace</h3>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </button>
              </div>

              {/* Marketplace Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceListings.map((listing) => (
                  <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                      <div className="flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">{listing.title}</h4>
                      <p className="text-lg font-bold text-green-600 mb-2">
                        {marketplaceService.formatPrice(listing.price)}
                        {listing.priceNegotiable && <span className="text-sm text-gray-500"> (negotiable)</span>}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{listing.description.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{listing.neighborhood}</span>
                        <span>{locationService.formatDistance(listing.distance)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {listing.viewsCount}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          listing.condition === 'new' ? 'bg-green-100 text-green-800' :
                          listing.condition === 'like_new' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {marketplaceService.getConditionDisplay(listing.condition)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Local Businesses Tab */}
          {activeTab === 'businesses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Local Businesses</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>List Business</span>
                </button>
              </div>

              {/* Business List */}
              <div className="space-y-4">
                {localBusinesses.map((business) => (
                  <div key={business.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{business.businessName}</h4>
                            <p className="text-sm text-gray-600 mb-2">{business.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{business.address}</span>
                              <span>•</span>
                              <span>{business.priceRange}</span>
                              <span>•</span>
                              <span>{locationService.formatDistance(business.distance)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{business.rating}</span>
                              <span className="text-sm text-gray-500">({business.reviewCount})</span>
                            </div>
                            {business.isVerified && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600">
                            {marketplaceService.formatBusinessHours(business.hoursOfOperation)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {marketplaceService.isBusinessOpen(business.hoursOfOperation) ? (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Open</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Closed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Community Polls</h3>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Poll</span>
                </button>
              </div>

              {/* Polls List */}
              <div className="space-y-4">
                {communityPolls.map((poll) => (
                  <div key={poll.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{poll.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{poll.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          By {poll.creatorName} • {poll.totalVotes} votes • 
                          {poll.status === 'active' ? ' Active' : ' Expired'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        poll.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {poll.status}
                      </span>
                    </div>

                    {/* Poll Options */}
                    <div className="space-y-2">
                      {poll.options.map((option, index) => {
                        const percentage = poll.totalVotes > 0 ? (poll.results[index] / poll.totalVotes) * 100 : 0;
                        return (
                          <div key={index} className="relative">
                            <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer">
                              <span className="text-sm">{option}</span>
                              <span className="text-sm font-medium">{poll.results[index]} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="absolute inset-0 bg-blue-100 rounded opacity-30" style={{ width: `${percentage}%` }} />
                          </div>
                        );
                      })}
                    </div>

                    {!poll.userHasVoted && poll.status === 'active' && (
                      <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
                        Vote
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lost & Found Tab */}
          {activeTab === 'lost-found' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lost & Found</h3>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Report Item</span>
                </button>
              </div>

              {/* Lost & Found List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lostAndFound.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Last seen: {item.lastSeenLocation}</p>
                          <p>Date: {new Date(item.lastSeenDate).toLocaleDateString()}</p>
                          <p>Contact: {item.contactMethod}</p>
                          {item.rewardOffered && (
                            <p className="text-green-600 font-medium">
                              Reward: {marketplaceService.formatPrice(item.rewardOffered)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodDashboard;