import { supabase } from './src/integrations/supabase/client';

/**
 * Database Diagnostics Runner
 * 
 * This script combines the database diagnostics and relationship checking tools
 * to provide a comprehensive diagnosis of potential issues.
 */

async function runDiagnostics() {
  console.log('===================================================');
  console.log('         HEALTHIFY DATABASE DIAGNOSTICS            ');
  console.log('===================================================');
  
  // Get the Supabase URL from environment or hardcoded value
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                      (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || 
                      "https://tjxrhzrpariazxrclbfm.supabase.co";
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('\nRunning diagnostics...\n');

  try {
    // First check basic connectivity
    console.log('STEP 1: Testing database connection...');
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\nDiagnostics cannot continue without database connection.');
      console.log('Please check your Supabase URL and key in the .env file.');
      console.log('Also verify that the Supabase project is active and accessible.');
      console.log('Make sure you have run the setup-database.sql script in the Supabase SQL Editor.');
      return;
    }
    
    console.log('✅ Database connection successful\n');
    
    // Run the full diagnostics by importing the modules
    console.log('STEP 2: Running database structure diagnostics...');
    await import('./src/debug-db');
    
    console.log('\nSTEP 3: Running database relationship diagnostics...');
    await import('./src/fix-db-relationships');
    
    console.log('\n===================================================');
    console.log('Diagnostics complete! Check the logs above for details.');
    console.log('===================================================');
  } catch (error) {
    console.error('Diagnostics failed with an unexpected error:', error);
  }
}

runDiagnostics().catch(console.error); 