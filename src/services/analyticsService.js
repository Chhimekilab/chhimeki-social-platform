// Analytics Service for User Interaction Tracking
import axios from 'axios';

class AnalyticsService {
  constructor() {
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.isOnline = navigator.onLine;
    this.apiEndpoint = process.env.REACT_APP_ANALYTICS_API || '/api/analytics';
    
    // Initialize session tracking
    this.initializeSession();
    
    // Setup event listeners for offline/online
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEventQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Auto-flush events every 30 seconds
    setInterval(() => {
      this.flushEventQueue();
    }, 30000);
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  initializeSession() {
    const sessionData = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer
    };
    
    this.trackEvent('session_start', sessionData);
  }

  setUserId(userId) {
    this.userId = userId;
    this.trackEvent('user_identified', { userId });
  }

  // Core event tracking method
  trackEvent(eventName, eventData = {}, metadata = {}) {
    const event = {
      eventId: this.generateEventId(),
      eventName,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: eventData,
      metadata: {
        url: window.location.href,
        pathname: window.location.pathname,
        ...metadata
      }
    };

    this.eventQueue.push(event);
    
    // Store in local storage as backup
    this.storeEventLocally(event);
    
    // Try to send immediately if online
    if (this.isOnline && this.eventQueue.length >= 5) {
      this.flushEventQueue();
    }
  }

  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  storeEventLocally(event) {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      storedEvents.push(event);
      
      // Keep only last 1000 events locally
      if (storedEvents.length > 1000) {
        storedEvents.splice(0, storedEvents.length - 1000);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
    } catch (error) {
      console.warn('Failed to store analytics event locally:', error);
    }
  }

  async flushEventQueue() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In a real implementation, this would send to your analytics API
      console.log('Sending analytics events:', eventsToSend);
      
      // Simulate API call - replace with actual endpoint
      // await axios.post(this.apiEndpoint + '/events', { events: eventsToSend });
      
