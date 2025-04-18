import { supabase } from './integrations/supabase/client';
import type { Database } from './integrations/supabase/types';

/**
 * Database Relationship Fixer
 * 
 * This script helps diagnose and repair potential relationship issues
 * between tables in the Supabase database.
 */

type TableNames = keyof Database['public']['Tables'];

interface TableRelationship {
  table: TableNames;
  column: string;
  referencesTable: TableNames;
  referencesColumn: string;
  description: string;
}

// Define the expected relationships between tables
const expectedRelationships: TableRelationship[] = [
  {
    table: 'appointments',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Appointments should reference a valid user profile'
  },
  {
    table: 'health_metrics',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Health metrics should reference a valid user profile'
  },
  {
    table: 'health_personal_info',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Personal info should reference a valid user profile'
  },
  {
    table: 'health_vitals',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Vitals should reference a valid user profile'
  },
  {
    table: 'health_lifestyle',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Lifestyle info should reference a valid user profile'
  },
  {
    table: 'health_lab_reports',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Lab reports should reference a valid user profile'
  },
  {
    table: 'medications',
    column: 'user_id',
    referencesTable: 'profiles',
    referencesColumn: 'id',
    description: 'Medications should reference a valid user profile'
  }
];

// Check for orphaned records (records with foreign keys that don't point to existing records)
async function checkOrphanedRecords() {
  console.log('\n=== CHECKING FOR ORPHANED RECORDS ===');
  let orphanedRecordsFound = false;
  
  // First, get all profile IDs
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id');
  
  if (profileError) {
    console.error(`❌ Error fetching profiles: ${profileError.message}`);
    return false;
  }
  
  // Create a set of valid profile IDs for faster lookups
  const validProfileIds = new Set(profileData?.map(p => p.id) || []);
  
  for (const relationship of expectedRelationships) {
    try {
      console.log(`Checking ${relationship.table}.${relationship.column} → ${relationship.referencesTable}.${relationship.referencesColumn}`);
      
      // If checking profiles, just get all records in child table
      const { data: childData, error: childError } = await supabase
        .from(relationship.table)
        .select(`id, ${relationship.column}`);
      
      if (childError) {
        console.error(`❌ Error checking table ${relationship.table}: ${childError.message}`);
        continue;
      }
      
      // Check each record to see if its foreign key exists in the parent table
      const orphanedRecords = childData?.filter(record => {
        const foreignKey = record[relationship.column];
        return foreignKey && !validProfileIds.has(foreignKey);
      });
      
      if (orphanedRecords && orphanedRecords.length > 0) {
        orphanedRecordsFound = true;
        console.error(`❌ Found ${orphanedRecords.length} orphaned records in ${relationship.table} table`);
        console.error(`   First few orphaned records: ${JSON.stringify(orphanedRecords.slice(0, 3))}`);
      } else {
        console.log(`✅ No orphaned records found in ${relationship.table} table`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error checking for orphaned records in ${relationship.table}: ${errorMessage}`);
    }
  }
  
  return !orphanedRecordsFound;
}

// Check for data consistency issues
async function checkDataConsistency() {
  console.log('\n=== CHECKING DATA CONSISTENCY ===');
  let consistencyIssuesFound = false;
  
  // Check for empty required fields
  const requiredFieldChecks = [
    { table: 'profiles', field: 'has_completed_profile' },
    { table: 'appointments', field: 'status' },
    { table: 'appointments', field: 'date' },
    { table: 'health_personal_info', field: 'full_name' }
  ];
  
  for (const check of requiredFieldChecks) {
    try {
      // For boolean fields, use a different approach since the syntax might be different
      if (check.table === 'profiles' && check.field === 'has_completed_profile') {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, has_completed_profile');
        
        if (error) {
          console.error(`❌ Error checking required field ${check.table}.${check.field}: ${error.message}`);
          continue;
        }
        
        const emptyRecords = data?.filter(record => record.has_completed_profile === null);
        if (emptyRecords && emptyRecords.length > 0) {
          consistencyIssuesFound = true;
          console.error(`❌ Found ${emptyRecords.length} records with empty required field ${check.table}.${check.field}`);
        } else {
          console.log(`✅ All records have required field ${check.table}.${check.field}`);
        }
        continue;
      }
      
      // For other fields, use the standard approach
      const { data, error } = await supabase
        .from(check.table as TableNames)
        .select(`id, ${check.field}`);
      
      if (error) {
        console.error(`❌ Error checking required field ${check.table}.${check.field}: ${error.message}`);
        continue;
      }
      
      const emptyRecords = data?.filter(record => record[check.field] === null || record[check.field] === '');
      if (emptyRecords && emptyRecords.length > 0) {
        consistencyIssuesFound = true;
        console.error(`❌ Found ${emptyRecords.length} records with empty required field ${check.table}.${check.field}`);
      } else {
        console.log(`✅ All records have required field ${check.table}.${check.field}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error checking required field ${check.table}.${check.field}: ${errorMessage}`);
    }
  }
  
  // Check for date consistency in appointments
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, date');
    
    if (error) {
      console.error(`❌ Error checking appointment dates: ${error.message}`);
    } else {
      const now = new Date();
      const pastAppointments = data?.filter(appt => {
        if (!appt.date) return true; // Count missing dates
        const apptDate = new Date(appt.date);
        return apptDate < now;
      });
      
      if (pastAppointments && pastAppointments.length > 0) {
        consistencyIssuesFound = true;
        console.error(`❌ Found ${pastAppointments.length} appointments with past or missing dates`);
      } else {
        console.log('✅ All appointments have valid future dates');
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error checking appointment dates: ${errorMessage}`);
  }
  
  return !consistencyIssuesFound;
}

// Fix orphaned records by creating placeholder parent records
async function fixOrphanedRecords() {
  console.log('\n=== FIXING ORPHANED RECORDS ===');
  let successfulFixes = 0;
  let failedFixes = 0;
  
  // First, get all profile IDs
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id');
  
  if (profileError) {
    console.error(`❌ Error fetching profiles: ${profileError.message}`);
    return false;
  }
  
  // Create a set of valid profile IDs for faster lookups
  const validProfileIds = new Set(profileData?.map(p => p.id) || []);
  
  for (const relationship of expectedRelationships) {
    try {
      // Get all records from the child table
      const { data: childData, error: childError } = await supabase
        .from(relationship.table)
        .select(`id, ${relationship.column}`);
      
      if (childError) {
        console.error(`❌ Error fetching records from ${relationship.table}: ${childError.message}`);
        failedFixes++;
        continue;
      }
      
      // Find orphaned records
      const orphanedRecords = childData?.filter(record => {
        const foreignKey = record[relationship.column];
        return foreignKey && !validProfileIds.has(foreignKey);
      });
      
      if (!orphanedRecords || orphanedRecords.length === 0) {
        console.log(`✅ No orphaned records to fix in ${relationship.table}`);
        continue;
      }
      
      const orphanedUserIds = [...new Set(orphanedRecords.map(record => record[relationship.column]))];
      console.log(`Found ${orphanedUserIds.length} unique orphaned user IDs in ${relationship.table}`);
      
      if (relationship.referencesTable === 'profiles') {
        // Create placeholder profiles for orphaned user IDs
        for (const userId of orphanedUserIds) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              has_completed_profile: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (insertError) {
            console.error(`❌ Failed to create placeholder profile for ${userId}: ${insertError.message}`);
            failedFixes++;
          } else {
            console.log(`✅ Created placeholder profile for ${userId}`);
            successfulFixes++;
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error fixing orphaned records in ${relationship.table}: ${errorMessage}`);
      failedFixes++;
    }
  }
  
  console.log(`\nFixed ${successfulFixes} orphaned records, ${failedFixes} fixes failed`);
  return successfulFixes > 0 && failedFixes === 0;
}

// Run the database relationship check
async function runRelationshipCheck() {
  console.log('=== DATABASE RELATIONSHIP CHECK ===');
  
  // Get the Supabase URL from environment variables or default value
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://tjxrhzrpariazxrclbfm.supabase.co";
  console.log('Supabase URL:', supabaseUrl);
  
  // 1. Check orphaned records
  const noOrphanedRecords = await checkOrphanedRecords();
  
  // 2. Check data consistency
  const noConsistencyIssues = await checkDataConsistency();
  
  // 3. Fix orphaned records if found
  let fixSuccess = true;
  if (!noOrphanedRecords) {
    console.log('\nAttempting to fix orphaned records...');
    fixSuccess = await fixOrphanedRecords();
  }
  
  // Summary
  console.log('\n=== RELATIONSHIP CHECK SUMMARY ===');
  console.log(`Orphaned Records: ${noOrphanedRecords ? '✅ None found' : '⚠️ Found'}`);
  console.log(`Data Consistency: ${noConsistencyIssues ? '✅ No issues' : '⚠️ Issues found'}`);
  
  if (!noOrphanedRecords) {
    console.log(`Fix Status: ${fixSuccess ? '✅ Fixed successfully' : '❌ Fix failed'}`);
  }
  
  console.log('\nRecommended actions:');
  if (!noConsistencyIssues) {
    console.log('- Review and update records with missing required fields');
    console.log('- Check appointment dates for validity');
  }
  console.log('- Implement proper foreign key constraints in your database schema');
  console.log('- Add data validation in your application code');
  console.log('==================================');
}

// Execute the relationship check
runRelationshipCheck()
  .catch(error => {
    console.error('Unhandled error during relationship check:', error);
  }); 