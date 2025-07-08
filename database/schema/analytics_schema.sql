-- Analytics Database Schema for Social Media Platform
-- PostgreSQL 15+ with modern features and analytics optimization

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Custom types for better data integrity
CREATE TYPE event_status AS ENUM ('pending', 'processed', 'failed', 'archived');
CREATE TYPE user_role AS ENUM ('free', 'premium', 'admin', 'moderator');
CREATE TYPE platform_type AS ENUM ('web', 'mobile_ios', 'mobile_android', 'desktop');
CREATE TYPE interaction_type AS ENUM ('view', 'click', 'like', 'share', 'comment', 'follow', 'message', 'upload');

-- Users table with analytics-focused fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    country_code VARCHAR(3),
    registration_source VARCHAR(100), -- 'organic', 'referral', 'social', 'ads'
    
    -- Analytics fields
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
    last_post_at TIMESTAMP WITH TIME ZONE,
    
    -- Engagement scoring (calculated field)
    engagement_score DECIMAL(10,4) DEFAULT 0.0,
    
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]{3,50}$')
);

-- User sessions for detailed session analytics
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    platform platform_type NOT NULL,
    device_info JSONB, -- Store device details as JSON
    ip_address INET,
    user_agent TEXT,
    screen_resolution VARCHAR(20),
    viewport_size VARCHAR(20),
    timezone VARCHAR(50),
    language VARCHAR(10),
    referrer TEXT,
    
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTERVAL,
    page_views INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    
    -- Geolocation (anonymized to city level for privacy)
    city VARCHAR(100),
    region VARCHAR(100),
    country VARCHAR(3),
    
    -- Session quality metrics
    bounce_rate DECIMAL(5,4), -- 0.0 to 1.0
    scroll_depth_avg DECIMAL(5,4), -- Average scroll depth across pages
    time_to_first_interaction INTERVAL,
    
    INDEX idx_user_sessions_user_id (user_id),
    INDEX idx_user_sessions_started_at (started_at),
    INDEX idx_user_sessions_platform (platform)
);

-- Events table - the core analytics table with partitioning
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50), -- 'user_action', 'system', 'error', 'performance'
    
    -- Event timing
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client_timestamp TIMESTAMP WITH TIME ZONE,
    server_processing_time INTERVAL,
    
    -- Event data stored as JSONB for flexibility
    event_data JSONB DEFAULT '{}',
    
    -- Context information
    url TEXT,
    pathname VARCHAR(255),
    referrer TEXT,
    
    -- Technical context
    platform platform_type,
    browser VARCHAR(50),
    browser_version VARCHAR(20),
    os VARCHAR(50),
    os_version VARCHAR(20),
    
    -- Processing status
    status event_status DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Data quality
    is_valid BOOLEAN DEFAULT true,
    validation_errors JSONB,
    
    -- Indexing for analytics queries
    INDEX idx_events_user_id (user_id),
    INDEX idx_events_session_id (session_id),
    INDEX idx_events_timestamp (timestamp),
    INDEX idx_events_event_name (event_name),
    INDEX idx_events_event_category (event_category),
    INDEX idx_events_platform (platform),
    INDEX idx_events_status (status),
    
    -- GIN indexes for JSONB queries
    INDEX idx_events_event_data_gin (event_data USING gin),
    
    -- Composite indexes for common queries
    INDEX idx_events_user_timestamp (user_id, timestamp DESC),
    INDEX idx_events_name_timestamp (event_name, timestamp DESC)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions for events table (example for 2024-2025)
