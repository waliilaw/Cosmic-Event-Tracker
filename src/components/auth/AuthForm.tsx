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
  const [success, setSuccess] = useState('')
  
  const { signIn, signUp, isConfigured } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = isSignUp ? await signUp(email, password) : await signIn(email, password)
      
      if (result.error) {
        setError(result.error.message)
      } else {
        if (isSignUp) {
          setSuccess('Account created successfully! Please check your email to verify your account before signing in.')
          setEmail('')
          setPassword('')
          // Don't call onSuccess for signup, user needs to verify email first
        } else {
          setSuccess('Welcome back! Redirecting...')
          setTimeout(() => {
            onSuccess?.()
          }, 1000)
        }
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
      <Card className="w-full max-w-md mx-auto border-slate-200 bg-white shadow-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 font-space-grotesk">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <span>Setup Required</span>
          </CardTitle>
          <CardDescription className="text-slate-600 italic">
            Supabase authentication is not configured for this demo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4 font-space-grotesk">To enable authentication:</h4>
            <ol className="text-sm text-slate-700 space-y-3 list-decimal list-inside">
              <li>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 font-medium">supabase.com</a></li>
              <li>Get your project URL and anon key from Settings → API</li>
              <li>Add them to your environment variables:
                <div className="mt-3 p-3 bg-slate-900 rounded-lg text-xs font-mono text-green-400">
                  NEXT_PUBLIC_SUPABASE_URL=your_url<br/>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
                </div>
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 px-4 py-2">
              Demo Mode - Authentication Disabled
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Started with Supabase
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto premium-card shadow-premium-xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold premium-text font-space-grotesk mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-slate-700 italic font-medium text-base">
          {isSignUp 
            ? 'Create an account to track cosmic events'
            : 'Sign in to your account to continue'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-800">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input focus-premium h-12 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input focus-premium h-12 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          {error && (
            <div className="text-sm text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="mt-1">{error}</p>
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Success!</span>
              </div>
              <p className="mt-1">{success}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-8">
          <Button 
            type="submit" 
            className="w-full glass-button text-white font-semibold h-12" 
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 font-medium"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
