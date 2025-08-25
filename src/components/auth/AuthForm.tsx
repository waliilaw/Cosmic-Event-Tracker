'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, ExternalLink } from 'lucide-react'

interface AuthFormProps {
  onSuccess?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp, isConfigured } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isSignUp ? await signUp(email, password) : await signIn(email, password)
      
      if (result.error) {
        setError(result.error.message)
      } else {
        onSuccess?.()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Show configuration warning if Supabase is not set up
  if (!isConfigured) {
    return (
      <Card className="w-full max-w-md mx-auto border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            <span>Setup Required</span>
          </CardTitle>
          <CardDescription className="text-amber-700">
            Supabase authentication is not configured for this demo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">To enable authentication:</h4>
            <ol className="text-sm text-amber-700 space-y-2 list-decimal list-inside">
              <li>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Get your project URL and anon key from Settings → API</li>
              <li>Add them to your environment variables:
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  NEXT_PUBLIC_SUPABASE_URL=your_url<br/>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
                </div>
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <Badge variant="secondary" className="w-full justify-center">
            Demo Mode - Authentication Disabled
          </Badge>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="w-full"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Started with Supabase
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Create an account to track cosmic events'
            : 'Sign in to your account to continue'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
