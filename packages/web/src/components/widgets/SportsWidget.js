import React, { useState, useEffect } from 'react';
import { sportsAPI } from '../../services/realApis';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Circle,
  Basketball,
  CircleDot,
  Square
} from 'lucide-react';

const SportsWidget = () => {
  const [liveFixtures, setLiveFixtures] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [selectedLeague, setSelectedLeague] = useState('all');

  // Popular leagues
  const leagues = [
    { id: 'all', name: 'All Leagues', icon: '🏆' },
    { id: '39', name: 'Premier League', icon: '⚽', country: 'England' },
    { id: '140', name: 'La Liga', icon: '⚽', country: 'Spain' },
    { id: '135', name: 'Serie A', icon: '⚽', country: 'Italy' },
    { id: '78', name: 'Bundesliga', icon: '⚽', country: 'Germany' },
    { id: '61', name: 'Ligue 1', icon: '⚽', country: 'France' },
    { id: '2', name: 'UEFA Champions League', icon: '🏆', country: 'Europe' }
  ];

  useEffect(() => {
    loadSportsData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadSportsData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedLeague]);

  const loadSportsData = async () => {
    try {
      setLoading(true);
      
      const [liveData, upcomingData] = await Promise.allSettled([
        sportsAPI.getLiveFixtures(selectedLeague === 'all' ? null : selectedLeague),
        sportsAPI.getUpcomingFixtures(selectedLeague === 'all' ? null : selectedLeague, 3)
      ]);
      
      if (liveData.status === 'fulfilled' && liveData.value.response) {
        setLiveFixtures(liveData.value.response.slice(0, 5));
      }
      
      if (upcomingData.status === 'fulfilled' && upcomingData.value.response) {
        setUpcomingFixtures(upcomingData.value.response.slice(0, 5));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading sports data:', error);
      setLoading(false);
    }
  };

  const getSportIcon = (sport) => {
    switch (sport?.toLowerCase()) {
      case 'football':
      case 'soccer':
        return <Circle className="w-4 h-4" />;
      case 'basketball':
        return <Basketball className="w-4 h-4" />;
      case 'tennis':
        return <CircleDot className="w-4 h-4" />;
      case 'volleyball':
        return <Square className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMatchStatus = (fixture) => {
    if (fixture.status.short === 'LIVE') {
      return (
        <span className="flex items-center text-red-600 font-semibold">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-1"></div>
          LIVE
        </span>
      );
    }
    
    if (fixture.status.short === 'FT') {
      return <span className="text-gray-600 font-semibold">FT</span>;
    }
    
    if (fixture.status.short === 'HT') {
      return <span className="text-orange-600 font-semibold">HT</span>;
    }
    
    return <span className="text-blue-600 font-semibold">{fixture.status.short}</span>;
  };

  const renderFixture = (fixture, isLive = false) => (
    <div key={fixture.fixture.id} className={`p-3 rounded-lg border ${isLive ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getSportIcon(fixture.league?.sport)}
          <span className="text-xs text-gray-600 font-medium">
            {fixture.league?.name}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getMatchStatus(fixture)}
          <span className="text-xs text-gray-500">
            {isLive ? formatTime(fixture.fixture.date) : formatDate(fixture.fixture.date)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <div className="font-semibold text-gray-900">{fixture.teams.home.name}</div>
          <div className="text-xs text-gray-600">{fixture.teams.home.name}</div>
        </div>
        
        <div className="mx-4 text-center">
          <div className="text-lg font-bold text-gray-900">
            {fixture.goals.home !== null ? fixture.goals.home : '-'} - {fixture.goals.away !== null ? fixture.goals.away : '-'}
          </div>
          {fixture.score?.halftime && (
            <div className="text-xs text-gray-500">
              HT: {fixture.score.halftime.home}-{fixture.score.halftime.away}
            </div>
          )}
        </div>
        
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900">{fixture.teams.away.name}</div>
          <div className="text-xs text-gray-600">{fixture.teams.away.name}</div>
        </div>
      </div>
      
      {fixture.events && fixture.events.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Recent: {fixture.events.slice(0, 2).map(event => event.type).join(', ')}
          </div>
        </div>
      )}
    </div>
  );

  const renderEmptyState = (message) => (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">⚽</div>
      <p className="text-gray-600">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Live Sports
          </h3>
          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Live Sports
        </h3>
        <button
          onClick={loadSportsData}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* League Filter */}
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {leagues.map(league => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedLeague === league.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{league.icon}</span>
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'live'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          Live
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          Upcoming
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'live' ? (
          liveFixtures.length > 0 ? (
            liveFixtures.map(fixture => renderFixture(fixture, true))
          ) : (
            renderEmptyState('No live matches at the moment')
          )
        ) : (
          upcomingFixtures.length > 0 ? (
            upcomingFixtures.map(fixture => renderFixture(fixture, false))
          ) : (
            renderEmptyState('No upcoming matches scheduled')
          )
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Data from API-Football</span>
          <span>Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SportsWidget; 