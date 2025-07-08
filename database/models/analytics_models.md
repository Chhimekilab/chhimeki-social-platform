# Analytics Data Models Documentation

## Overview

This document describes the complete analytics data structure for the Chhimeki Social Media Platform. The analytics system is designed to capture comprehensive user interaction data from the very beginning, enabling detailed analysis of user behavior, content performance, and platform metrics.

## Core Architecture

### Event-Driven Analytics
The system uses an event-driven architecture where every user interaction generates an event that is captured, stored, and processed for analytics. This ensures no user behavior is missed and provides granular insights.

### Modern Database Design
- **Primary Database**: PostgreSQL 15+ with modern features
- **Partitioning**: Events table partitioned by month for performance
- **JSONB Fields**: Flexible data storage for varying event structures
- **Materialized Views**: Pre-calculated metrics for dashboard performance
- **Real-time Processing**: Events processed in real-time with offline fallback

## Data Models

### 1. Users Table

Primary user information with analytics-focused fields.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    role user_role DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_active_at TIMESTAMP WITH TIME ZONE,
    
    -- Demographics
    timezone VARCHAR(50),
    language VARCHAR(10),
    country_code VARCHAR(3),
    registration_source VARCHAR(100),
    
    -- Analytics Counters
    total_posts INTEGER DEFAULT 0,
    total_likes_given INTEGER DEFAULT 0,
    total_likes_received INTEGER DEFAULT 0,
    total_comments_given INTEGER DEFAULT 0,
    total_comments_received INTEGER DEFAULT 0,
    total_shares_given INTEGER DEFAULT 0,
    total_shares_received INTEGER DEFAULT 0,
    total_followers INTEGER DEFAULT 0,
    total_following INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_session_duration INTERVAL DEFAULT INTERVAL '0',
    
    -- Calculated Metrics
    engagement_score DECIMAL(10,4) DEFAULT 0.0
);
```

**Key Analytics Fields:**
- `engagement_score`: Calculated metric combining activity, social, and consistency scores
- `registration_source`: Tracks acquisition channels (organic, referral, social, ads)
- `total_*` fields: Maintain running totals for quick access
- `last_active_at`: Essential for retention analysis

### 2. User Sessions Table

Detailed session tracking for user journey analysis.

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE,
    platform platform_type,
    
    -- Device Information
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    screen_resolution VARCHAR(20),
    viewport_size VARCHAR(20),
    
    -- Session Metrics
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTERVAL,
    page_views INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    
    -- Geography (anonymized)
    city VARCHAR(100),
    region VARCHAR(100),
    country VARCHAR(3),
    
    -- Quality Metrics
    bounce_rate DECIMAL(5,4),
    scroll_depth_avg DECIMAL(5,4),
    time_to_first_interaction INTERVAL
);
```

**Privacy Considerations:**
- IP addresses stored for security but anonymized in analytics
- Geolocation limited to city level for privacy
- Device info stored as JSONB for flexibility

### 3. Events Table (Core Analytics)

