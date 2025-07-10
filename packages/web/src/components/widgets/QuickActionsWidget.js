import React, { useState } from 'react';
import { 
  PenTool, 
  Users, 
  Calendar, 
  Video, 
  Image, 
  Mic, 
  MapPin, 
  Poll,
  MessageSquare,
  Settings,
  Zap,
  Plus
} from 'lucide-react';

const QuickActionsWidget = () => {
  const [showAll, setShowAll] = useState(false);

  const quickActions = [
    {
      id: 'post',
      icon: PenTool,
      label: 'Create Post',
      description: 'Share your thoughts',
      color: 'bg-blue-500',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'video',
      icon: Video,
      label: 'Go Live',
      description: 'Start broadcasting',
      color: 'bg-red-500',
      shortcut: 'Ctrl+L'
    },
    {
      id: 'story',
      icon: Image,
      label: 'Add Story',
      description: 'Share a moment',
      color: 'bg-purple-500',
      shortcut: 'Ctrl+S'
    },
    {
      id: 'event',
      icon: Calendar,
      label: 'Create Event',
      description: 'Plan something',
      color: 'bg-green-500',
      shortcut: 'Ctrl+E'
    },
    {
      id: 'poll',
      icon: Poll,
      label: 'Create Poll',
      description: 'Ask your audience',
      color: 'bg-orange-500',
      shortcut: 'Ctrl+P'
    },
    {
      id: 'voice',
      icon: Mic,
      label: 'Voice Note',
      description: 'Record audio',
      color: 'bg-pink-500',
      shortcut: 'Ctrl+R'
    },
    {
      id: 'location',
      icon: MapPin,
      label: 'Check In',
      description: 'Share location',
      color: 'bg-indigo-500',
      shortcut: 'Ctrl+M'
    },
    {
      id: 'group',
      icon: Users,
      label: 'Create Group',
      description: 'Start community',
      color: 'bg-teal-500',
      shortcut: 'Ctrl+G'
    }
  ];

  const primaryActions = quickActions.slice(0, 4);
  const allActions = showAll ? quickActions : primaryActions;

  const handleAction = (actionId) => {
    console.log(`Executing action: ${actionId}`);
    // Here you would implement the actual action logic
    switch (actionId) {
      case 'post':
        // Trigger create post modal
        break;
      case 'video':
        // Start live streaming
        break;
      case 'story':
        // Open story creation
        break;
      case 'event':
        // Open event creation
        break;
      case 'poll':
        // Open poll creation
        break;
      case 'voice':
        // Start voice recording
        break;
      case 'location':
        // Open location picker
        break;
      case 'group':
        // Open group creation
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {allActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="group relative p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                <div className={`${action.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Keyboard Shortcut */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                  {action.shortcut}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">23</p>
            <p className="text-xs text-gray-500">Posts this week</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-500">Events created</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500">Stories shared</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button Preview */}
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Quick Create</p>
            <p className="text-xs text-gray-600">Tap the + button anywhere to create content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsWidget;