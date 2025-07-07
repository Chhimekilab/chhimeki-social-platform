-- Sample Data for Chhimeki Social Platform
-- Run this after setting up the schema to populate your database with test data

-- Note: You'll need to create actual users through Supabase Auth first
-- Then update the UUIDs below with your actual auth.users IDs

-- Sample users (these will be created via Auth signup, this is just for reference)
-- User 1: demo@chhimeki.com (you'll create this via signup)
-- User 2: sarah@example.com (you'll create this via signup)
-- User 3: john@example.com (you'll create this via signup)

-- For this example, we'll use placeholder UUIDs
-- Replace these with actual UUIDs from your auth.users table after signup

-- Sample communities
INSERT INTO public.communities (id, name, description, creator_id, avatar_url, is_private, rules) VALUES
(
  uuid_generate_v4(),
  'Tech Innovators',
  'A community for technology enthusiasts and innovators to share ideas and collaborate',
  'REPLACE_WITH_ACTUAL_USER_ID_1', -- Replace with actual user ID
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
  false,
  ARRAY['Be respectful to all members', 'No spam or self-promotion', 'Stay on topic', 'Share knowledge freely']
),
(
  uuid_generate_v4(),
  'Digital Nomads',
  'Connect with fellow digital nomads and remote workers from around the world',
  'REPLACE_WITH_ACTUAL_USER_ID_2', -- Replace with actual user ID
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
  false,
  ARRAY['Share travel tips and experiences', 'Help others with remote work advice', 'No spam', 'Be kind and supportive']
),
(
  uuid_generate_v4(),
  'Startup Founders',
  'Private community for startup founders to discuss challenges and opportunities',
  'REPLACE_WITH_ACTUAL_USER_ID_1', -- Replace with actual user ID
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
  true,
  ARRAY['Confidentiality is key', 'Share experiences honestly', 'Support fellow founders', 'No competition bashing']
);

-- Sample events
INSERT INTO public.events (id, title, description, creator_id, start_time, end_time, location, is_virtual, meeting_url, max_attendees, banner_url) VALUES
(
  uuid_generate_v4(),
  'Tech Trends 2025: AI Revolution',
  'Join us for an insightful discussion about the latest AI trends and their impact on technology and society',
  'REPLACE_WITH_ACTUAL_USER_ID_1', -- Replace with actual user ID
  '2025-02-15 18:00:00+00',
  '2025-02-15 20:00:00+00',
  'Virtual Event',
  true,
  'https://meet.google.com/abc-defg-hij',
  100,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
),
(
  uuid_generate_v4(),
  'Remote Work Best Practices Workshop',
  'Learn effective strategies for remote work productivity and team collaboration',
  'REPLACE_WITH_ACTUAL_USER_ID_2', -- Replace with actual user ID
  '2025-02-20 14:00:00+00',
  '2025-02-20 16:30:00+00',
  'Online Workshop',
  true,
  'https://zoom.us/j/123456789',
  50,
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'
),
(
  uuid_generate_v4(),
  'Startup Pitch Night',
  'Local startup founders present their ideas to investors and fellow entrepreneurs',
  'REPLACE_WITH_ACTUAL_USER_ID_3', -- Replace with actual user ID
  '2025-02-25 19:00:00+00',
  '2025-02-25 22:00:00+00',
  'Innovation Hub, Downtown',
  false,
  null,
  30,
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800'
);

-- Sample posts (replace user_id with actual IDs)
INSERT INTO public.posts (id, user_id, content, post_type, media_urls, location) VALUES
(
  uuid_generate_v4(),
  'REPLACE_WITH_ACTUAL_USER_ID_1', -- Replace with actual user ID
  'Excited to announce our new AI-powered feature that will revolutionize how teams collaborate! 🚀 #TechInnovation #AI #Productivity',
  'text',
  ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'],
  'San Francisco, CA'
),
(
  uuid_generate_v4(),
  'REPLACE_WITH_ACTUAL_USER_ID_2', -- Replace with actual user ID
  'Just finished an amazing remote work session from a beach in Bali! 🏝️ The future of work is location-independent. #DigitalNomad #RemoteWork #WorkLifeBalance',
  'image',
  ARRAY['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'],
  'Bali, Indonesia'
),
(
  uuid_generate_v4(),
  'REPLACE_WITH_ACTUAL_USER_ID_3', -- Replace with actual user ID
  'Quick tip for fellow entrepreneurs: Always validate your idea with real customers before building. It can save you months of development time! 💡 #StartupTips #Entrepreneurship',
  'text',
  null,
  'New York, NY'
),
(
  uuid_generate_v4(),
  'REPLACE_WITH_ACTUAL_USER_ID_1', -- Replace with actual user ID
  'Who else is excited about the potential of sustainable technology? We need more green innovations in tech! 🌱 #SustainableTech #GreenTech #Environment',
  'text',
  null,
  null
),
(
  uuid_generate_v4(),
  'REPLACE_WITH_ACTUAL_USER_ID_2', -- Replace with actual user ID
  'Coffee shop recommendations for digital nomads in Lisbon? Looking for places with great wifi and atmosphere! ☕ #Lisbon #DigitalNomad #CoffeeShops',
  'text',
  null,
  'Lisbon, Portugal'
);

-- Instructions for completing the setup:
-- 
-- 1. Create user accounts through Supabase Auth:
--    - Go to your Supabase dashboard
--    - Navigate to Authentication > Users
--    - Create test users with emails like:
--      * demo@chhimeki.com
--      * sarah@example.com  
--      * john@example.com
--
-- 2. Get the User IDs:
--    - Copy the UUID from the 'id' column for each created user
--
-- 3. Update this file:
--    - Replace all instances of 'REPLACE_WITH_ACTUAL_USER_ID_1' with demo user's UUID
--    - Replace all instances of 'REPLACE_WITH_ACTUAL_USER_ID_2' with sarah's UUID
--    - Replace all instances of 'REPLACE_WITH_ACTUAL_USER_ID_3' with john's UUID
--
-- 4. Run the updated SQL in your Supabase SQL Editor
--
-- Alternative: You can also populate data through the application UI once it's connected!