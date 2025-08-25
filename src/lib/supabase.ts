import { createClient } from '@supabase/supabase-js'

// Supabase configuration - these will be set via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const hasRealUrl = supabaseUrl !== 'https://demo.supabase.co' && supabaseUrl.includes('supabase.co')
  const hasRealKey = supabaseKey !== 'demo-key' && supabaseKey.length > 20
  return hasRealUrl && hasRealKey
}
