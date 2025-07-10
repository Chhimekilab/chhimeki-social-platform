# Supabase Integration Setup Guide

This guide will help you connect your Chhimeki Social Platform to Supabase and set up the database.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The Chhimeki Social Platform project

## Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `chhimeki-social-platform`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create New Project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Project Credentials

Once your project is ready:

1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiI...`)

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```env
   # Supabase Configuration
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   
   # App Configuration
   REACT_APP_ENV=development
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_DEBUG=true
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- All necessary tables (users, posts, comments, likes, follows, etc.)
- Database triggers for automatic counter updates
- Row Level Security (RLS) policies
- Performance indexes

## Step 5: Configure Authentication

Your Supabase project comes with authentication enabled by default. To customize:

1. Go to **Authentication** > **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Email confirmation**: Enabled (recommended)
   - **Email templates**: Customize as needed

### Email Provider Setup (Optional)

For production, configure a custom email provider:
1. Go to **Authentication** > **Settings** > **SMTP Settings**
2. Configure your email service (SendGrid, Mailgun, etc.)

## Step 6: Update the Application

The application is already configured to use Supabase! Here's what was added:

### New Files Added:
- `src/lib/supabase.js` - Supabase client configuration
- `src/contexts/SupabaseAuthContext.js` - Supabase authentication context
- `src/services/database.js` - Database service functions

### Environment Setup:
- `.env.local` - Your Supabase credentials
- `.env.example` - Template for environment variables

### Database Schema:
- `database/schema.sql` - Complete database schema
- `database/sample-data.sql` - Sample data for testing

## Step 7: Switch to Supabase Authentication

To use Supabase authentication instead of the mock system:

1. Open `src/index.js`
2. Replace the import:
   ```javascript
   // Change from:
   import { AuthProvider } from './contexts/AuthContext';
   
   // To:
   import { AuthProvider } from './contexts/SupabaseAuthContext';
   ```

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`

3. Try to sign up with a test email:
   - The app should create a new user in Supabase Auth
   - A user profile should be automatically created in the `users` table

## Step 9: Add Sample Data (Optional)

To populate your database with test data:

1. **First, create test users** through the app signup or Supabase dashboard
2. Go to **Authentication** > **Users** in Supabase
3. Copy the user IDs
4. Edit `database/sample-data.sql` and replace the placeholder IDs
5. Run the updated SQL in the **SQL Editor**

## Development Tips

### Viewing Data
- Use the **Table Editor** in Supabase to view and edit data
- Real-time subscriptions work automatically

### Debugging
- Check the browser console for Supabase errors
- Use the **Logs** section in Supabase to see database activity
- Enable `REACT_APP_DEBUG=true` for detailed logging

### Testing Authentication
```javascript
// Test if user is authenticated
import { supabase } from './src/lib/supabase';

const user = supabase.auth.getUser();
console.log('Current user:', user);
```

## Security Considerations

### Row Level Security (RLS)
The schema includes RLS policies that:
- Users can only edit their own content
- Private profiles are protected
- Messages are private between sender and recipient

### API Keys
- Never commit your `.env.local` file
- Use environment-specific keys for production
- Rotate keys regularly

## Production Deployment

### Environment Variables
Set these in your production environment:
```env
REACT_APP_SUPABASE_URL=your-production-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-production-anon-key
REACT_APP_ENV=production
REACT_APP_API_URL=https://your-domain.com
REACT_APP_DEBUG=false
```

### Site URL Configuration
1. Go to **Authentication** > **Settings**
2. Update **Site URL** to your production domain
3. Add your domain to **Redirect URLs**

## Troubleshooting

### Common Issues

**1. Environment Variables Not Loading**
- Ensure your `.env.local` file is in the project root
- Restart your development server after changing env vars
- Check that variable names start with `REACT_APP_`

**2. Authentication Errors**
- Verify your Supabase URL and anon key
- Check if email confirmation is required
- Look for CORS issues in the browser console

**3. Database Connection Issues**
- Ensure RLS policies are correctly set up
- Check if the user has the necessary permissions
- Verify the schema was applied correctly

**4. "Missing Supabase environment variables" Error**
- Double-check your `.env.local` file
- Ensure no trailing spaces in your environment variables
- Restart your development server

### Getting Help

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Visit the [Supabase Discord](https://discord.supabase.com)
3. Review your project logs in the Supabase dashboard

## Next Steps

Once your Supabase integration is working:

1. **Customize the database** - Add additional fields or tables as needed
2. **Set up real-time features** - Use Supabase's real-time subscriptions
3. **Add file storage** - Use Supabase Storage for user avatars and media
4. **Implement analytics** - Track user engagement and platform metrics
5. **Scale your app** - Use Supabase's built-in scalability features

## Database Schema Overview

Your Supabase database includes these main tables:

- **users** - User profiles and metadata
- **posts** - User posts with media and engagement metrics
- **comments** - Post comments and replies
- **likes** - Like interactions for posts and comments
- **follows** - User follow relationships
- **communities** - User communities and groups
- **events** - Social events and meetups
- **notifications** - User notifications and alerts
- **messages** - Direct messaging between users

All tables include automatic timestamp tracking and optimized indexes for performance.

---

**Congratulations!** Your Chhimeki Social Platform is now connected to Supabase with a production-ready database backend. 🎉