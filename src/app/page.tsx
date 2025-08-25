'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
import { AlertCircle, Calendar, RefreshCw } from 'lucide-react'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [neos, setNeos] = useState<NEO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNeos, setSelectedNeos] = useState<NEO[]>([])
  const [detailNeo, setDetailNeo] = useState<NEO | null>(null)
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
    if (user) {
      fetchNEOs(currentDateRange.start, currentDateRange.days)
    }
  }, [user, fetchNEOs, currentDateRange.start, currentDateRange.days])

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Cosmic Event Tracker</h2>
              <p className="text-gray-600">
                Sign in to start tracking Near-Earth Objects and cosmic events using NASA's data.
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        selectedCount={selectedNeos.length}
        onCompareClick={handleCompareClick}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Near-Earth Objects</h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Showing data from {format(currentDateRange.start, 'MMM dd, yyyy')} onwards
                </span>
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>

          <FilterControls
            filter={filter}
            onFilterChange={setFilter}
            onReset={resetFilters}
          />
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error loading data:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && neos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading Near-Earth Objects...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredAndSortedNeos.map(neo => (
                <NEOCard
                  key={neo.id}
                  neo={neo}
                  isSelected={selectedNeos.some(selected => selected.id === neo.id)}
                  onSelect={handleNEOSelect}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {filteredAndSortedNeos.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No Near-Earth Objects found matching your criteria.
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </div>
            )}

            {filteredAndSortedNeos.length > 0 && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
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
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Developed by @KuldipPatel • Powered by NASA Open APIs
          </p>
        </div>
      </footer>
    </div>
  )
}