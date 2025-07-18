import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getSessionAndToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return {
    session: data.session,
    accessToken: data.session?.access_token || null,
  };
}
