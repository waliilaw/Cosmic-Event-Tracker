'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Rocket, User, LogOut } from 'lucide-react'

interface HeaderProps {
  selectedCount?: number
  onCompareClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ selectedCount = 0, onCompareClick }) => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Rocket className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Cosmic Event Tracker</h1>
              <p className="text-blue-200 text-sm">Near-Earth Objects & Space Events</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {selectedCount > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-white text-blue-900">
                  {selectedCount} selected
                </Badge>
                <Button
                  onClick={onCompareClick}
                  variant="outline"
                  className="bg-white text-blue-900 hover:bg-blue-50"
                >
                  Compare
                </Button>
              </div>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="bg-white text-blue-900 hover:bg-blue-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="text-sm text-blue-200">
                Please sign in to access all features
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
