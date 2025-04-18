# Supabase Setup Guide for Healthify Patient Portal

This guide will help you set up your Supabase database for use with the Healthify Patient Portal application.

## Step 1: Access the Supabase Dashboard

1. Log in to the Supabase dashboard at https://app.supabase.com
2. Select your project (tjxrhzrpariazxrclbfm)

## Step 2: Set Up Database Tables

1. In the left sidebar, click on "SQL Editor"
2. Click "New Query"
3. Copy and paste the entire content from the `setup-database.sql` file in this repository
4. Click "Run" to execute the SQL script

This script will:
- Create all required tables (profiles, appointments, health_metrics, etc.)
- Set up proper relationships between tables
- Enable Row Level Security (RLS) for data protection
- Create access policies to control data access
- Set up database functions

## Step 3: Enable UUID Extension

If you encounter errors about the uuid_generate_v4() function:

1. In the SQL Editor, create a new query
2. Run the following command:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Step 4: Verify Table Creation

1. In the left sidebar, click on "Table Editor"
2. You should see all the tables listed:
   - profiles
   - appointments
   - health_metrics
   - health_personal_info
   - health_vitals
   - health_lifestyle
   - health_lab_reports
   - medications

If any tables are missing, check the SQL Editor for error messages.

## Step 5: Configure Authentication

1. In the left sidebar, click on "Authentication"
2. Under "Providers", make sure "Email" is enabled
3. Under "URL Configuration", set the Site URL to your local development URL (e.g., http://localhost:8083)

## Step 6: Test the Connection from the App

1. Run the development server: `npm run dev`
2. Navigate to the diagnostic page: http://localhost:8083/diagnostic
3. Click "Test Supabase Connection" to verify connectivity
4. If successful, you should see "✅ Supabase connection successful"

## Troubleshooting

If you encounter issues:

1. **Database Connection Errors**: Check that your Supabase URL and anonymous key are correctly set in the `.env` file.
2. **Missing Tables**: Make sure you executed the SQL script in the Supabase SQL Editor.
3. **Authentication Issues**: Check that email authentication is enabled and the Site URL is set correctly.
4. **SQL Errors**: If the SQL script fails, you may need to execute it in parts or check for specific error messages.

## Next Steps

After successful setup:

1. Use the Register page to create a new user account
2. Complete the profile setup
3. Explore the app's features

Your Healthify Patient Portal should now be fully connected to your Supabase backend! 