'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, mockAuth } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface MockUser {
  id: string
  email: string
  user_metadata: {
    name: string
  }
}

interface AuthContextType {
  user: User | MockUser | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  loading: boolean
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
  const [user, setUser] = useState<User | MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      // Use mock auth for demo
      const mockUser = localStorage.getItem('mockUser')
      if (mockUser) {
        setUser(JSON.parse(mockUser))
      }
      setLoading(false)
    }
  }, [isSupabaseConfigured])

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      return await supabase.auth.signInWithPassword({ email, password })
    } else {
      const result = await mockAuth.signIn(email, password)
      if (result.data?.user) {
        localStorage.setItem('mockUser', JSON.stringify(result.data.user))
        setUser(result.data.user)
      }
      return result
    }
  }

  const signUp = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      return await supabase.auth.signUp({ email, password })
    } else {
      const result = await mockAuth.signUp(email, password)
      if (result.data?.user) {
        localStorage.setItem('mockUser', JSON.stringify(result.data.user))
        setUser(result.data.user)
      }
      return result
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('mockUser')
      setUser(null)
    }
  }

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