CREATE TABLE events_2024_01 PARTITION OF events FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE events_2024_02 PARTITION OF events FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE events_2024_03 PARTITION OF events FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE events_2024_04 PARTITION OF events FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE events_2024_05 PARTITION OF events FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE events_2024_06 PARTITION OF events FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE events_2024_07 PARTITION OF events FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE events_2024_08 PARTITION OF events FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE events_2024_09 PARTITION OF events FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE events_2024_10 PARTITION OF events FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE events_2024_11 PARTITION OF events FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE events_2024_12 PARTITION OF events FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE events_2025_01 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- User interactions aggregated table for faster queries
CREATE TABLE user_interactions_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Interaction counts
    posts_created INTEGER DEFAULT 0,
    posts_viewed INTEGER DEFAULT 0,
    posts_liked INTEGER DEFAULT 0,
    posts_shared INTEGER DEFAULT 0,
    comments_posted INTEGER DEFAULT 0,
    
    -- Social interactions
    follows_made INTEGER DEFAULT 0,
    unfollows_made INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    
    -- Content consumption
    news_articles_viewed INTEGER DEFAULT 0,
    trending_items_viewed INTEGER DEFAULT 0,
    stories_viewed INTEGER DEFAULT 0,
    media_uploaded INTEGER DEFAULT 0,
    
    -- Community interactions
    communities_joined INTEGER DEFAULT 0,
    communities_left INTEGER DEFAULT 0,
    community_posts INTEGER DEFAULT 0,
    
    -- Session data
    sessions_count INTEGER DEFAULT 0,
    total_session_duration INTERVAL DEFAULT INTERVAL '0',
    pages_viewed INTEGER DEFAULT 0,
    
    -- Engagement metrics
    engagement_score DECIMAL(10,4) DEFAULT 0.0,
    
    -- Constraints
    UNIQUE(user_id, date),
    INDEX idx_user_interactions_user_date (user_id, date),
    INDEX idx_user_interactions_date (date),
    INDEX idx_user_interactions_engagement (engagement_score DESC)
);

-- Content analytics table
CREATE TABLE content_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL, -- References posts, news articles, etc.
    content_type VARCHAR(50) NOT NULL, -- 'post', 'news_article', 'story', 'comment'
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Content metrics
    views_count INTEGER DEFAULT 0,
    unique_views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    
    -- Engagement timing
    avg_view_duration INTERVAL,
    total_view_duration INTERVAL,
    bounce_rate DECIMAL(5,4),
    
    -- Viral metrics
    shares_to_views_ratio DECIMAL(5,4),
    comments_to_views_ratio DECIMAL(5,4),
    viral_coefficient DECIMAL(10,4),
    
    -- Geographic distribution
    top_countries JSONB, -- Array of country codes with view counts
    top_cities JSONB,    -- Array of cities with view counts
    
    -- Time-based metrics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    peak_activity_time TIME,
    
    -- Performance scoring
    engagement_score DECIMAL(10,4) DEFAULT 0.0,
    quality_score DECIMAL(10,4) DEFAULT 0.0,
    virality_score DECIMAL(10,4) DEFAULT 0.0,
    
    INDEX idx_content_analytics_content (content_id, content_type),
    INDEX idx_content_analytics_author (author_id),
    INDEX idx_content_analytics_engagement (engagement_score DESC),
    INDEX idx_content_analytics_created (created_at DESC)
);

-- Community analytics
CREATE TABLE community_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL,
    date DATE NOT NULL,
    
    -- Member metrics
    members_count INTEGER DEFAULT 0,
    new_members INTEGER DEFAULT 0,
    members_left INTEGER DEFAULT 0,
    active_members INTEGER DEFAULT 0, -- Members who interacted that day
    
    -- Content metrics
    posts_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    
    -- Engagement metrics
    avg_posts_per_member DECIMAL(10,4) DEFAULT 0.0,
    engagement_rate DECIMAL(5,4) DEFAULT 0.0,
    retention_rate DECIMAL(5,4) DEFAULT 0.0,
    
    -- Growth metrics
    growth_rate DECIMAL(5,4) DEFAULT 0.0,
    churn_rate DECIMAL(5,4) DEFAULT 0.0,
    
    UNIQUE(community_id, date),
    INDEX idx_community_analytics_community_date (community_id, date),
    INDEX idx_community_analytics_date (date)
);

-- A/B Testing and Feature Flags
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'completed'
    
    -- Experiment configuration
    variants JSONB NOT NULL, -- Array of variant configurations
    traffic_allocation JSONB, -- Percentage allocation per variant
    target_metrics JSONB, -- Metrics to track for this experiment
    
    -- Results
    statistical_significance DECIMAL(5,4),
    winning_variant VARCHAR(50),
    confidence_level DECIMAL(5,4),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE TABLE experiment_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    variant VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(experiment_id, user_id),
    INDEX idx_experiment_assignments_experiment (experiment_id),
    INDEX idx_experiment_assignments_user (user_id)
);

