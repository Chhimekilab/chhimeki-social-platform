import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  TrendingUp, 
  Eye, 
  BookOpen, 
  Share, 
  Bookmark, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { generateDigest } from '../../services/digestService';

const DigestViewer = ({ subscription, onClose }) => {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    insights: false,
    trending: false,
    news: true
  });

  useEffect(() => {
    const loadDigest = async () => {
      try {
        setLoading(true);
        const generatedDigest = await generateDigest(subscription.topicId, subscription.frequency);
        setDigest(generatedDigest);
      } catch (error) {
        console.error('Error loading digest:', error);
      } finally {
        setLoading(false);
      }
    };

    if (subscription) {
      loadDigest();
    }
  }, [subscription]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📊';
      case 'monthly':
        return '📈';
      default:
        return '📋';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return '📈';
      case 'falling':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI is generating your personalized digest...</p>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full p-8 text-center">
          <p className="text-gray-600">Unable to generate digest. Please try again.</p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{getFrequencyIcon(digest.frequency)}</span>
                  <span>{digest.topicName} Digest</span>
                </h2>
                <p className="text-gray-600 text-sm">
                  {formatDate(digest.generatedAt)} • {digest.readingTime} min read
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Share className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <button
              onClick={() => toggleSection('summary')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>AI Summary</span>
              </h3>
              {expandedSections.summary ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.summary && (
              <div className="mt-4">
                <div className="prose max-w-none">
                  {digest.aiSummary.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <button
              onClick={() => toggleSection('insights')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-500" />
                <span>Key Insights</span>
              </h3>
              {expandedSections.insights ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.insights && (
              <div className="mt-4 space-y-3">
                {digest.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.category}</h4>
                      <p className="text-sm text-gray-600">{insight.insight}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact}
                      </span>
                      <span className="text-xs text-gray-500">{insight.items} items</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Topics */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <button
              onClick={() => toggleSection('trending')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>Trending Topics</span>
              </h3>
              {expandedSections.trending ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.trending && (
              <div className="mt-4 space-y-3">
                {digest.trending.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTrendIcon(topic.trend)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                        <p className="text-sm text-gray-600">{topic.mentions} mentions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${topic.relevance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{topic.relevance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* News Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <button
              onClick={() => toggleSection('news')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Featured Stories ({digest.newsItems.length})</span>
              </h3>
              {expandedSections.news ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.news && (
              <div className="mt-4 space-y-4">
                {digest.newsItems.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full ${getImpactColor(item.importance)}`}>
                            {item.importance}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Generated by AI • {formatDate(digest.generatedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Share Digest
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigestViewer;