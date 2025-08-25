'use client'

import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { NEO } from '@/types/neo'
import { NASAApiService } from '@/services/nasa-api'
import { AlertTriangle, Eye, ExternalLink, Calendar, Ruler, Zap } from 'lucide-react'

interface NEOCardProps {
  neo: NEO
  isSelected?: boolean
  onSelect?: (neo: NEO, selected: boolean) => void
  onViewDetails?: (neo: NEO) => void
  showCheckbox?: boolean
}

export const NEOCard: React.FC<NEOCardProps> = ({
  neo,
  isSelected = false,
  onSelect,
  onViewDetails,
  showCheckbox = true
}) => {
  const averageDiameter = NASAApiService.calculateAverageDiameter(neo)
  const closestApproach = NASAApiService.getClosestApproach(neo)

  const handleCheckboxChange = (checked: boolean) => {
    onSelect?.(neo, checked)
  }

  const handleViewDetails = () => {
    onViewDetails?.(neo)
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    } ${neo.is_potentially_hazardous_asteroid ? 'border-red-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {showCheckbox && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={handleCheckboxChange}
                  className="mt-1"
                />
              )}
              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                {neo.name}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              {neo.is_potentially_hazardous_asteroid && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Potentially Hazardous</span>
                </Badge>
              )}
              <Badge variant="outline">
                ID: {neo.id}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Ruler className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Diameter:</span>
              <span className="font-medium">{averageDiameter.toFixed(2)} km</span>
            </div>

            {closestApproach && (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Closest Approach:</span>
                  <span className="font-medium">
                    {format(new Date(closestApproach.close_approach_date), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-600">Velocity:</span>
                  <span className="font-medium">
                    {NASAApiService.formatVelocity(closestApproach.relative_velocity.kilometers_per_hour)}
                  </span>
                </div>
              </>
            )}
          </div>

          {closestApproach && (
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Miss Distance:</span>
                <div className="font-medium text-right">
                  {NASAApiService.formatDistance(closestApproach.miss_distance.kilometers)}
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {parseFloat(closestApproach.miss_distance.lunar).toFixed(2)} lunar distances
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Orbiting:</span>
                <div className="font-medium text-right">
                  {closestApproach.orbiting_body}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(neo.nasa_jpl_url, '_blank')}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4" />
            <span>NASA JPL</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
