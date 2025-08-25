'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { NEO } from '@/types/neo'
import { NASAApiService } from '@/services/nasa-api'
import { 
  AlertTriangle, 
  Eye, 
  ExternalLink, 
  Calendar, 
  Ruler, 
  Zap,
  Target,
  Clock
} from 'lucide-react'

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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        layout: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className={`
        premium-card premium-hover relative overflow-hidden
        ${isSelected 
          ? 'ring-2 ring-slate-400 shadow-premium-xl' 
          : ''
        }
        ${neo.is_potentially_hazardous_asteroid ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-slate-600'}
      `}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                {showCheckbox && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={handleCheckboxChange}
                      className="premium-checkbox data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800"
                    />
                  </motion.div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-visible text-lg leading-tight font-space-grotesk">
                    {neo.name}
                  </h3>
                  <p className="text-sm text-visible-muted mt-1 font-mono">
                    ID: {neo.id}
                  </p>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {neo.is_potentially_hazardous_asteroid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Potentially Hazardous
                    </Badge>
                  </motion.div>
                )}
                <Badge variant="outline" className="text-slate-600 border-slate-200">
                  <Target className="h-3 w-3 mr-1" />
                  NEO
                </Badge>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="space-y-4 mb-6">
            {/* Primary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center space-x-2 text-slate-700 mb-2">
                  <Ruler className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Diameter</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-space-grotesk">
                  {averageDiameter.toFixed(2)} km
                </div>
              </div>

              {closestApproach && (
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-slate-700 mb-2">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold">Velocity</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-space-grotesk">
                    {Math.round(parseFloat(closestApproach.relative_velocity.kilometers_per_hour)).toLocaleString()} km/h
                  </div>
                </div>
              )}
            </div>

            {/* Approach Details */}
            {closestApproach && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Closest Approach:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {format(new Date(closestApproach.close_approach_date), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-700 font-semibold">Miss Distance</div>
                      <div className="text-lg font-bold text-blue-900 font-space-grotesk">
                        {NASAApiService.formatDistance(closestApproach.miss_distance.kilometers)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-600 font-medium">Lunar Distance</div>
                      <div className="text-sm font-bold text-blue-800">
                        {parseFloat(closestApproach.miss_distance.lunar).toFixed(2)} LD
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Orbiting:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {closestApproach.orbiting_body}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex items-center space-x-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(neo.nasa_jpl_url, '_blank')}
              className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="italic">NASA JPL</span>
            </Button>
          </div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  )
}