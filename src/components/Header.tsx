'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, LogOut, Sparkles } from 'lucide-react'

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
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-header sticky top-0 z-50 rounded-br-4xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3 ml-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => {window.open('/')}}
          >
            <div className="relative">
     
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-200 rounded-xl shadow-premium animate-float"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold premium-text font-space-grotesk">
               CMT
              </h1>
              <p className="text-sm text-slate-600 italic font-medium">
                Near-Earth Objects
              </p>
            </div>
          </motion.div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            {/* Compare Section */}
            {selectedCount > 0 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-sky-50 text-sky-700 border-sky-200 px-3 py-1 font-medium"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {selectedCount} selected
                  </Badge>
                </motion.div>
                <Button
                  onClick={onCompareClick}
                  size="sm"
                  className="glass-button text-white px-6 py-2 font-medium shadow-premium-lg"
                >
                  Compare Objects
                </Button>
              </motion.div>
            )}

            {/* User Section */}
            {user ? (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="flex items-center space-x-2 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="w-7 h-7 bg-sky-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-sky-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-sm text-slate-500 italic"
              >
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg border border-amber-200">
                  Demo Mode Active
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}