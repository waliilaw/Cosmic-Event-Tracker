'use client'

import React from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NEO } from '@/types/neo'
import { NASAApiService } from '@/services/nasa-api'
import { 
  AlertTriangle, 
  ExternalLink, 
  Calendar, 
  Ruler, 
  Zap, 
  Target,
  Globe,
  Clock,
  Orbit
} from 'lucide-react'

interface NEODetailModalProps {
  neo: NEO | null
  isOpen: boolean
  onClose: () => void
}

export const NEODetailModal: React.FC<NEODetailModalProps> = ({
  neo,
  isOpen,
  onClose
}) => {
  if (!neo) return null

  const averageDiameter = NASAApiService.calculateAverageDiameter(neo)
  const closestApproach = NASAApiService.getClosestApproach(neo)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-xl">{neo.name}</span>
            {neo.is_potentially_hazardous_asteroid && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Potentially Hazardous</span>
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this Near-Earth Object
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">NEO Reference ID:</span>
                  <span className="font-medium">{neo.neo_reference_id}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Average Diameter:</span>
                  <span className="font-medium">{averageDiameter.toFixed(3)} km</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Diameter Range:</span>
                  <span className="font-medium">
                    {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} - {' '}
                    {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Absolute Magnitude:</span>
                  <span className="font-medium">{neo.absolute_magnitude_h}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Sentry Object:</span>
                  <Badge variant={neo.is_sentry_object ? "destructive" : "outline"}>
                    {neo.is_sentry_object ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            {closestApproach && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Closest Approach</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {format(new Date(closestApproach.close_approach_date), 'MMMM dd, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-600">Full Date:</span>
                    <span className="font-medium text-sm">
                      {closestApproach.close_approach_date_full}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">Orbiting Body:</span>
                    <span className="font-medium">{closestApproach.orbiting_body}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <span className="text-gray-600">Velocity:</span>
                    <span className="font-medium">
                      {NASAApiService.formatVelocity(closestApproach.relative_velocity.kilometers_per_hour)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Miss Distance Details */}
          {closestApproach && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Miss Distance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Kilometers</div>
                  <div className="text-lg font-semibold">
                    {NASAApiService.formatDistance(closestApproach.miss_distance.kilometers)}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Miles</div>
                  <div className="text-lg font-semibold">
                    {parseFloat(closestApproach.miss_distance.miles).toLocaleString()} mi
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Lunar Distance</div>
                  <div className="text-lg font-semibold">
                    {parseFloat(closestApproach.miss_distance.lunar).toFixed(2)} LD
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Astronomical Units</div>
                  <div className="text-lg font-semibold">
                    {parseFloat(closestApproach.miss_distance.astronomical).toFixed(6)} AU
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Velocity Details */}
          {closestApproach && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Velocity Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600">Kilometers per Second</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {parseFloat(closestApproach.relative_velocity.kilometers_per_second).toFixed(2)} km/s
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600">Kilometers per Hour</div>
                  <div className="text-lg font-semibold text-green-800">
                    {NASAApiService.formatVelocity(closestApproach.relative_velocity.kilometers_per_hour)}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600">Miles per Hour</div>
                  <div className="text-lg font-semibold text-purple-800">
                    {parseFloat(closestApproach.relative_velocity.miles_per_hour).toLocaleString()} mph
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orbital Data */}
          {neo.orbital_data && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Orbit className="h-5 w-5" />
                <span>Orbital Data</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Orbit ID:</span>
                  <span className="font-medium ml-2">{neo.orbital_data.orbit_id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Orbital Period:</span>
                  <span className="font-medium ml-2">{neo.orbital_data.orbital_period} days</span>
                </div>
                <div>
                  <span className="text-gray-600">Eccentricity:</span>
                  <span className="font-medium ml-2">{neo.orbital_data.eccentricity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Inclination:</span>
                  <span className="font-medium ml-2">{neo.orbital_data.inclination}°</span>
                </div>
              </div>
            </div>
          )}

          {/* External Link */}
          <div className="pt-4 border-t">
            <Button
              onClick={() => window.open(neo.nasa_jpl_url, '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on NASA JPL</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
