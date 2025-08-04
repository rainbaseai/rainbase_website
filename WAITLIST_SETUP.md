# Waitlist Setup with Supabase

This guide explains how to set up the waitlist functionality with Supabase.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A Supabase project created

## Setup Steps

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase project details:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API".

### 2. Database Setup

Run the SQL schema in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query

This will create:
- `waitlist` table with proper structure
- Indexes for performance
- Row Level Security (RLS) policies
- Public insert policy (allows anonymous waitlist signups)
- Authenticated read policy (for admin access)

### 3. Verify Setup

The waitlist modal will now:
- Submit data to your Supabase database
- Handle duplicate email validation
- Show appropriate success/error messages
- Display loading states during submission

## Table Structure

The `waitlist` table includes:
- `id`: Auto-incrementing primary key
- `email`: Unique email address (required)
- `full_name`: User's full name (required)
- `usage_type`: 'personal' or 'team' (required)
- `team_members`: Number of team members (required for team usage)
- `company_name`: Company name (required for team usage)
- `created_at`: Timestamp of signup

## Security

- Row Level Security (RLS) is enabled
- Public can only insert (join waitlist)
- Only authenticated users can read data (admin access)
- Email uniqueness is enforced at database level