The heart of the analytics system - partitioned for performance.

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES user_sessions(id),
    
    -- Event Classification
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    
    -- Timing
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client_timestamp TIMESTAMP WITH TIME ZONE,
    server_processing_time INTERVAL,
    
    -- Flexible Data Storage
    event_data JSONB DEFAULT '{}',
    
    -- Context
    url TEXT,
    pathname VARCHAR(255),
    referrer TEXT,
    platform platform_type,
    browser VARCHAR(50),
    browser_version VARCHAR(20),
    os VARCHAR(50),
    os_version VARCHAR(20),
    
    -- Data Quality
    status event_status DEFAULT 'pending',
    is_valid BOOLEAN DEFAULT true,
    validation_errors JSONB
) PARTITION BY RANGE (timestamp);
```

**Event Categories:**
- `user_action`: User-initiated interactions
- `system`: System-generated events
- `error`: Error tracking
- `performance`: Performance metrics

**Common Event Types:**
- `session_start`, `session_end`
- `page_view`, `tab_switch`
- `post_created`, `post_view`, `post_like`, `post_share`, `post_comment`
- `user_follow`, `profile_view`, `message_sent`
- `community_join`, `community_leave`, `community_post`
- `news_article_view`, `news_article_share`
- `trending_item_view`, `trending_item_click`
- `search_performed`, `search_result_click`
- `media_upload`, `media_view`, `story_view`
- `error_occurred`, `performance_metric`

### 4. User Interactions Daily (Aggregated)

Pre-aggregated daily metrics for faster dashboard queries.

```sql
CREATE TABLE user_interactions_daily (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    
    -- Content Interactions
    posts_created INTEGER DEFAULT 0,
    posts_viewed INTEGER DEFAULT 0,
    posts_liked INTEGER DEFAULT 0,
    posts_shared INTEGER DEFAULT 0,
    comments_posted INTEGER DEFAULT 0,
    
    -- Social Interactions
    follows_made INTEGER DEFAULT 0,
    unfollows_made INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    
    -- Content Consumption
    news_articles_viewed INTEGER DEFAULT 0,
    trending_items_viewed INTEGER DEFAULT 0,
    stories_viewed INTEGER DEFAULT 0,
    media_uploaded INTEGER DEFAULT 0,
    
    -- Community Activity
    communities_joined INTEGER DEFAULT 0,
    communities_left INTEGER DEFAULT 0,
    community_posts INTEGER DEFAULT 0,
    
    -- Session Data
    sessions_count INTEGER DEFAULT 0,
    total_session_duration INTERVAL DEFAULT INTERVAL '0',
    pages_viewed INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    engagement_score DECIMAL(10,4) DEFAULT 0.0
);
```

### 5. Content Analytics

Performance metrics for all content types.

```sql
CREATE TABLE content_analytics (
    id UUID PRIMARY KEY,
    content_id UUID NOT NULL,
    content_type VARCHAR(50), -- 'post', 'news_article', 'story', 'comment'
    author_id UUID REFERENCES users(id),
    
    -- Basic Metrics
    views_count INTEGER DEFAULT 0,
    unique_views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    
    -- Engagement Analysis
    avg_view_duration INTERVAL,
    total_view_duration INTERVAL,
    bounce_rate DECIMAL(5,4),
    
    -- Viral Metrics
    shares_to_views_ratio DECIMAL(5,4),
    comments_to_views_ratio DECIMAL(5,4),
    viral_coefficient DECIMAL(10,4),
    
    -- Geographic Data
    top_countries JSONB,
    top_cities JSONB,
    
    -- Performance Scores
    engagement_score DECIMAL(10,4) DEFAULT 0.0,
    quality_score DECIMAL(10,4) DEFAULT 0.0,
    virality_score DECIMAL(10,4) DEFAULT 0.0
);
```

### 6. Community Analytics

Community-specific metrics and growth tracking.

```sql
CREATE TABLE community_analytics (
    id UUID PRIMARY KEY,
    community_id UUID NOT NULL,
    date DATE NOT NULL,
    
    -- Membership Metrics
    members_count INTEGER DEFAULT 0,
    new_members INTEGER DEFAULT 0,
    members_left INTEGER DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    
    -- Content Metrics
    posts_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    avg_posts_per_member DECIMAL(10,4),
    engagement_rate DECIMAL(5,4),
    retention_rate DECIMAL(5,4),
    growth_rate DECIMAL(5,4),
    churn_rate DECIMAL(5,4)
);
```

### 7. A/B Testing Framework

Built-in experimentation platform.

```sql
CREATE TABLE experiments (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    
    -- Configuration
    variants JSONB NOT NULL,
    traffic_allocation JSONB,
    target_metrics JSONB,
    
    -- Results
    statistical_significance DECIMAL(5,4),
    winning_variant VARCHAR(50),
    confidence_level DECIMAL(5,4)
);

CREATE TABLE experiment_assignments (
    id UUID PRIMARY KEY,
    experiment_id UUID REFERENCES experiments(id),
    user_id UUID REFERENCES users(id),
    variant VARCHAR(50),
    assigned_at TIMESTAMP WITH TIME ZONE
);
```

### 8. Error Tracking

Comprehensive error monitoring.

```sql
CREATE TABLE error_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES user_sessions(id),
    
    error_type VARCHAR(100),
    error_message TEXT,
    error_stack TEXT,
    
    -- Context
    url TEXT,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Classification
    severity VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(50),
    
    -- Resolution
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id)
);
```

### 9. Performance Metrics

Application performance monitoring.

```sql
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES user_sessions(id),
    
    metric_name VARCHAR(100),
    metric_value DECIMAL(15,6),
    metric_unit VARCHAR(20), -- 'ms', 'bytes', 'count', 'percentage'
    
    -- Context
    page_url TEXT,
    browser VARCHAR(50),
    platform platform_type,
    timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Additional Data
    metadata JSONB
);
```

## Event Data Structures

### Standard Event Structure

Every event follows this standard structure:

```json
{
  "eventId": "evt_1703123456789_abc123",
  "eventName": "post_like",
  "userId": "user_123",
  "sessionId": "session_456",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "postId": "post_789",
    "postAuthor": "john_doe",
    "action": "like"
  },
  "metadata": {
    "url": "https://app.com/home",
    "pathname": "/home",
    "referrer": "https://app.com/trending"
  }
}
```

### Event-Specific Data Structures

#### Post Interactions
```json
{
  "eventName": "post_like",
  "data": {
    "postId": "post_123",
    "postAuthor": "author_id",
    "action": "like|unlike"
  }
}

