import React, { useState } from 'react';
import { 
  Clock, 
  Eye, 
  Heart, 
  Share, 
  Bookmark,
  Play,
  ExternalLink,
  Filter,
  TrendingUp,
  Zap,
  Globe,
  Building,
  Trophy,
  Music,
  Gamepad2,
  MapPin
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';

const NewsSection = ({ selectedCategory, onCategoryChange, trendingNews = [] }) => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [likedArticles, setLikedArticles] = useState(new Set());

  const newsCategories = [
    { id: 'all', name: 'All News', icon: Globe, color: 'bg-gray-500' },
    { id: 'tech', name: 'Technology', icon: Zap, color: 'bg-blue-500' },
    { id: 'politics', name: 'Politics', icon: Building, color: 'bg-purple-500' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-green-500' },
    { id: 'culture', name: 'Culture', icon: Music, color: 'bg-pink-500' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-orange-500' },
    { id: 'local', name: 'Local', icon: MapPin, color: 'bg-red-500' }
  ];

  const handleBookmark = (articleId) => {
    const newBookmarked = new Set(bookmarkedArticles);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
    } else {
      newBookmarked.add(articleId);
    }
    setBookmarkedArticles(newBookmarked);
    analyticsService.trackEvent('article_bookmark', { articleId, bookmarked: newBookmarked.has(articleId) });
  };

  const handleLike = (articleId) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId);
    } else {
      newLiked.add(articleId);
    }
    setLikedArticles(newLiked);
    analyticsService.trackEvent('article_like', { articleId, liked: newLiked.has(articleId) });
  };

  const filteredNews = trendingNews.filter(news => 
    selectedCategory === 'all' || news.category === selectedCategory
  );

  const featuredArticle = filteredNews.find(news => news.trending) || filteredNews[0];
  const regularArticles = filteredNews.filter(news => news.id !== featuredArticle?.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">News & Analysis</h1>
          <p className="text-gray-600">Stay informed with the latest stories and insights</p>
        </div>
        <button className="airbnb-button airbnb-button-secondary">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Category Navigation */}
      <div className="bbc-card p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {newsCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="bbc-section">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Featured Story</h2>
            <div className="w-12 h-1 bg-red-600 rounded"></div>
          </div>
          
          <article className="content-card group cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                  <Play className="w-16 h-16 text-red-400" />
                </div>
                {featuredArticle.trending && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Trending
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="content-meta mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                    newsCategories.find(cat => cat.id === featuredArticle.category)?.color || 'bg-gray-500'
                  }`}>
                    {newsCategories.find(cat => cat.id === featuredArticle.category)?.name || 'News'}
                  </span>
                  <span>•</span>
                  <span>{featuredArticle.source}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{featuredArticle.time}</span>
                </div>
                
                <h1 className="reading-title text-2xl lg:text-3xl mb-4 group-hover:text-red-600 transition-colors">
                  {featuredArticle.title}
                </h1>
                
                <p className="reading-text text-gray-600 mb-6">
                  {featuredArticle.summary}
                </p>
                
                <div className="content-actions">
                  <button 
                    onClick={() => handleLike(featuredArticle.id)}
                    className={`action-button ${likedArticles.has(featuredArticle.id) ? 'text-red-600' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${likedArticles.has(featuredArticle.id) ? 'fill-current' : ''}`} />
                    <span>{featuredArticle.engagement}</span>
                  </button>
                  
                  <button className="action-button">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  
                  <button 
                    onClick={() => handleBookmark(featuredArticle.id)}
                    className={`action-button ${bookmarkedArticles.has(featuredArticle.id) ? 'text-red-600' : ''}`}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedArticles.has(featuredArticle.id) ? 'fill-current' : ''}`} />
                    <span>Save</span>
                  </button>
                  
                  <button className="action-button text-red-600 font-semibold ml-auto">
                    <span>Read full story</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Regular Articles Grid */}
      <section className="bbc-section">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Latest Stories</h2>
          <div className="w-12 h-1 bg-red-600 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <article key={article.id} className="bbc-card p-6 group cursor-pointer">
              <div className="content-meta mb-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                  newsCategories.find(cat => cat.id === article.category)?.color || 'bg-gray-500'
                }`}>
                  {newsCategories.find(cat => cat.id === article.category)?.name || 'News'}
                </span>
                {article.trending && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
                    🔥 Trending
                  </span>
                )}
              </div>
              
              <h3 className="reading-title text-lg mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.summary}
              </p>
              
              <div className="content-meta mb-4">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.time}</span>
              </div>
              
              <div className="content-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(article.id);
                  }}
                  className={`action-button ${likedArticles.has(article.id) ? 'text-red-600' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${likedArticles.has(article.id) ? 'fill-current' : ''}`} />
                  <span>{article.engagement}</span>
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(article.id);
                  }}
                  className={`action-button ${bookmarkedArticles.has(article.id) ? 'text-red-600' : ''}`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedArticles.has(article.id) ? 'fill-current' : ''}`} />
                </button>
                
                <button className="action-button ml-auto">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="text-center">
        <button className="airbnb-button airbnb-button-secondary">
          Load more stories
        </button>
      </div>
    </div>
  );
};

export default NewsSection;