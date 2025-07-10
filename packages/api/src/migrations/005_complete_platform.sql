-- Migration: 005_complete_platform.sql
-- Complete super-app functionality: Facebook + Twitter + LinkedIn + Neighborhood App

-- ==========================================
-- LOCATION & NEIGHBORHOOD FEATURES
-- ==========================================

-- User locations and verification
CREATE TABLE IF NOT EXISTS user_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL DEFAULT 'USA',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(50) DEFAULT 'self_reported',
    verification_date TIMESTAMP,
    privacy_level VARCHAR(20) DEFAULT 'neighborhood', -- neighborhood, city, private
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Neighborhood definitions
CREATE TABLE IF NOT EXISTS neighborhoods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL DEFAULT 'USA',
    postal_codes TEXT[], -- Array of postal codes in this neighborhood
    center_lat DECIMAL(10, 8),
    center_lng DECIMAL(11, 8),
    radius_miles DECIMAL(5, 2) DEFAULT 2.0,
    population INTEGER DEFAULT 0,
    safety_rating DECIMAL(3, 2) DEFAULT 5.0,
    moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- PROFESSIONAL FEATURES (LinkedIn-style)
-- ==========================================

-- User professional profiles
CREATE TABLE IF NOT EXISTS user_professional_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    headline VARCHAR(200), -- Professional headline
    industry VARCHAR(100),
    current_company VARCHAR(100),
    current_position VARCHAR(100),
    experience_years INTEGER,
    education_level VARCHAR(50), -- high_school, bachelors, masters, phd, other
    university VARCHAR(100),
    degree VARCHAR(100),
    graduation_year INTEGER,
    certifications TEXT[],
    languages TEXT[],
    portfolio_url VARCHAR(255),
    resume_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    salary_range VARCHAR(50), -- 30k-50k, 50k-75k, etc.
    job_seeking BOOLEAN DEFAULT false,
    open_to_remote BOOLEAN DEFAULT true,
    preferred_job_types TEXT[], -- full-time, part-time, contract, freelance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work experience
CREATE TABLE IF NOT EXISTS user_experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    company_size VARCHAR(50), -- startup, small, medium, large, enterprise
    industry VARCHAR(100),
    achievements TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills and proficiencies
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- technical, soft, language, certification
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
    years_experience INTEGER,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_name)
);

-- Skill endorsements
CREATE TABLE IF NOT EXISTS skill_endorsements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
    endorser_id UUID REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(50), -- colleague, manager, client, peer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(skill_id, endorser_id)
);

-- Company profiles
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Company account owner
    company_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50), -- startup, small, medium, large, enterprise
    founded_year INTEGER,
    headquarters VARCHAR(200),
    website VARCHAR(255),
    logo_url VARCHAR(255),
    banner_url VARCHAR(255),
    employee_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    is_hiring BOOLEAN DEFAULT false,
    culture_tags TEXT[], -- remote-friendly, diverse, fast-paced, etc.
    benefits TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job postings
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    location VARCHAR(200),
    is_remote BOOLEAN DEFAULT false,
    job_type VARCHAR(50) NOT NULL, -- full-time, part-time, contract, internship
    experience_level VARCHAR(50), -- entry, mid, senior, executive
    required_skills TEXT[],
    preferred_skills TEXT[],
    application_deadline DATE,
    applications_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, closed, filled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    expected_salary INTEGER,
    availability_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewing, interviewing, rejected, hired
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recruiter_notes TEXT,
    UNIQUE(job_id, applicant_id)
);

-- ==========================================
-- MARKETPLACE FEATURES
-- ==========================================

-- Marketplace listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    price_negotiable BOOLEAN DEFAULT false,
    category VARCHAR(50) NOT NULL, -- electronics, furniture, vehicles, services, etc.
    subcategory VARCHAR(50),
    condition VARCHAR(20), -- new, like_new, good, fair, poor
    brand VARCHAR(100),
    model VARCHAR(100),
    images TEXT[],
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    neighborhood_id UUID REFERENCES neighborhoods(id),
    delivery_available BOOLEAN DEFAULT false,
    pickup_only BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active', -- active, sold, expired, removed
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    boost_expires_at TIMESTAMP, -- For promoted listings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace inquiries
CREATE TABLE IF NOT EXISTS marketplace_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    offer_price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'active', -- active, accepted, declined, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Local businesses
CREATE TABLE IF NOT EXISTS local_businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- restaurant, retail, service, healthcare, etc.
    subcategory VARCHAR(50),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    hours_of_operation JSONB, -- {monday: "9:00-17:00", tuesday: "9:00-17:00", ...}
    images TEXT[],
    logo_url VARCHAR(255),
    price_range VARCHAR(10), -- $, $$, $$$, $$$$
    accepts_cash BOOLEAN DEFAULT true,
    accepts_cards BOOLEAN DEFAULT true,
    delivery_available BOOLEAN DEFAULT false,
    pickup_available BOOLEAN DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business reviews
