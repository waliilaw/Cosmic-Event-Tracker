import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// For demo purposes, we'll use a mock authentication system if Supabase is not configured
export const mockAuth = {
  user: null as any,
  signIn: (email: string, password: string) => {
    // Mock sign in
    return Promise.resolve({
      data: {
        user: { id: '1', email, user_metadata: { name: email.split('@')[0] } },
        session: { access_token: 'mock-token' }
      },
      error: null
    })
  },
  signOut: () => {
    return Promise.resolve({ error: null })
  },
  signUp: (email: string, password: string) => {
    return Promise.resolve({
      data: {
        user: { id: '1', email, user_metadata: { name: email.split('@')[0] } },
        session: { access_token: 'mock-token' }
      },
      error: null
    })
  }
}
