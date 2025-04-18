import { supabase } from './integrations/supabase/client';
import type { Database } from './integrations/supabase/types';

/**
 * Debug Database Connectivity and Schema
 * 
 * This script helps identify and diagnose issues with Supabase connectivity
 * and validates the database schema against our expected models.
 */

// Table names in the database
type TableNames = keyof Database['public']['Tables'];

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing database connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) throw error;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Validate table existence
async function validateTableExistence() {
  console.log('\nValidating table existence...');
  
  const expectedTables: TableNames[] = [
    'profiles',
    'appointments',
    'health_metrics',
    'health_personal_info',
    'health_vitals',
    'health_lifestyle',
    'health_lab_reports',
    'medications'
  ];
  
  const results: Record<string, { exists: boolean; error?: string; count?: number }> = {};
  let allTablesExist = true;
  
  for (const table of expectedTables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results[table] = { exists: false, error: error.message };
        allTablesExist = false;
      } else {
        results[table] = { exists: true, count };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results[table] = { exists: false, error: errorMessage };
      allTablesExist = false;
    }
  }
  
  for (const [table, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`✅ Table '${table}' exists`);
    } else {
      console.error(`❌ Table '${table}' does not exist or has an error: ${result.error}`);
    }
  }
  
  return allTablesExist;
}

// Check for missing required columns in tables
async function validateTableSchema() {
  console.log('\nValidating table schemas...');

  interface SchemaCheck {
    table: TableNames;
    requiredColumns: string[];
  }

  const schemaChecks: SchemaCheck[] = [
    {
      table: 'profiles',
      requiredColumns: ['id', 'first_name', 'last_name', 'has_completed_profile']
    },
    {
      table: 'appointments', 
      requiredColumns: ['id', 'user_id', 'provider_type', 'consultation_type', 'date', 'time_slot', 'status']
    },
    {
      table: 'health_personal_info',
      requiredColumns: ['id', 'user_id', 'full_name', 'gender', 'age', 'address']
    }
  ];
  
  let allSchemasValid = true;
  
  for (const check of schemaChecks) {
    try {
      // For Supabase, we'll use RPC or a select to check column existence
      // This is a simplification - in reality we might need to query system tables
      const { data, error } = await supabase
        .from(check.table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Error checking schema for '${check.table}': ${error.message}`);
        allSchemasValid = false;
        continue;
      }
      
      // If we have data, we can check if all columns exist
      if (data && data.length > 0) {
        const row = data[0];
        const missingColumns = check.requiredColumns.filter(col => !(col in row));
        
        if (missingColumns.length > 0) {
          console.error(`❌ Table '${check.table}' is missing required columns: ${missingColumns.join(', ')}`);
          allSchemasValid = false;
        } else {
          console.log(`✅ Table '${check.table}' has all required columns`);
        }
      } else {
        console.log(`⚠️ Table '${check.table}' exists but is empty - could not verify columns`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error validating schema for '${check.table}':`, errorMessage);
      allSchemasValid = false;
    }
  }
  
  return allSchemasValid;
}

// Run diagnostics
async function runDatabaseDiagnostics() {
  console.log('=== DATABASE DIAGNOSTICS ===');
  
  // Get the Supabase URL from environment variables or default value
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://tjxrhzrpariazxrclbfm.supabase.co";
  console.log('Supabase URL:', supabaseUrl);
  
  const connectionSuccess = await testDatabaseConnection();
  if (!connectionSuccess) {
    console.error('\n❌ Cannot proceed with further tests due to connection failure');
    return;
  }
  
  const tablesExist = await validateTableExistence();
  if (!tablesExist) {
    console.warn('\n⚠️ Some tables are missing - schema validation may fail');
  }
  
  const schemasValid = await validateTableSchema();
  
  console.log('\n=== DIAGNOSTICS SUMMARY ===');
  console.log(`Database Connection: ${connectionSuccess ? '✅ Good' : '❌ Failed'}`);
  console.log(`Table Existence: ${tablesExist ? '✅ All tables exist' : '⚠️ Some tables missing'}`);
  console.log(`Schema Validation: ${schemasValid ? '✅ All schemas valid' : '⚠️ Schema issues detected'}`);
  console.log('===========================');
}

// Execute diagnostics
runDatabaseDiagnostics()
  .catch(error => {
    console.error('Unhandled error during diagnostics:', error);
  }); 