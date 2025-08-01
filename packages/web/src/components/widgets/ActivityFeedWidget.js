import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Share, 
  Calendar,
  Crown,
  Users,
  Clock
} from 'lucide-react';

const ActivityFeedWidget = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock activity data
  useEffect(() => {
    const fetchActivities = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockActivities = [
        {
          id: 1,
          type: 'like',
          user: 'Sarah Chen',
          action: 'liked your post',
          target: 'The Future of Social Media Privacy',
          time: '2 minutes ago',
          avatar: 'SC',
          verified: true,
          unread: true
        },
        {
          id: 2,
          type: 'follow',
          user: 'Alex Rodriguez',
          action: 'started following you',
          target: null,
          time: '15 minutes ago',
          avatar: 'AR',
          verified: false,
          unread: true
        },
        {
          id: 3,
          type: 'comment',
          user: 'Tech Insider',
          action: 'commented on your post',
          target: 'Building My First SaaS',
          time: '1 hour ago',
          avatar: 'TI',
          verified: true,
          unread: false
        },
        {
          id: 4,
          type: 'share',
          user: 'Maya Patel',
          action: 'shared your post',
          target: 'Design Thinking Process',
          time: '2 hours ago',
          avatar: 'MP',
          verified: false,
          unread: false
        },
        {
          id: 5,
          type: 'event',
          user: 'Design Community',
          action: 'invited you to',
          target: 'Virtual Design Workshop',
          time: '3 hours ago',
          avatar: 'DC',
          verified: true,
          unread: false
        },
        {
          id: 6,
          type: 'follow',
          user: 'David Kim',
          action: 'started following you',
          target: null,
          time: '1 day ago',
          avatar: 'DK',
          verified: false,
          unread: false
        },
        {
          id: 7,
          type: 'like',
          user: 'Lisa Zhang',
          action: 'liked your comment on',
          target: 'AI Revolution in Marketing',
          time: '1 day ago',
          avatar: 'LZ',
          verified: false,
          unread: false
        }
      ];
      
      setActivities(mockActivities);
      setLoading(false);
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'share':
        return <Share className="w-4 h-4 text-purple-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'like':
        return 'bg-red-100';
      case 'comment':
        return 'bg-blue-100';
      case 'follow':
        return 'bg-green-100';
      case 'share':
        return 'bg-purple-100';
      case 'event':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'unread') return activity.unread;
    return activity.type === filter;
  });

  const markAllAsRead = () => {
    setActivities(activities.map(activity => ({ ...activity, unread: false })));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = activities.filter(a => a.unread).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'like', label: 'Likes' },
          { key: 'follow', label: 'Follows' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No activities to show</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
                activity.unread ? 'bg-orange-50 border border-orange-100' : ''
              }`}
            >
              {/* Activity Icon */}
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {activity.avatar}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium flex items-center space-x-1">
                        <span>{activity.user}</span>
                        {activity.verified && <Crown className="w-3 h-3 text-yellow-500" />}
                      </span>
                      <span className="text-gray-600 ml-1">{activity.action}</span>
                      {activity.target && (
                        <span className="font-medium text-gray-900 ml-1">&quot;{activity.target}&quot;</span>
                      )}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                  
                  {activity.unread && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-bold text-gray-900">
              {activities.filter(a => a.type === 'like').length}
            </p>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {activities.filter(a => a.type === 'follow').length}
            </p>
            <p className="text-xs text-gray-500">New Followers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {activities.filter(a => a.type === 'comment').length}
            </p>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedWidget;