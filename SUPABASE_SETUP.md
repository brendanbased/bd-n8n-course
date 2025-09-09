# Supabase Setup Guide

## Environment Variables Setup

1. Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration  
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Discord OAuth (if using Discord auth)
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
```

## How to Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" in the sidebar
3. Go to "API" section
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## Database Structure

Your existing Supabase database should already have the following tables:
- `users` - User information from Discord
- `modules` - Course modules with UUIDs
- `lessons` - Individual lessons within modules
- `projects` - Module projects
- `user_progress` - Tracks completion status
- `discord_roles` - Role management
- `user_achievements` - Achievement tracking

## What Changed

The web app now:
1. **Fetches data from Supabase** instead of using static course structure
2. **Uses proper UUIDs** from your database instead of simple string IDs
3. **Tracks real progress** in your existing user_progress table
4. **Supports locked/unlocked content** based on your database flags

## Testing the Connection

1. Set up your `.env.local` file with the correct credentials
2. Run `npm run dev`
3. Navigate to `/dashboard`
4. You should see your actual course modules from Supabase
5. Progress tracking will work with your existing database

## Key Files Updated

- `src/lib/course-data.ts` - New service for fetching from Supabase
- `src/app/dashboard/page.tsx` - Now uses Supabase data
- `src/app/module/[moduleId]/page.tsx` - Now uses Supabase data
- `src/app/api/progress/route.ts` - Already configured for Supabase

## Next Steps

1. Create your `.env.local` file with your Supabase credentials
2. Test the application
3. Verify that your existing course data appears correctly
4. Test progress tracking by completing lessons/projects
