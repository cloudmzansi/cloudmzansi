import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://nyflaprgxrenhtbltdyz.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZmxhcHJneHJlbmh0Ymx0ZHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MjA3NDgsImV4cCI6MjA2ODM5Njc0OH0.Jw-i5CPiicNwz-BX2sxt-sGVtGs4Sx1VwAvUeukMcnI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 