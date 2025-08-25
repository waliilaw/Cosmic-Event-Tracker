'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<{data?: any; error?: AuthError | null}>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signUp: (email: string, password: string) => Promise<{data?: any; error?: AuthError | null}>
  signOut: () => Promise<void>
  loading: boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error in getSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [configured])

  const signIn = async (email: string, password: string) => {
    if (!configured) {
      return {
        error: {
          message: 'Supabase is not configured. Please set up your Supabase project and add the environment variables.',
          name: 'ConfigurationError'
        } as AuthError
      }
    }

    try {
      const result = await supabase.auth.signInWithPassword({ email, password })
      return result
    } catch {
      return {
        error: {
          message: 'An unexpected error occurred during sign in',
          name: 'SignInError'
        } as AuthError
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!configured) {
      return {
        error: {
          message: 'Supabase is not configured. Please set up your Supabase project and add the environment variables.',
          name: 'ConfigurationError'
        } as AuthError
      }
    }

    try {
      const result = await supabase.auth.signUp({ email, password })
      return result
    } catch {
      return {
        error: {
          message: 'An unexpected error occurred during sign up',
          name: 'SignUpError'
        } as AuthError
      }
    }
  }

  const signOut = async () => {
    if (configured) {
      await supabase.auth.signOut()
    }
  }

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    isConfigured: configured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}