'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { AuthForm } from '@/components/auth/AuthForm'
import { NEOCard } from '@/components/NEOCard'
import { FilterControls } from '@/components/FilterControls'
import { NEODetailModal } from '@/components/NEODetailModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NEO, NEOResponse, NEOFilter } from '@/types/neo'
import { nasaApi, NASAApiService } from '@/services/nasa-api'
import { addDays, format } from 'date-fns'
import { AlertCircle, Calendar, RefreshCw, Sparkles, TrendingUp, Rocket } from 'lucide-react'

export default function Home() {
  const { user, loading: authLoading, isConfigured } = useAuth()
  const [neos, setNeos] = useState<NEO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNeos, setSelectedNeos] = useState<NEO[]>([])
  const [detailNeo, setDetailNeo] = useState<NEO | null>(null)
  const [displayCount, setDisplayCount] = useState(10) // Show only 10 cards initially
  const [currentDateRange, setCurrentDateRange] = useState({
    start: new Date(),
    days: 7
  })
  const [filter, setFilter] = useState<NEOFilter>({
    showOnlyHazardous: false,
    sortBy: 'date',
    sortOrder: 'asc'
  })

  const fetchNEOs = useCallback(async (startDate: Date, days: number, append: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: NEOResponse = await nasaApi.getNEOsWithPagination(startDate, days)
      
      // Flatten the NEOs from the date-grouped response
      const allNeos: NEO[] = []
      Object.values(response.near_earth_objects).forEach(dateNeos => {
        allNeos.push(...dateNeos)
      })
      
      if (append) {
        setNeos(prev => [...prev, ...allNeos])
      } else {
        setNeos(allNeos)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NEO data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load NEO data regardless of authentication status for demo purposes
    // In production, you might want to require authentication
    if (!authLoading) {
      fetchNEOs(currentDateRange.start, currentDateRange.days)
    }
  }, [authLoading, fetchNEOs, currentDateRange.start, currentDateRange.days])

  const handleLoadMore = () => {
    const nextStartDate = addDays(currentDateRange.start, currentDateRange.days)
    setCurrentDateRange(prev => ({
      start: nextStartDate,
      days: prev.days
    }))
    fetchNEOs(nextStartDate, currentDateRange.days, true)
  }

  const handleRefresh = () => {
    setCurrentDateRange({
      start: new Date(),
      days: 7
    })
    setDisplayCount(10) // Reset display count on refresh
    fetchNEOs(new Date(), 7)
  }

  const handleNEOSelect = (neo: NEO, selected: boolean) => {
    if (selected) {
      setSelectedNeos(prev => [...prev, neo])
    } else {
      setSelectedNeos(prev => prev.filter(n => n.id !== neo.id))
    }
  }

  const handleCompareClick = () => {
    if (selectedNeos.length > 0) {
      // Navigate to comparison page or show comparison modal
      window.open(`/compare?ids=${selectedNeos.map(n => n.id).join(',')}`, '_blank')
    }
  }

  const handleViewDetails = (neo: NEO) => {
    setDetailNeo(neo)
  }

  const resetFilters = () => {
    setFilter({
      showOnlyHazardous: false,
      sortBy: 'date',
      sortOrder: 'asc'
    })
  }

  // Apply filters and sorting
  const filteredAndSortedNeos = React.useMemo(() => {
    let filtered = [...neos]

    // Apply hazardous filter
    if (filter.showOnlyHazardous) {
      filtered = filtered.filter(neo => neo.is_potentially_hazardous_asteroid)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filter.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'diameter':
          const diameterA = NASAApiService.calculateAverageDiameter(a)
          const diameterB = NASAApiService.calculateAverageDiameter(b)
          comparison = diameterA - diameterB
          break
        case 'distance':
          const approachA = NASAApiService.getClosestApproach(a)
          const approachB = NASAApiService.getClosestApproach(b)
          const distanceA = approachA ? parseFloat(approachA.miss_distance.kilometers) : Infinity
          const distanceB = approachB ? parseFloat(approachB.miss_distance.kilometers) : Infinity
          comparison = distanceA - distanceB
          break
        case 'date':
        default:
          const dateA = NASAApiService.getClosestApproach(a)?.close_approach_date
          const dateB = NASAApiService.getClosestApproach(b)?.close_approach_date
          if (dateA && dateB) {
            comparison = new Date(dateA).getTime() - new Date(dateB).getTime()
          }
          break
      }

      return filter.sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [neos, filter])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show authentication form only if Supabase is configured but user is not signed in
  if (isConfigured && !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-space-grotesk">
                Welcome to Cosmic Event Tracker
              </h2>
              <p className="text-slate-600 italic">
                Sign in to start tracking Near-Earth Objects and cosmic events using NASA&apos;s data.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AuthForm />
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        selectedCount={selectedNeos.length}
        onCompareClick={handleCompareClick}
      />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Demo Mode Banner */}
        <AnimatePresence>
          {!isConfigured && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 glass-card rounded-2xl p-6 shadow-premium-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center animate-float">
                    <Sparkles className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 font-space-grotesk text-lg">Demo Mode Active</h3>
                    <p className="text-sm text-slate-700 italic font-medium">
                      Exploring NASA&apos;s NEO data without authentication. Set up Supabase for full functionality.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://supabase.com', '_blank')}
                  className="glass-input border-slate-300 text-slate-800 hover:bg-white/80 font-medium"
                >
                  Setup Auth
                </Button>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold premium-text mb-4 font-space-grotesk">
                Near-Earth Objects
              </h1>
              <div className="flex items-center space-x-6 text-slate-700">
                <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-xl">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-semibold text-visible">
                    Showing data from {format(currentDateRange.start, 'MMM dd, yyyy')} onwards
                  </span>
                </div>
                {filteredAndSortedNeos.length > 0 && (
                  <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-semibold text-visible">
                      {filteredAndSortedNeos.length} objects found
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="flex items-center space-x-2 glass-input border-slate-300 text-visible hover:bg-white/90 hover:text-visible hover:border-slate-400 font-medium shadow-premium"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Data</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <FilterControls
            filter={filter}
            onFilterChange={setFilter}
            onReset={resetFilters}
          />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 text-red-800 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Error loading data:</span>
                  </div>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300 font-medium"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && neos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-slate-600 font-medium">Loading Near-Earth Objects...</p>
            <p className="text-slate-500 text-sm mt-2 italic">Fetching data from NASA&apos;s database</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12"
            >
              <AnimatePresence mode="wait">
                {filteredAndSortedNeos.slice(0, displayCount).map((neo, index) => (
                  <motion.div
                    key={neo.id}
                    layout
                    layoutId={neo.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.95, 
                      y: -10
                    }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.02,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      layout: { 
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    }}
                  >
                    <NEOCard
                      neo={neo}
                      isSelected={selectedNeos.some(selected => selected.id === neo.id)}
                      onSelect={handleNEOSelect}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {filteredAndSortedNeos.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 font-space-grotesk">
                    No objects found
                  </h3>
                  <p className="text-slate-500 mb-6 italic">
                    No Near-Earth Objects match your current criteria.
                  </p>
                  <Button 
                    onClick={resetFilters} 
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More Button */}
            <AnimatePresence>
              {filteredAndSortedNeos.length > displayCount && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <Button
                    onClick={() => setDisplayCount(prev => prev + 10)}
                    variant="outline"
                    size="lg"
                    className="glass-input border-slate-300 text-slate-800 hover:bg-white/80 font-semibold px-8 py-4 shadow-premium"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Load More Objects ({filteredAndSortedNeos.length - displayCount} remaining)
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More Data Button (for fetching additional dates) */}
            {filteredAndSortedNeos.length > 0 && displayCount >= filteredAndSortedNeos.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-6"
              >
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  className="glass-input border-slate-300 text-slate-800 hover:bg-white/80 font-medium px-8 py-3"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading more data...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Load Next 7 Days
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>

      <NEODetailModal
        neo={detailNeo}
        isOpen={!!detailNeo}
        onClose={() => setDetailNeo(null)}
      />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-header mt-20 py-10"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
              
                <span className="text-2xl font-bold premium-text font-space-grotesk">Cosmic Event Tracker</span>
              </div>
              <p className="text-visible-muted text-lg italic font-medium">
                Developed by <span className="text-visible font-bold">@Wali</span> • Powered by NASA Open APIs
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center space-x-8 text-sm text-slate-600 font-medium"
            >
              <span className="glass-card px-4 py-2 rounded-xl">Real-time NEO data</span>
              <span className="glass-card px-4 py-2 rounded-xl">Interactive visualizations</span>
              <span className="glass-card px-4 py-2 rounded-xl">Modern web technology</span>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}