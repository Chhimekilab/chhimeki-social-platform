import React from 'react';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin, 
  Zap,
  Video,
  Mic,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const MainLayout = ({ children, activeTab, featuredContent = [], liveContent = [], elsewhereContent = [] }) => {
  
  const renderTopStories = () => (
    <section className="bbc-section">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Stories</h2>
        <div className="w-12 h-1 bg-red-600 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Story */}
        <div className="lg:col-span-2">
          <article className="content-card group cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <Video className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <div className="content-meta">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">BREAKING</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>2 hours ago</span>
            </div>
            <h1 className="reading-title text-2xl mb-3 group-hover:text-red-600 transition-colors">
              The Future of Social Media Privacy: Building Platforms That Respect Users
            </h1>
            <p className="reading-text text-gray-600 mb-4">
              As we navigate an increasingly connected world, the importance of digital privacy cannot be overstated. 
              Here are the key developments shaping how social platforms handle user data...
            </p>
            <div className="flex items-center text-red-600 font-medium">
              <span>Read full story</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </article>
        </div>
        
        {/* Side Stories */}
        <div className="space-y-4">
          {featuredContent.slice(0, 3).map((item, index) => (
            <article key={index} className="bbc-card p-4 group cursor-pointer">
              <div className="content-meta">
                <span className="text-xs font-semibold text-red-600">FEATURED</span>
                <span>•</span>
                <span>{item.time || '1h ago'}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {item.title || 'Tech Innovators Share Insights on Community Building'}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.summary || 'Industry leaders discuss the future of online communities and social platforms.'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const renderLiveSection = () => (
    <section className="bbc-section">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold text-gray-900">Live & Breaking</h2>
        </div>
        <div className="w-12 h-1 bg-red-600 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveContent.map((item, index) => (
          <div key={index} className="bbc-card p-4 group cursor-pointer">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-red-600 uppercase">LIVE</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
              {item.title || 'Community Discussion Live'}
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {item.description || 'Join the ongoing conversation about digital privacy'}
            </p>
            <div className="flex items-center text-red-600 text-sm font-medium">
              <Zap className="w-4 h-4 mr-1" />
              <span>Join now</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderElsewhereSection = () => (
    <section className="bbc-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Elsewhere on Chhimeki */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Elsewhere on Chhimeki</h2>
            <div className="w-12 h-1 bg-gray-400 rounded"></div>
          </div>
          
          <div className="space-y-4">
            {elsewhereContent.slice(0, 4).map((item, index) => (
              <article key={index} className="group cursor-pointer">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    {item.type === 'audio' ? (
                      <Mic className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Video className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title || 'Community Spotlight: Local Business Success Stories'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {item.source || 'Chhimeki Community'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      {item.type === 'audio' && <Mic className="w-3 h-3 mr-1" />}
                      <span>{item.duration || '15 min'}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        
        {/* Elsewhere in Social */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Elsewhere in Social</h2>
            <div className="w-12 h-1 bg-gray-400 rounded"></div>
          </div>
          
          <div className="space-y-4">
            {[
              {
                title: "Why don't we trust social media algorithms?",
                source: "Tech Analysis",
                image: true
              },
              {
                title: "The rise of community-driven platforms",
                source: "Digital Trends",
                video: true
              },
              {
                title: "Local businesses thrive on neighborhood apps",
                source: "Business Weekly",
                image: true
              },
              {
                title: "Privacy-first social networks gain momentum",
                source: "Privacy Report",
                video: true
              }
            ].map((item, index) => (
              <article key={index} className="group cursor-pointer">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    {item.video ? (
                      <Video className="w-6 h-6 text-blue-400" />
                    ) : (
                      <div className="w-6 h-6 bg-blue-400 rounded"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.source}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      {item.video && <Video className="w-3 h-3 mr-1" />}
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderQuickStats = () => (
    <section className="bbc-section">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Communities', value: '2.3K', icon: Users, color: 'text-blue-600' },
          { label: 'Local Businesses', value: '456', icon: MapPin, color: 'text-green-600' },
          { label: 'Trending Topics', value: '89', icon: TrendingUp, color: 'text-orange-600' },
          { label: 'Live Discussions', value: '12', icon: Zap, color: 'text-red-600' }
        ].map((stat, index) => (
          <div key={index} className="bbc-card p-4 text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bbc-container py-6">
        {activeTab === 'home' && (
          <>
            {renderTopStories()}
            {renderLiveSection()}
            {renderQuickStats()}
            {renderElsewhereSection()}
          </>
        )}
        
        {activeTab !== 'home' && (
          <div className="fade-in">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;