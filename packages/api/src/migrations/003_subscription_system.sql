-- Migration: 003_subscription_system.sql
-- Add subscription and digest functionality

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL DEFAULT 'weekly',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_digest_at TIMESTAMP,
    next_digest_at TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Create digests table
CREATE TABLE IF NOT EXISTS digests (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    ai_summary TEXT,
    key_insights JSONB,
    trending_topics JSONB,
    news_items JSONB,
    reading_time INTEGER DEFAULT 0,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed_at TIMESTAMP,
    saved BOOLEAN DEFAULT false,
    shared BOOLEAN DEFAULT false
);

-- Create digest_interactions table
CREATE TABLE IF NOT EXISTS digest_interactions (
    id SERIAL PRIMARY KEY,
    digest_id INTEGER REFERENCES digests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'save', 'share', 'like', 'comment'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create topic_preferences table
CREATE TABLE IF NOT EXISTS topic_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) NOT NULL,
    preference_score DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    interaction_count INTEGER DEFAULT 0,
    last_interaction_at TIMESTAMP,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Create digest_recommendations table
CREATE TABLE IF NOT EXISTS digest_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) NOT NULL,
    reason TEXT,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted BOOLEAN DEFAULT false,
    dismissed BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_topic_id ON subscriptions(topic_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_frequency ON subscriptions(frequency);
CREATE INDEX IF NOT EXISTS idx_subscriptions_enabled ON subscriptions(enabled);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_digest ON subscriptions(next_digest_at);

CREATE INDEX IF NOT EXISTS idx_digests_user_id ON digests(user_id);
CREATE INDEX IF NOT EXISTS idx_digests_subscription_id ON digests(subscription_id);
CREATE INDEX IF NOT EXISTS idx_digests_topic_id ON digests(topic_id);
CREATE INDEX IF NOT EXISTS idx_digests_generated_at ON digests(generated_at);
CREATE INDEX IF NOT EXISTS idx_digests_viewed_at ON digests(viewed_at);

CREATE INDEX IF NOT EXISTS idx_digest_interactions_digest_id ON digest_interactions(digest_id);
CREATE INDEX IF NOT EXISTS idx_digest_interactions_user_id ON digest_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_digest_interactions_type ON digest_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_topic_preferences_user_id ON topic_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_preferences_topic_id ON topic_preferences(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_preferences_score ON topic_preferences(preference_score);

CREATE INDEX IF NOT EXISTS idx_digest_recommendations_user_id ON digest_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_digest_recommendations_topic_id ON digest_recommendations(topic_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_preferences_updated_at 
    BEFORE UPDATE ON topic_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_recommendations ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own subscriptions
CREATE POLICY subscriptions_user_policy ON subscriptions
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Users can only view their own digests
CREATE POLICY digests_user_policy ON digests
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Users can only see their own interactions
CREATE POLICY digest_interactions_user_policy ON digest_interactions
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Users can only manage their own preferences
CREATE POLICY topic_preferences_user_policy ON topic_preferences
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Users can only see their own recommendations
CREATE POLICY digest_recommendations_user_policy ON digest_recommendations
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Insert default topics
INSERT INTO topics (id, name, description, icon, category, enabled) VALUES
    ('politics', 'Politics', 'Political news and analysis', '🏛️', 'news', true),
    ('technology', 'Technology', 'Tech trends and innovations', '💻', 'tech', true),
    ('business', 'Business', 'Business news and market updates', '💼', 'business', true),
    ('science', 'Science', 'Scientific discoveries and research', '🔬', 'science', true),
    ('health', 'Health', 'Health news and medical breakthroughs', '🏥', 'health', true),
    ('environment', 'Environment', 'Climate and environmental news', '🌱', 'environment', true),
    ('sports', 'Sports', 'Sports news and updates', '⚽', 'sports', true),
    ('entertainment', 'Entertainment', 'Movies, TV, and celebrity news', '🎬', 'entertainment', true),
    ('finance', 'Finance', 'Financial markets and cryptocurrency', '💰', 'finance', true),
    ('education', 'Education', 'Educational news and resources', '📚', 'education', true),
    ('travel', 'Travel', 'Travel guides and destination news', '✈️', 'travel', true),
    ('food', 'Food & Dining', 'Food trends and restaurant news', '🍽️', 'food', true)
ON CONFLICT (id) DO NOTHING;

-- Create topics table if not exists
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    category VARCHAR(50),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add sample subscriptions for demo users
INSERT INTO subscriptions (user_id, topic_id, topic_name, frequency, enabled, next_digest_at) VALUES
    (1, 'technology', 'Technology', 'daily', true, CURRENT_TIMESTAMP + INTERVAL '1 day'),
    (1, 'business', 'Business', 'weekly', true, CURRENT_TIMESTAMP + INTERVAL '7 days'),
    (2, 'politics', 'Politics', 'daily', true, CURRENT_TIMESTAMP + INTERVAL '1 day'),
    (2, 'science', 'Science', 'weekly', true, CURRENT_TIMESTAMP + INTERVAL '7 days')
ON CONFLICT (user_id, topic_id) DO NOTHING;

-- Add sample topic preferences
INSERT INTO topic_preferences (user_id, topic_id, preference_score, interaction_count, keywords) VALUES
    (1, 'technology', 0.9, 25, '["AI", "machine learning", "quantum computing"]'),
    (1, 'business', 0.7, 15, '["startups", "venture capital", "market analysis"]'),
    (2, 'politics', 0.8, 20, '["elections", "policy", "governance"]'),
    (2, 'science', 0.9, 30, '["research", "discovery", "innovation"]')
ON CONFLICT (user_id, topic_id) DO NOTHING;

-- Add sample recommendations
INSERT INTO digest_recommendations (user_id, topic_id, reason, confidence_score) VALUES
    (1, 'science', 'Popular among users with similar interests', 0.85),
    (1, 'health', 'Trending in your network', 0.78),
    (2, 'technology', 'Related to your science interests', 0.72),
    (2, 'environment', 'Matches your political preferences', 0.68)
ON CONFLICT DO NOTHING;

-- Add functions for digest generation
CREATE OR REPLACE FUNCTION get_user_subscriptions(p_user_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    topic_id VARCHAR(50),
    topic_name VARCHAR(100),
    frequency VARCHAR(20),
    enabled BOOLEAN,
    last_digest_at TIMESTAMP,
    next_digest_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.topic_id, s.topic_name, s.frequency, s.enabled, s.last_digest_at, s.next_digest_at
    FROM subscriptions s
    WHERE s.user_id = p_user_id AND s.enabled = true
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_digest_schedule(p_subscription_id INTEGER, p_frequency VARCHAR(20))
RETURNS VOID AS $$
BEGIN
    UPDATE subscriptions 
    SET next_digest_at = CASE 
        WHEN p_frequency = 'daily' THEN CURRENT_TIMESTAMP + INTERVAL '1 day'
        WHEN p_frequency = 'weekly' THEN CURRENT_TIMESTAMP + INTERVAL '7 days'
        WHEN p_frequency = 'monthly' THEN CURRENT_TIMESTAMP + INTERVAL '30 days'
        ELSE CURRENT_TIMESTAMP + INTERVAL '7 days'
    END,
    last_digest_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = p_subscription_id;
END;
$$ LANGUAGE plpgsql;

-- Add function to get digest recommendations
CREATE OR REPLACE FUNCTION get_digest_recommendations(p_user_id INTEGER)
RETURNS TABLE (
    topic_id VARCHAR(50),
    reason TEXT,
    confidence_score DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT dr.topic_id, dr.reason, dr.confidence_score
    FROM digest_recommendations dr
    WHERE dr.user_id = p_user_id 
    AND dr.accepted = false 
    AND dr.dismissed = false
    AND dr.topic_id NOT IN (
        SELECT s.topic_id 
        FROM subscriptions s 
        WHERE s.user_id = p_user_id AND s.enabled = true
    )
    ORDER BY dr.confidence_score DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;