CREATE TABLE IF NOT EXISTS business_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES local_businesses(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    images TEXT[],
    visit_date DATE,
    recommended BOOLEAN,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, reviewer_id)
);

-- ==========================================
-- SAFETY & COMMUNITY FEATURES
-- ==========================================

-- Safety reports
CREATE TABLE IF NOT EXISTS safety_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    incident_type VARCHAR(50) NOT NULL, -- crime, accident, suspicious_activity, emergency, etc.
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location_description VARCHAR(255),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    neighborhood_id UUID REFERENCES neighborhoods(id),
    incident_time TIMESTAMP NOT NULL,
    police_notified BOOLEAN DEFAULT false,
    emergency_services_called BOOLEAN DEFAULT false,
    images TEXT[],
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, investigating, dismissed
    priority INTEGER DEFAULT 3, -- 1-5 scale
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL, -- family, friend, neighbor, colleague
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    notify_on_emergency BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community polls
CREATE TABLE IF NOT EXISTS community_polls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    poll_type VARCHAR(20) DEFAULT 'multiple_choice', -- multiple_choice, yes_no, rating
    options JSONB NOT NULL, -- ["Option 1", "Option 2", ...]
    allow_multiple_votes BOOLEAN DEFAULT false,
    anonymous_voting BOOLEAN DEFAULT false,
    expires_at TIMESTAMP,
    total_votes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, expired, closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poll votes
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID REFERENCES community_polls(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    selected_options INTEGER[], -- Array of option indices
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, voter_id)
);

-- Lost and found
CREATE TABLE IF NOT EXISTS lost_and_found (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- lost, found
    item_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50), -- pet, electronics, jewelry, documents, etc.
    last_seen_location VARCHAR(255),
    last_seen_date DATE,
    contact_method VARCHAR(20) DEFAULT 'app', -- app, phone, email
    contact_info VARCHAR(255),
    images TEXT[],
    reward_offered DECIMAL(8, 2),
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, expired
    neighborhood_id UUID REFERENCES neighborhoods(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ENHANCED COMMUNITY FEATURES
-- ==========================================

-- Neighborhood moderators
CREATE TABLE IF NOT EXISTS neighborhood_moderators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'moderator', -- moderator, admin, super_admin
    appointed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    appointed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    permissions JSONB DEFAULT '{}', -- Custom permissions object
    is_active BOOLEAN DEFAULT true,
    UNIQUE(neighborhood_id, user_id)
);

-- Community announcements
CREATE TABLE IF NOT EXISTS community_announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general', -- general, urgent, event, maintenance
    priority INTEGER DEFAULT 3, -- 1-5 scale
    expires_at TIMESTAMP,
    images TEXT[],
    pin_to_top BOOLEAN DEFAULT false,
    send_notifications BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Location indexes
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_coordinates ON user_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_user_locations_verified ON user_locations(is_verified);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_location ON neighborhoods(center_lat, center_lng);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_state ON neighborhoods(city, state);

-- Professional indexes
CREATE INDEX IF NOT EXISTS idx_user_professional_user_id ON user_professional_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_professional_job_seeking ON user_professional_profiles(job_seeking);

CREATE INDEX IF NOT EXISTS idx_user_experience_user_id ON user_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experience_current ON user_experience(is_current);

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);

