-- Migration: 004_chat_system.sql
-- Add live chat and chat rooms functionality

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    room_type VARCHAR(20) DEFAULT 'public', -- public, private, premium
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    max_members INTEGER DEFAULT 1000,
    current_members INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    room_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_room_members table
CREATE TABLE IF NOT EXISTS chat_room_members (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member, banned
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT false,
    user_settings JSONB DEFAULT '{}',
    UNIQUE(room_id, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    recipient_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- for direct messages
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system, emoji
    metadata JSONB DEFAULT '{}',
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    reply_to INTEGER REFERENCES chat_messages(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create direct_conversations table
CREATE TABLE IF NOT EXISTS direct_conversations (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    conversation_type VARCHAR(20) DEFAULT 'random', -- random, friends, interests
    metadata JSONB DEFAULT '{}',
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id < user2_id) -- ensure consistent ordering
);

-- Create user_chat_preferences table
CREATE TABLE IF NOT EXISTS user_chat_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    interests TEXT[] DEFAULT '{}',
    preferred_language VARCHAR(10) DEFAULT 'en',
    age_range_min INTEGER DEFAULT 18,
    age_range_max INTEGER DEFAULT 99,
    location_preference VARCHAR(100),
    allow_random_chat BOOLEAN DEFAULT true,
    allow_voice_chat BOOLEAN DEFAULT false,
    allow_video_chat BOOLEAN DEFAULT false,
    profanity_filter BOOLEAN DEFAULT true,
    auto_translate BOOLEAN DEFAULT false,
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_moderation table
CREATE TABLE IF NOT EXISTS chat_moderation (
    id SERIAL PRIMARY KEY,
    reported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reported_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message_id INTEGER REFERENCES chat_messages(id) ON DELETE SET NULL,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    action_taken VARCHAR(100),
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Create chat_bans table
CREATE TABLE IF NOT EXISTS chat_bans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    banned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE, -- NULL for global ban
    ban_type VARCHAR(20) DEFAULT 'temporary', -- temporary, permanent, warning
    reason TEXT NOT NULL,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_connections table (for tracking chat history and connections)
CREATE TABLE IF NOT EXISTS user_connections (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    connection_type VARCHAR(20) DEFAULT 'chat', -- chat, friend, blocked
    first_connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_conversations INTEGER DEFAULT 1,
    total_messages INTEGER DEFAULT 0,
    connection_rating INTEGER CHECK (connection_rating >= 1 AND connection_rating <= 5),
    is_blocked BOOLEAN DEFAULT false,
    blocked_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id < user2_id)
);

-- Create online_users table (for tracking online status)
CREATE TABLE IF NOT EXISTS online_users (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'online', -- online, away, busy, invisible
    current_room_id INTEGER REFERENCES chat_rooms(id) ON DELETE SET NULL,
    socket_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    location JSONB
);

-- Create chat_analytics table
CREATE TABLE IF NOT EXISTS chat_analytics (
    id SERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    total_messages INTEGER DEFAULT 0,
    total_active_users INTEGER DEFAULT 0,
    total_new_connections INTEGER DEFAULT 0,
    total_rooms_active INTEGER DEFAULT 0,
    average_session_duration INTERVAL,
    peak_concurrent_users INTEGER DEFAULT 0,
    analytics_data JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_category ON chat_rooms(category);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(room_type);

CREATE INDEX IF NOT EXISTS idx_chat_room_members_room ON chat_room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_user ON chat_room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_online ON chat_room_members(is_online);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_type ON chat_messages(message_type);

CREATE INDEX IF NOT EXISTS idx_direct_conversations_users ON direct_conversations(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_direct_conversations_active ON direct_conversations(is_active);

CREATE INDEX IF NOT EXISTS idx_user_chat_preferences_user ON user_chat_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_preferences_interests ON user_chat_preferences USING GIN(interests);

CREATE INDEX IF NOT EXISTS idx_chat_moderation_reported_user ON chat_moderation(reported_user);
CREATE INDEX IF NOT EXISTS idx_chat_moderation_status ON chat_moderation(status);

CREATE INDEX IF NOT EXISTS idx_chat_bans_user ON chat_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_bans_room ON chat_bans(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_bans_active ON chat_bans(is_active);

CREATE INDEX IF NOT EXISTS idx_user_connections_users ON user_connections(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_type ON user_connections(connection_type);

CREATE INDEX IF NOT EXISTS idx_online_users_status ON online_users(status);
CREATE INDEX IF NOT EXISTS idx_online_users_room ON online_users(current_room_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_chat_rooms_updated_at 
    BEFORE UPDATE ON chat_rooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_chat_preferences_updated_at 
    BEFORE UPDATE ON user_chat_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

-- Users can see all public chat rooms
CREATE POLICY chat_rooms_public_policy ON chat_rooms
    FOR SELECT
    TO authenticated
    USING (room_type = 'public' OR created_by = auth.uid()::integer);

-- Users can only see their own room memberships
CREATE POLICY chat_room_members_user_policy ON chat_room_members
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid()::integer);

-- Users can see messages in rooms they're members of
CREATE POLICY chat_messages_member_policy ON chat_messages
    FOR SELECT
    TO authenticated
    USING (
        room_id IN (
            SELECT room_id FROM chat_room_members 
            WHERE user_id = auth.uid()::integer
        )
        OR sender_id = auth.uid()::integer
        OR recipient_id = auth.uid()::integer
    );

-- Users can only insert their own messages
CREATE POLICY chat_messages_insert_policy ON chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (sender_id = auth.uid()::integer);

-- Users can see their own conversations
CREATE POLICY direct_conversations_user_policy ON direct_conversations
    FOR ALL
    TO authenticated
    USING (user1_id = auth.uid()::integer OR user2_id = auth.uid()::integer);

-- Users can only manage their own preferences
CREATE POLICY user_chat_preferences_user_policy ON user_chat_preferences
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid()::integer);

-- Users can see their own connections
CREATE POLICY user_connections_user_policy ON user_connections
    FOR ALL
    TO authenticated
    USING (user1_id = auth.uid()::integer OR user2_id = auth.uid()::integer);

-- Insert default chat rooms
INSERT INTO chat_rooms (name, description, category, room_type, max_members) VALUES
    ('General Chat', 'Open discussion for everyone', 'general', 'public', 1000),
    ('Tech Talk', 'Discuss latest in technology', 'technology', 'public', 500),
    ('Music Lovers', 'Share and discover new music', 'entertainment', 'public', 800),
    ('Gamers Unite', 'Gaming discussions and LFG', 'gaming', 'public', 600),
    ('Business Network', 'Business networking and startup talks', 'business', 'premium', 300),
    ('Study Buddies', 'Study together and share knowledge', 'education', 'public', 400),
    ('Travel Stories', 'Share travel experiences and tips', 'lifestyle', 'public', 500),
    ('Movie Night', 'Discuss movies, shows, and celebrities', 'entertainment', 'public', 700),
    ('Coffee Break', 'Casual conversations over virtual coffee', 'lifestyle', 'public', 300),
    ('VIP Lounge', 'Exclusive chat for premium members', 'premium', 'premium', 100)
ON CONFLICT DO NOTHING;

-- Insert sample chat preferences for demo users
INSERT INTO user_chat_preferences (user_id, interests, preferred_language, allow_random_chat) VALUES
    (1, ARRAY['technology', 'music', 'travel'], 'en', true),
    (2, ARRAY['business', 'finance', 'networking'], 'en', true)
ON CONFLICT (user_id) DO NOTHING;

-- Create functions for chat operations
CREATE OR REPLACE FUNCTION get_user_chat_rooms(p_user_id INTEGER)
RETURNS TABLE (
    room_id INTEGER,
    room_name VARCHAR(100),
    room_description TEXT,
    category VARCHAR(50),
    current_members INTEGER,
    user_role VARCHAR(20),
    last_message_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cr.id,
        cr.name,
        cr.description,
        cr.category,
        cr.current_members,
        crm.role,
        (
            SELECT MAX(created_at) 
            FROM chat_messages cm 
            WHERE cm.room_id = cr.id
        ) as last_message_at
    FROM chat_rooms cr
    JOIN chat_room_members crm ON cr.id = crm.room_id
    WHERE crm.user_id = p_user_id 
    AND cr.is_active = true
    ORDER BY last_message_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION join_chat_room(p_user_id INTEGER, p_room_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    room_max_members INTEGER;
    current_count INTEGER;
BEGIN
    -- Get room info
    SELECT max_members, current_members INTO room_max_members, current_count
    FROM chat_rooms WHERE id = p_room_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if room is full
    IF current_count >= room_max_members THEN
        RETURN FALSE;
    END IF;
    
    -- Add user to room
    INSERT INTO chat_room_members (room_id, user_id, joined_at, is_online)
    VALUES (p_room_id, p_user_id, CURRENT_TIMESTAMP, true)
    ON CONFLICT (room_id, user_id) 
    DO UPDATE SET is_online = true, last_seen = CURRENT_TIMESTAMP;
    
    -- Update room member count
    UPDATE chat_rooms 
    SET current_members = current_members + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_room_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION leave_chat_room(p_user_id INTEGER, p_room_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update member status
    UPDATE chat_room_members 
    SET is_online = false, last_seen = CURRENT_TIMESTAMP
    WHERE room_id = p_room_id AND user_id = p_user_id;
    
    -- Update room member count
    UPDATE chat_rooms 
    SET current_members = GREATEST(current_members - 1, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_room_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION find_random_chat_partner(p_user_id INTEGER, p_interests TEXT[] DEFAULT '{}')
RETURNS TABLE (
    partner_id INTEGER,
    partner_name VARCHAR(255),
    common_interests TEXT[],
    compatibility_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        ARRAY(
            SELECT unnest(ucp.interests) 
            INTERSECT 
            SELECT unnest(p_interests)
        ) as common_interests,
        (
            CASE 
                WHEN cardinality(p_interests) = 0 THEN 50
                ELSE (
                    cardinality(ARRAY(
                        SELECT unnest(ucp.interests) 
                        INTERSECT 
                        SELECT unnest(p_interests)
                    )) * 100 / GREATEST(cardinality(p_interests), 1)
                )
            END
        )::INTEGER as compatibility_score
    FROM users u
    JOIN user_chat_preferences ucp ON u.id = ucp.user_id
    JOIN online_users ou ON u.id = ou.user_id
    WHERE u.id != p_user_id
    AND ucp.allow_random_chat = true
    AND ou.status = 'online'
    AND u.id NOT IN (
        SELECT CASE 
            WHEN user1_id = p_user_id THEN user2_id 
            ELSE user1_id 
        END
        FROM user_connections 
        WHERE (user1_id = p_user_id OR user2_id = p_user_id)
        AND is_blocked = true
    )
    ORDER BY compatibility_score DESC, RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_online_status(
    p_user_id INTEGER, 
    p_status VARCHAR(20) DEFAULT 'online',
    p_room_id INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO online_users (user_id, last_seen, status, current_room_id)
    VALUES (p_user_id, CURRENT_TIMESTAMP, p_status, p_room_id)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        last_seen = CURRENT_TIMESTAMP,
        status = p_status,
        current_room_id = p_room_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_chat_analytics(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_messages BIGINT,
    active_users BIGINT,
    active_rooms BIGINT,
    new_connections BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM chat_messages WHERE DATE(created_at) = p_date),
        (SELECT COUNT(DISTINCT user_id) FROM online_users WHERE DATE(last_seen) = p_date),
        (SELECT COUNT(*) FROM chat_rooms WHERE is_active = true),
        (SELECT COUNT(*) FROM user_connections WHERE DATE(first_connected_at) = p_date);
END;
$$ LANGUAGE plpgsql;