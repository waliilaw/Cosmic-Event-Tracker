import { createClient } from '@supabase/supabase-js'

// Supabase configuration - these will be set via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://demo.supabase.co' && 
         supabaseKey !== 'demo-key' &&
         supabaseUrl.includes('supabase.co')
}
