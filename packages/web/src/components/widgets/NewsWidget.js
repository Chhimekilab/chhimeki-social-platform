import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../services/realApis';
import { 
  Newspaper, 
  Globe, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  RefreshCw,
  BookOpen,
  Briefcase,
  Heart,
  Zap,
  Shield,
  Palette
} from 'lucide-react';

const NewsWidget = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    { id: 'general', name: 'General', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-500' },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-4 h-4" />, color: 'bg-green-500' },
    { id: 'technology', name: 'Technology', icon: <Zap className="w-4 h-4" />, color: 'bg-purple-500' },
    { id: 'health', name: 'Health', icon: <Heart className="w-4 h-4" />, color: 'bg-red-500' },
    { id: 'science', name: 'Science', icon: <BookOpen className="w-4 h-4" />, color: 'bg-indigo-500' },
    { id: 'sports', name: 'Sports', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-orange-500' },
    { id: 'entertainment', name: 'Entertainment', icon: <Palette className="w-4 h-4" />, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    loadNews();
    
    // Refresh every 10 minutes
    const interval = setInterval(loadNews, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      
      let newsData;
      
      if (searchQuery.trim()) {
        newsData = await newsAPI.searchNews(searchQuery);
      } else {
        newsData = await newsAPI.getNewsByCategory(selectedCategory);
      }
      
      if (newsData && newsData.articles) {
        setNews(newsData.articles.slice(0, 8));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading news:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadNews();
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : <Globe className="w-4 h-4" />;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-500';
  };

  const renderNewsItem = (article, index) => (
    <div key={article.url || index} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {article.urlToImage && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(selectedCategory)}`}>
              {categories.find(cat => cat.id === selectedCategory)?.name || 'News'}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(selectedCategory)}
            <span className="text-xs text-gray-600 font-medium">
              {article.source?.name || 'News Source'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {truncateText(article.description || article.content, 120)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {article.author && (
              <span className="text-xs text-gray-500">
                By {article.author}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(article.url, '_blank')}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Read</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (message) => (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">📰</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={loadNews}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        🔄 Refresh News
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            Latest News
          </h3>
          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Newspaper className="w-5 h-5 mr-2" />
          Latest News
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Search"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={loadNews}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery('');
                setShowSearch(false);
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((article, index) => renderNewsItem(article, index))}
        </div>
      ) : (
        renderEmptyState(
          searchQuery 
            ? `No news found for "${searchQuery}"`
            : 'No news available at the moment'
        )
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Data from NewsAPI.org</span>
          <span>Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsWidget; 