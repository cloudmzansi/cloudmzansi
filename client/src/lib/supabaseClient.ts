import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL is required');
if (!supabaseAnonKey) throw new Error('VITE_SUPABASE_ANON_KEY is required');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get current user and role
export async function getCurrentUserWithRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  // Assume user role is stored in user.user_metadata.role or in a public profile table
  const role = user.user_metadata?.role || 'client';
  return { ...user, role };
} 