CREATE INDEX IF NOT EXISTS idx_job_postings_company_id ON job_postings(company_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_location ON job_postings(location);
CREATE INDEX IF NOT EXISTS idx_job_postings_remote ON job_postings(is_remote);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- Marketplace indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller_id ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_location ON marketplace_listings(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_neighborhood ON marketplace_listings(neighborhood_id);

CREATE INDEX IF NOT EXISTS idx_local_businesses_location ON local_businesses(city, state);
CREATE INDEX IF NOT EXISTS idx_local_businesses_category ON local_businesses(category);
CREATE INDEX IF NOT EXISTS idx_local_businesses_verified ON local_businesses(is_verified);

CREATE INDEX IF NOT EXISTS idx_business_reviews_business_id ON business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_reviewer_id ON business_reviews(reviewer_id);

-- Safety indexes
CREATE INDEX IF NOT EXISTS idx_safety_reports_location ON safety_reports(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_safety_reports_neighborhood ON safety_reports(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_safety_reports_incident_type ON safety_reports(incident_type);
CREATE INDEX IF NOT EXISTS idx_safety_reports_severity ON safety_reports(severity);
CREATE INDEX IF NOT EXISTS idx_safety_reports_status ON safety_reports(status);

CREATE INDEX IF NOT EXISTS idx_community_polls_neighborhood ON community_polls(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_community_polls_status ON community_polls(status);

-- ==========================================
-- TRIGGERS AND FUNCTIONS
-- ==========================================

-- Function to update neighborhood population
CREATE OR REPLACE FUNCTION update_neighborhood_population()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE neighborhoods 
        SET population = population + 1
        WHERE id = (
            SELECT id FROM neighborhoods 
            WHERE city = NEW.city AND state = NEW.state
            ORDER BY ST_Distance(
                ST_Point(center_lng, center_lat)::geography,
                ST_Point(NEW.longitude, NEW.latitude)::geography
            ) ASC
            LIMIT 1
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE neighborhoods 
        SET population = GREATEST(population - 1, 0)
        WHERE id = (
            SELECT id FROM neighborhoods 
            WHERE city = OLD.city AND state = OLD.state
            ORDER BY ST_Distance(
                ST_Point(center_lng, center_lat)::geography,
                ST_Point(OLD.longitude, OLD.latitude)::geography
            ) ASC
            LIMIT 1
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for neighborhood population
CREATE TRIGGER trigger_update_neighborhood_population
    AFTER INSERT OR DELETE ON user_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_neighborhood_population();

-- Function to update business ratings
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE local_businesses
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM business_reviews
        WHERE business_id = NEW.business_id
    ),
    review_count = (
        SELECT COUNT(*)
        FROM business_reviews
        WHERE business_id = NEW.business_id
    )
    WHERE id = NEW.business_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for business ratings
CREATE TRIGGER trigger_update_business_rating
    AFTER INSERT OR UPDATE OR DELETE ON business_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_business_rating();

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Enable RLS on all new tables
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_and_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_moderators ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_announcements ENABLE ROW LEVEL SECURITY;

-- Location policies
CREATE POLICY "Users can manage own location" ON user_locations
    FOR ALL USING (auth.uid()::text::uuid = user_id);

CREATE POLICY "Users can view neighborhood locations" ON user_locations
    FOR SELECT USING (privacy_level != 'private');

-- Professional policies
CREATE POLICY "Users can manage own professional profile" ON user_professional_profiles
    FOR ALL USING (auth.uid()::text::uuid = user_id);

CREATE POLICY "Public professional profiles viewable" ON user_professional_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own experience" ON user_experience
    FOR ALL USING (auth.uid()::text::uuid = user_id);

CREATE POLICY "Users can manage own skills" ON user_skills
    FOR ALL USING (auth.uid()::text::uuid = user_id);

CREATE POLICY "Users can endorse others' skills" ON skill_endorsements
    FOR INSERT WITH CHECK (auth.uid()::text::uuid = endorser_id);

-- Job posting policies
CREATE POLICY "Company owners can manage jobs" ON job_postings
    FOR ALL USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()::text::uuid
        )
    );

CREATE POLICY "Everyone can view active jobs" ON job_postings
    FOR SELECT USING (status = 'active');

-- Marketplace policies
CREATE POLICY "Users can manage own listings" ON marketplace_listings
    FOR ALL USING (auth.uid()::text::uuid = seller_id);

CREATE POLICY "Everyone can view active listings" ON marketplace_listings
    FOR SELECT USING (status = 'active');

-- Safety policies
CREATE POLICY "Users can create safety reports" ON safety_reports
    FOR INSERT WITH CHECK (auth.uid()::text::uuid = reporter_id);

CREATE POLICY "Everyone can view safety reports" ON safety_reports
    FOR SELECT USING (status = 'active');

-- ==========================================
-- SAMPLE DATA
-- ==========================================

-- Insert sample neighborhoods
INSERT INTO neighborhoods (name, city, state, center_lat, center_lng, radius_miles, population) VALUES
    ('Downtown', 'San Francisco', 'CA', 37.7749, -122.4194, 1.5, 15000),
    ('Mission District', 'San Francisco', 'CA', 37.7599, -122.4148, 2.0, 45000),
    ('SoMa', 'San Francisco', 'CA', 37.7749, -122.4094, 1.0, 12000),
    ('Castro', 'San Francisco', 'CA', 37.7609, -122.4350, 1.2, 8000),
    ('Nob Hill', 'San Francisco', 'CA', 37.7928, -122.4156, 0.8, 6000),
    ('Chinatown', 'San Francisco', 'CA', 37.7941, -122.4078, 0.6, 10000),
    ('Financial District', 'San Francisco', 'CA', 37.7946, -122.3999, 1.0, 5000),
    ('North Beach', 'San Francisco', 'CA', 37.8067, -122.4103, 1.2, 12000),
    ('Presidio', 'San Francisco', 'CA', 37.7989, -122.4662, 2.5, 3000),
    ('Richmond', 'San Francisco', 'CA', 37.7806, -122.4739, 3.0, 35000)
ON CONFLICT DO NOTHING;

-- Insert sample job categories and skills
INSERT INTO user_skills (user_id, skill_name, category, proficiency_level) VALUES
    ((SELECT id FROM users LIMIT 1), 'JavaScript', 'technical', 4),
    ((SELECT id FROM users LIMIT 1), 'React', 'technical', 4),
    ((SELECT id FROM users LIMIT 1), 'Node.js', 'technical', 3),
    ((SELECT id FROM users LIMIT 1), 'Leadership', 'soft', 4),
    ((SELECT id FROM users LIMIT 1), 'Communication', 'soft', 5)
ON CONFLICT DO NOTHING;

-- Insert sample marketplace categories data
-- This will be populated by the application