-- Error tracking and monitoring
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    error_stack TEXT,
    
    -- Context
    url TEXT,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Error categorization
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    category VARCHAR(50), -- 'javascript', 'network', 'server', 'validation'
    
    -- Resolution tracking
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    
    INDEX idx_error_logs_timestamp (timestamp DESC),
    INDEX idx_error_logs_type (error_type),
    INDEX idx_error_logs_severity (severity),
    INDEX idx_error_logs_resolved (resolved)
);

-- Performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6),
    metric_unit VARCHAR(20), -- 'ms', 'bytes', 'count', 'percentage'
    
    -- Context
    page_url TEXT,
    browser VARCHAR(50),
    platform platform_type,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional data
    metadata JSONB,
    
    INDEX idx_performance_metrics_name_timestamp (metric_name, timestamp DESC),
    INDEX idx_performance_metrics_user (user_id),
    INDEX idx_performance_metrics_session (session_id)
);

-- Data retention and privacy compliance
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    retention_period INTERVAL NOT NULL,
    anonymization_period INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR compliance - user data requests
CREATE TABLE gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(20) NOT NULL, -- 'export', 'delete', 'rectify'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Request details
    data_types JSONB, -- Specific data types requested
    export_url TEXT, -- For data export requests
    
    INDEX idx_gdpr_requests_user (user_id),
    INDEX idx_gdpr_requests_status (status),
    INDEX idx_gdpr_requests_requested_at (requested_at)
);

-- Views for common analytics queries
CREATE VIEW user_engagement_summary AS
SELECT 
    u.id,
    u.username,
    u.role,
    u.created_at,
    u.last_active_at,
    u.total_sessions,
    u.total_session_duration,
    u.engagement_score,
    
    -- Recent activity (last 30 days)
    COALESCE(SUM(uid.posts_created), 0) as posts_last_30d,
    COALESCE(SUM(uid.posts_liked), 0) as likes_last_30d,
    COALESCE(SUM(uid.comments_posted), 0) as comments_last_30d,
    COALESCE(SUM(uid.sessions_count), 0) as sessions_last_30d,
    COALESCE(SUM(EXTRACT(EPOCH FROM uid.total_session_duration)), 0) as session_time_last_30d
    
FROM users u
LEFT JOIN user_interactions_daily uid ON u.id = uid.user_id 
    AND uid.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.username, u.role, u.created_at, u.last_active_at, 
         u.total_sessions, u.total_session_duration, u.engagement_score;

CREATE VIEW daily_platform_metrics AS
SELECT 
    DATE(timestamp) as date,
    platform,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(DISTINCT session_id) as sessions,
    
    -- Engagement events
    COUNT(*) FILTER (WHERE event_name IN ('post_like', 'post_share', 'post_comment')) as engagement_events,
    COUNT(*) FILTER (WHERE event_name = 'post_created') as posts_created,
    COUNT(*) FILTER (WHERE event_name = 'user_follow') as follows,
    
    -- Error rate
    COUNT(*) FILTER (WHERE event_category = 'error') as errors,
    ROUND(
        (COUNT(*) FILTER (WHERE event_category = 'error')::DECIMAL / COUNT(*)) * 100, 
        2
    ) as error_rate_percent
    
FROM events
WHERE timestamp >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(timestamp), platform
ORDER BY date DESC, platform;

-- Functions for automatic data aggregation
CREATE OR REPLACE FUNCTION update_user_engagement_score(user_uuid UUID)
RETURNS DECIMAL(10,4) AS $$
DECLARE
    score DECIMAL(10,4) := 0.0;
    recent_activity INTEGER;
    social_score DECIMAL(10,4);
    consistency_score DECIMAL(10,4);