{
  "eventName": "post_view",
  "data": {
    "postId": "post_123",
    "postAuthor": "author_id",
    "postType": "text|image|video",
    "viewDuration": 5000
  }
}

{
  "eventName": "post_created",
  "data": {
    "postId": "post_123",
    "postType": "text|image|video",
    "contentLength": 150,
    "hasMedia": false,
    "creationTime": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Social Interactions
```json
{
  "eventName": "user_follow",
  "data": {
    "targetUserId": "user_456",
    "action": "follow|unfollow"
  }
}

{
  "eventName": "message_sent",
  "data": {
    "recipientId": "user_789",
    "messageType": "text|media|emoji",
    "messageLength": 50
  }
}
```

#### Content Consumption
```json
{
  "eventName": "news_article_view",
  "data": {
    "articleId": "article_123",
    "category": "tech|politics|sports|culture",
    "source": "TechCrunch",
    "timeSpent": 30000
  }
}

{
  "eventName": "trending_item_click",
  "data": {
    "itemId": "#TechTrends",
    "platform": "twitter|facebook|tiktok|instagram",
    "itemType": "hashtag|topic|trend|content",
    "position": 3
  }
}
```

## Analytics Processing Pipeline

### 1. Event Collection
- Client-side JavaScript SDK captures events
- Events queued locally with offline support
- Automatic batching and retry logic
- Real-time transmission when online

### 2. Event Processing
- Server-side validation and enrichment
- Duplicate detection and deduplication
- Data quality checks and error flagging
- Real-time routing to appropriate processors

### 3. Data Aggregation
- Real-time aggregation for live dashboards
- Batch processing for historical analysis
- Pre-calculated metrics for performance
- Materialized views for complex queries

### 4. Analytics Output
- Real-time dashboards
- Scheduled reports
- A/B testing results
- Performance monitoring alerts

## Key Analytics Metrics

### User Engagement
- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **Session Duration**
- **Page Views per Session**
- **Bounce Rate**
- **Engagement Score** (composite metric)

### Content Performance
- **View Count** and **Unique Views**
- **Engagement Rate** (likes + comments + shares / views)
- **Viral Coefficient** (shares per view)
- **Time Spent** on content
- **Comment-to-View Ratio**

### Social Metrics
- **Follow/Unfollow Rates**
- **Message Volume**
- **Community Growth**
- **User-to-User Interactions**

### Platform Health
- **Error Rates** by category
- **Performance Metrics** (load times, etc.)
- **Feature Adoption Rates**
- **Conversion Funnels**

## Privacy and Compliance

### Data Protection
- **GDPR Compliance**: Full data export and deletion capabilities
- **Data Anonymization**: Automatic PII removal after retention period
- **Consent Management**: Granular tracking permissions
- **Data Minimization**: Only collect necessary data

### Security
- **Data Encryption**: At rest and in transit
- **Access Controls**: Role-based permissions
- **Audit Logging**: All data access logged
- **Retention Policies**: Automatic data cleanup

## Performance Optimization

### Database Performance
- **Partitioning**: Events table partitioned by month
- **Indexing**: Optimized indexes for analytics queries
- **Materialized Views**: Pre-calculated aggregations
- **Query Optimization**: Efficient query patterns

### Scalability
- **Horizontal Partitioning**: Distribute data across servers
- **Read Replicas**: Separate analytics queries from transactional
- **Caching**: Redis for frequently accessed metrics
- **CDN**: Geographic distribution of analytics endpoints

## Future Enhancements

### Advanced Analytics
- **Machine Learning**: Predictive analytics and recommendations
- **Cohort Analysis**: User behavior over time
- **Funnel Analysis**: Conversion tracking
- **Attribution Modeling**: Multi-touch attribution

### Real-time Features
- **Live Dashboards**: Real-time metric updates
- **Alerts**: Automated anomaly detection
- **Streaming Analytics**: Apache Kafka integration
- **Real-time Personalization**: Dynamic content optimization

This comprehensive analytics system provides the foundation for understanding user behavior, optimizing platform performance, and driving data-informed decisions for the social media platform.