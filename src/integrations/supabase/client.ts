// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iucrkaaeholnvmbhyzez.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y3JrYWFlaG9sbnZtYmh5emV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODYzNDEsImV4cCI6MjA1OTg2MjM0MX0.8RfPexU_3aihvKft8_daYZdBC-Qw9jGcWJ5g4UiDmkM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);