BEGIN
    -- Calculate engagement score based on recent activity
    SELECT 
        COALESCE(SUM(posts_created * 10 + posts_liked * 2 + comments_posted * 5 + 
                     messages_sent * 3 + follows_made * 4), 0)
    INTO recent_activity
    FROM user_interactions_daily 
    WHERE user_id = user_uuid 
    AND date >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Social score (followers, following ratio)
    SELECT 
        CASE 
            WHEN total_following > 0 THEN 
                LEAST((total_followers::DECIMAL / total_following) * 20, 100)
            ELSE total_followers * 2
        END
    INTO social_score
    FROM users 
    WHERE id = user_uuid;
    
    -- Consistency score (how regularly user is active)
    SELECT 
        (COUNT(DISTINCT date)::DECIMAL / 30) * 30
    INTO consistency_score
    FROM user_interactions_daily 
    WHERE user_id = user_uuid 
    AND date >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Combine scores with weights
    score := (recent_activity * 0.4) + (COALESCE(social_score, 0) * 0.3) + (COALESCE(consistency_score, 0) * 0.3);
    
    -- Update user record
    UPDATE users 
    SET engagement_score = score, updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_user_stats_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user interaction counts based on events
    IF NEW.event_name = 'post_created' THEN
        UPDATE users SET total_posts = total_posts + 1 WHERE id = NEW.user_id;
    ELSIF NEW.event_name = 'post_like' AND (NEW.event_data->>'action') = 'like' THEN
        UPDATE users SET total_likes_given = total_likes_given + 1 WHERE id = NEW.user_id;
    ELSIF NEW.event_name = 'post_comment' THEN
        UPDATE users SET total_comments_given = total_comments_given + 1 WHERE id = NEW.user_id;
    ELSIF NEW.event_name = 'post_share' THEN
        UPDATE users SET total_shares_given = total_shares_given + 1 WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_update_user_stats
    AFTER INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_trigger();

-- Create indexes for optimal query performance
CREATE INDEX CONCURRENTLY idx_events_user_event_time ON events (user_id, event_name, timestamp DESC);
CREATE INDEX CONCURRENTLY idx_events_jsonb_post_id ON events USING gin ((event_data->>'postId')) WHERE event_data ? 'postId';
CREATE INDEX CONCURRENTLY idx_users_engagement_score ON users (engagement_score DESC);
CREATE INDEX CONCURRENTLY idx_users_last_active ON users (last_active_at DESC);

-- Table for storing aggregated analytics for faster dashboard queries
CREATE MATERIALIZED VIEW analytics_dashboard_daily AS
SELECT 
    date_trunc('day', timestamp) as date,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_id) as daily_active_users,
    COUNT(DISTINCT session_id) as total_sessions,
    
    -- User actions
    COUNT(*) FILTER (WHERE event_name = 'post_created') as posts_created,
    COUNT(*) FILTER (WHERE event_name = 'post_view') as posts_viewed,
    COUNT(*) FILTER (WHERE event_name = 'post_like') as post_likes,
    COUNT(*) FILTER (WHERE event_name = 'post_share') as post_shares,
    COUNT(*) FILTER (WHERE event_name = 'post_comment') as post_comments,
    
    -- Platform distribution
    COUNT(*) FILTER (WHERE platform = 'web') as web_events,
    COUNT(*) FILTER (WHERE platform = 'mobile_ios') as ios_events,
    COUNT(*) FILTER (WHERE platform = 'mobile_android') as android_events,
    
    -- Average session duration
    AVG(EXTRACT(EPOCH FROM us.duration)) as avg_session_duration_seconds,
    
    -- Error rate
    ROUND(
        (COUNT(*) FILTER (WHERE event_category = 'error')::DECIMAL / COUNT(*)) * 100, 
        2
    ) as error_rate_percent
    
FROM events e
LEFT JOIN user_sessions us ON e.session_id = us.id
WHERE timestamp >= CURRENT_DATE - INTERVAL '365 days'
GROUP BY date_trunc('day', timestamp)
ORDER BY date DESC;

-- Refresh the materialized view daily
CREATE OR REPLACE FUNCTION refresh_analytics_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW analytics_dashboard_daily;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE events IS 'Core analytics table storing all user interaction events with partitioning for performance';
COMMENT ON TABLE user_sessions IS 'Detailed session tracking for user journey analysis';
COMMENT ON TABLE user_interactions_daily IS 'Pre-aggregated daily user interaction metrics for fast queries';
COMMENT ON TABLE content_analytics IS 'Content performance metrics and viral coefficient calculations';
COMMENT ON TABLE experiments IS 'A/B testing experiment configurations and results';
COMMENT ON MATERIALIZED VIEW analytics_dashboard_daily IS 'Pre-calculated daily metrics for dashboard performance';

-- Grant permissions (adjust as needed for your application user)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO analytics_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO analytics_app_user;