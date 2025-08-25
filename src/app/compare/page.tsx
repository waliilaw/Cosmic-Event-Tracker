'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { NEOComparison } from '@/components/NEOComparison'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NEO } from '@/types/neo'
import { nasaApi } from '@/services/nasa-api'
import { ArrowLeft, AlertCircle } from 'lucide-react'

function ComparePageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [neos, setNeos] = useState<NEO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNEOsForComparison = async () => {
      try {
        setLoading(true)
        setError(null)

        const ids = searchParams.get('ids')
        if (!ids) {
          setError('No NEO IDs provided for comparison')
          return
        }

        const neoIds = ids.split(',')
        
        // For demo purposes, we'll fetch current week data and filter by IDs
        // In a real app, you'd want to store selected NEOs in state management or localStorage
        const response = await nasaApi.getCurrentWeekNEOs()
        
        const allNeos: NEO[] = []
        Object.values(response.near_earth_objects).forEach(dateNeos => {
          allNeos.push(...dateNeos)
        })

        const selectedNeos = allNeos.filter(neo => neoIds.includes(neo.id))
        
        if (selectedNeos.length === 0) {
          setError('No matching NEOs found. They may have been from a different date range.')
        } else {
          setNeos(selectedNeos)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load NEO comparison data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchNEOsForComparison()
    }
  }, [user, searchParams])

  const handleGoBack = () => {
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access the comparison feature.</p>
            <Button onClick={handleGoBack}>Go Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading comparison data...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error loading comparison:</span>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={handleGoBack} variant="outline">
                Go Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <NEOComparison neos={neos} />
        )}
      </main>

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

export default function ComparePage() {
  const { loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  )
}
