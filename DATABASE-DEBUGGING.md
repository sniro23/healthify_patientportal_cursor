# Database Debugging Guide

This guide provides information about diagnosing and fixing backend and database issues in the Healthify Patient Portal.

## Overview

The Healthify Patient Portal uses Supabase as its backend database service. The following are common issues that may occur:

1. **Connectivity Issues** - Problems connecting to the Supabase instance
2. **Missing Tables** - Required database tables don't exist
3. **Schema Mismatches** - Database schema doesn't match expected structure
4. **Orphaned Records** - Records with foreign keys that reference non-existent parent records
5. **Data Consistency Issues** - Missing required fields or invalid data
6. **Authentication Problems** - Issues with user authentication and session management

## Running Diagnostics

We've created diagnostic tools to help identify and fix database issues:

```bash
# Install the required dependencies
npm install

# Run the database diagnostics
npm run diagnose-db
```

This will:
1. Test database connectivity
2. Validate the existence of required tables
3. Check schema structure against expected models
4. Look for orphaned records
5. Identify data consistency issues
6. Attempt to fix orphaned records when possible

## Common Issues & Solutions

### Authentication Issues

If users are experiencing login problems:

1. Check that the profile creation is working:
   - The `useAuth` hook has been updated to automatically create profiles for users if they don't exist
   - When a user signs up, it should create a related profile record

2. Verify localStorage sync:
   - The app uses localStorage for tracking auth state (`isAuthenticated`, `hasCompletedProfile`)
   - If these values are out of sync with the database, users may experience issues
   - To fix this, try clearing localStorage or calling `refreshUserSession()` from the `useAuth` hook

### Database Structure Issues

If the diagnostic tool shows missing tables or schema mismatches:

1. Check the Supabase project in the dashboard (https://app.supabase.com)
2. Verify that all required tables exist with the correct structure
3. For missing tables, you can create them manually through the Supabase dashboard

Required tables:
- `profiles` - User profile information
- `appointments` - User appointments
- `health_metrics` - Health tracking metrics
- `health_personal_info` - Personal information
- `health_vitals` - Vital signs recordings
- `health_lifestyle` - Lifestyle information
- `health_lab_reports` - Lab test reports
- `medications` - Medication information

### Orphaned Records

If the diagnostic tool identifies orphaned records:

1. The tool will attempt to create placeholder parent records for orphaned foreign keys
2. If it fails, you may need to manually fix these issues through the Supabase dashboard:
   - Option 1: Create the missing parent records
   - Option 2: Delete the orphaned records if they're no longer needed

### Data Consistency Issues

For data consistency problems:

1. The diagnostic tool will identify records with missing required fields
2. Use the Supabase dashboard to update these records with valid values
3. For appointment date issues, check for appointments with past dates that should be marked as completed

## Manually Testing

You can also manually test the database by:

1. Running the application locally: `npm run dev`
2. Checking the network tab in browser DevTools for API calls
3. Looking for error responses in the console
4. Testing authentication flow (signup, login, profile completion)

## Preventive Measures

To prevent database issues in the future:

1. Implement proper validation in forms before submitting data
2. Add stronger error handling throughout the application
3. Consider implementing database migrations for schema changes
4. Add automated testing for critical database operations

## Contact Support

If you're unable to resolve database issues using these tools, please contact the development team for additional assistance. 