      // Remove sent events from local storage
      this.removeEventsFromLocalStorage(eventsToSend.map(e => e.eventId));
      
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  removeEventsFromLocalStorage(eventIds) {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const filteredEvents = storedEvents.filter(event => !eventIds.includes(event.eventId));
      localStorage.setItem('analytics_events', JSON.stringify(filteredEvents));
    } catch (error) {
      console.warn('Failed to remove events from local storage:', error);
    }
  }

  // Social Media Specific Tracking Methods
  
  // Post Interactions
  trackPostView(postId, postAuthor, postType = 'text') {
    this.trackEvent('post_view', {
      postId,
      postAuthor,
      postType,
      viewDuration: 0 // This would be calculated based on scroll behavior
    });
  }

  trackPostLike(postId, postAuthor, isLiked) {
    this.trackEvent('post_like', {
      postId,
      postAuthor,
      action: isLiked ? 'like' : 'unlike'
    });
  }

  trackPostShare(postId, postAuthor, shareMethod) {
    this.trackEvent('post_share', {
      postId,
      postAuthor,
      shareMethod // 'direct_link', 'copy_link', 'social_share'
    });
  }

  trackPostComment(postId, postAuthor, commentLength) {
    this.trackEvent('post_comment', {
      postId,
      postAuthor,
      commentLength
    });
  }

  // Post Creation
  trackPostCreated(postId, postType, contentLength, hasMedia) {
    this.trackEvent('post_created', {
      postId,
      postType,
      contentLength,
      hasMedia,
      creationTime: new Date().toISOString()
    });
  }

  trackPostDraft(contentLength, hasMedia) {
    this.trackEvent('post_draft', {
      contentLength,
      hasMedia,
      draftTime: new Date().toISOString()
    });
  }

  // Navigation Tracking
  trackPageView(pageName, additionalData = {}) {
    this.trackEvent('page_view', {
      pageName,
      ...additionalData
    });
  }

  trackTabSwitch(fromTab, toTab) {
    this.trackEvent('tab_switch', {
      fromTab,
      toTab,
      switchTime: new Date().toISOString()
    });
  }

  // Search and Discovery
  trackSearch(query, resultCount, category = 'all') {
    this.trackEvent('search_performed', {
      query: query.toLowerCase(), // Anonymize if needed
      resultCount,
      category,
      queryLength: query.length
    });
  }

  trackSearchResult(query, resultPosition, resultType, resultId) {
    this.trackEvent('search_result_click', {
      query: query.toLowerCase(),
      resultPosition,
      resultType,
      resultId
    });
  }

  // Social Interactions
  trackFollow(targetUserId, action) {
    this.trackEvent('user_follow', {
      targetUserId,
      action // 'follow' or 'unfollow'
    });
  }

  trackProfileView(profileUserId, viewSource) {
    this.trackEvent('profile_view', {
      profileUserId,
      viewSource // 'search', 'post_click', 'suggestion', etc.
    });
  }

  trackMessage(recipientId, messageType, messageLength) {
    this.trackEvent('message_sent', {
      recipientId,
      messageType, // 'text', 'media', 'emoji'
      messageLength
    });
  }

  // Community Interactions
  trackCommunityJoin(communityId, communityName, joinMethod) {
    this.trackEvent('community_join', {
      communityId,
      communityName,
      joinMethod // 'search', 'invitation', 'recommendation'
    });
  }

  trackCommunityLeave(communityId, communityName, timeInCommunity) {
    this.trackEvent('community_leave', {
      communityId,
      communityName,
      timeInCommunity // in days
    });
  }

  trackCommunityPost(communityId, postId, postType) {
    this.trackEvent('community_post', {
      communityId,
      postId,
      postType
    });
  }

  // News and Content Consumption
  trackNewsArticleView(articleId, category, source, timeSpent) {
    this.trackEvent('news_article_view', {
      articleId,
      category,
      source,
      timeSpent
    });
  }

  trackNewsArticleShare(articleId, category, source, shareMethod) {
    this.trackEvent('news_article_share', {
      articleId,
      category,
      source,
      shareMethod
    });
  }

  trackCategoryFilter(category, fromCategory) {
    this.trackEvent('category_filter', {
      category,
      fromCategory
    });
  }

  // Trending Content
  trackTrendingItemView(itemId, platform, itemType, position) {
    this.trackEvent('trending_item_view', {
      itemId,
      platform, // 'twitter', 'facebook', 'tiktok', 'instagram'
      itemType,
      position
    });
  }

  trackTrendingItemClick(itemId, platform, itemType, position) {
    this.trackEvent('trending_item_click', {
      itemId,
      platform,
      itemType,
      position
    });
  }

  // Media Interactions
  trackMediaUpload(mediaType, mediaSize, uploadDuration) {
    this.trackEvent('media_upload', {
      mediaType, // 'image', 'video', 'audio'
      mediaSize,
      uploadDuration
    });
  }

  trackMediaView(mediaId, mediaType, viewDuration) {
    this.trackEvent('media_view', {
      mediaId,
      mediaType,
      viewDuration
    });
  }

  trackStoryView(storyId, storyAuthor, viewDuration) {
    this.trackEvent('story_view', {
      storyId,
      storyAuthor,
      viewDuration
    });
  }

  // Error and Performance Tracking
  trackError(errorType, errorMessage, errorLocation) {
    this.trackEvent('error_occurred', {
      errorType,
      errorMessage,
      errorLocation,
      userAgent: navigator.userAgent
    });
  }

  trackPerformance(action, duration, additionalMetrics = {}) {
    this.trackEvent('performance_metric', {
      action,
      duration,
      ...additionalMetrics
    });
  }

  // Engagement Metrics
  trackSessionDuration(duration) {
    this.trackEvent('session_duration', {
      duration,
      sessionId: this.sessionId
    });
  }

  trackScrollDepth(pageName, scrollPercentage) {
    this.trackEvent('scroll_depth', {
      pageName,
      scrollPercentage
    });
  }

  trackTimeOnPage(pageName, timeSpent) {
    this.trackEvent('time_on_page', {
      pageName,
      timeSpent
    });
  }

  // Premium Features
  trackPremiumFeatureView(featureName) {
    this.trackEvent('premium_feature_view', {
      featureName
    });
  }

  trackPremiumUpgrade(fromPlan, toPlan, triggerLocation) {
    this.trackEvent('premium_upgrade', {
      fromPlan,
      toPlan,
      triggerLocation
    });
  }

  // Notification Interactions
  trackNotificationView(notificationId, notificationType) {
    this.trackEvent('notification_view', {
      notificationId,
      notificationType
    });
  }

  trackNotificationClick(notificationId, notificationType, action) {
    this.trackEvent('notification_click', {
      notificationId,
      notificationType,
      action
    });
  }

  // Location-based tracking (with privacy considerations)
  trackLocationFeatureUse(featureName, locationAccuracy) {
    this.trackEvent('location_feature_use', {
      featureName,
      locationAccuracy, // 'city', 'neighborhood', 'approximate'
      // Never store exact coordinates for privacy
    });
  }

  // A/B Testing and Feature Flags
  trackExperimentView(experimentName, variant) {
    this.trackEvent('experiment_view', {
      experimentName,
      variant
    });
  }

  trackFeatureFlagTrigger(flagName, flagValue) {
    this.trackEvent('feature_flag_trigger', {
      flagName,
      flagValue
    });
  }

  // Data export and privacy compliance
  async exportUserData(userId) {
    try {
      // In real implementation, this would call your API
      const userData = {
        userId,
        exportTimestamp: new Date().toISOString(),
        events: JSON.parse(localStorage.getItem('analytics_events') || '[]')
          .filter(event => event.userId === userId)
      };
      
      return userData;
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  async deleteUserData(userId) {
    try {
      // Remove from local storage
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const filteredEvents = events.filter(event => event.userId !== userId);
      localStorage.setItem('analytics_events', JSON.stringify(filteredEvents));
      
      // In real implementation, this would call your API to delete server-side data
      this.trackEvent('user_data_deleted', { deletedUserId: userId });
      
      return true;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;