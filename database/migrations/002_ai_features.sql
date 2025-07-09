-- Migration: 002_ai_features
-- Description: AI-enhanced social media features
-- Author: Chhimeki Team
-- Date: 2025-01-11

-- Insert this migration record
INSERT INTO public.schema_migrations (version, name, description) VALUES 
('002', 'ai_features', 'AI-enhanced social media features including trend detection and content generation')
ON CONFLICT (version) DO NOTHING;

-- Create trending topics table
CREATE TABLE IF NOT EXISTS public.trending_topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  description TEXT,
  source VARCHAR(100) NOT NULL, -- 'newsapi', 'google_trends', 'manual'
  trend_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}',
  keywords TEXT[],
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create AI generated content table
CREATE TABLE IF NOT EXISTS public.ai_generated_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- 'post', 'comment', 'response'
  content_id UUID, -- References the actual content (post_id, comment_id, etc.)
  trend_topic_id UUID REFERENCES public.trending_topics(id) ON DELETE SET NULL,
  generation_prompt TEXT,
  model_used VARCHAR(100) DEFAULT 'gpt-3.5-turbo',
  model_parameters JSONB DEFAULT '{}',
  quality_score DECIMAL(3,2),
  user_engagement_score INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_ai BOOLEAN DEFAULT true
);

-- Create AI moderation results table
CREATE TABLE IF NOT EXISTS public.ai_moderation_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- 'post', 'comment', 'message'
  content_id UUID NOT NULL,
  original_content TEXT NOT NULL,
  moderation_result JSONB NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT false,
  categories JSONB DEFAULT '{}',
  confidence_scores JSONB DEFAULT '{}',
  action_taken VARCHAR(50) DEFAULT 'approve', -- 'approve', 'flag', 'block', 'review'
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create live interactions table for real-time features
CREATE TABLE IF NOT EXISTS public.live_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type VARCHAR(50) NOT NULL, -- 'typing', 'viewing', 'reacting'
  interaction_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes')
);

-- Create AI analytics table
CREATE TABLE IF NOT EXISTS public.ai_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL, -- 'ai_post_generated', 'content_moderated', 'trend_detected'
  entity_type VARCHAR(50), -- 'post', 'comment', 'trend'
  entity_id UUID,
  metrics JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Add AI-related columns to existing tables
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS ai_content_id UUID REFERENCES public.ai_generated_content(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS trend_topic_id UUID REFERENCES public.trending_topics(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS live_interaction_count INTEGER DEFAULT 0;

ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS ai_content_id UUID REFERENCES public.ai_generated_content(id) ON DELETE SET NULL;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS moderation_result_id UUID REFERENCES public.ai_moderation_results(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trending_topics_active ON public.trending_topics(is_active, trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_topics_created_at ON public.trending_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_generated_content_type ON public.ai_generated_content(content_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_moderation_flagged ON public.ai_moderation_results(flagged, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_interactions_active ON public.live_interactions(post_id, is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_posts_ai_generated ON public.posts(is_ai_generated, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_event_type ON public.ai_analytics(event_type, created_at DESC);

-- Create special AI user for system-generated content
INSERT INTO public.users (
  id,
  username,
  full_name,
  bio,
  subscription_tier,
  verified,
  private_account
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'chhimeki_ai',
  'Chhimeki AI',
  'AI-powered content curator bringing you the latest trends and conversations',
  'enterprise',
  true,
  false
) ON CONFLICT (id) DO UPDATE SET
  bio = EXCLUDED.bio,
  subscription_tier = EXCLUDED.subscription_tier,
  verified = EXCLUDED.verified;

-- Create functions for AI features
CREATE OR REPLACE FUNCTION get_active_trends(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  topic VARCHAR(255),
  description TEXT,
  trend_score INTEGER,
  engagement_score INTEGER,
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.topic,
    t.description,
    t.trend_score,
    t.engagement_score,
    t.source,
    t.created_at
  FROM public.trending_topics t
  WHERE t.is_active = true
  AND (t.expires_at IS NULL OR t.expires_at > NOW())
  ORDER BY t.trend_score DESC, t.engagement_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update live interaction counts
CREATE OR REPLACE FUNCTION update_live_interaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    UPDATE public.posts 
    SET live_interaction_count = live_interaction_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
    UPDATE public.posts 
    SET live_interaction_count = live_interaction_count - 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.is_active = true THEN
    UPDATE public.posts 
    SET live_interaction_count = live_interaction_count - 1 
    WHERE id = OLD.post_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for live interaction counts
CREATE TRIGGER trigger_update_live_interaction_count
  AFTER INSERT OR UPDATE OR DELETE ON public.live_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_live_interaction_count();

-- Function to clean up expired live interactions
CREATE OR REPLACE FUNCTION cleanup_expired_live_interactions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.live_interactions 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_moderation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for AI tables
CREATE POLICY "Anyone can view active trends" ON public.trending_topics
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view AI content" ON public.ai_generated_content
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view own moderation results" ON public.ai_moderation_results
  FOR SELECT USING (
    content_id IN (
      SELECT p.id FROM public.posts p WHERE p.user_id = auth.uid()
      UNION
      SELECT c.id FROM public.comments c WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own live interactions" ON public.live_interactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view live interactions" ON public.live_interactions
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON public.trending_topics TO authenticated;
GRANT SELECT ON public.ai_generated_content TO authenticated;
GRANT SELECT ON public.ai_moderation_results TO authenticated;
GRANT ALL ON public.live_interactions TO authenticated;
GRANT SELECT ON public.ai_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_trends(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_live_interactions() TO authenticated;