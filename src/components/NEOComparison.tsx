'use client'

import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NEO } from '@/types/neo'
import { NASAApiService } from '@/services/nasa-api'
import { BarChart3, Activity as ScatterIcon, AlertTriangle } from 'lucide-react'

interface NEOComparisonProps {
  neos: NEO[]
}

export const NEOComparison: React.FC<NEOComparisonProps> = ({ neos }) => {
  // Prepare data for diameter comparison
  const diameterData = neos.map(neo => {
    const diameter = NASAApiService.calculateAverageDiameter(neo)
    const closestApproach = NASAApiService.getClosestApproach(neo)
    
    return {
      name: neo.name.length > 15 ? neo.name.substring(0, 15) + '...' : neo.name,
      fullName: neo.name,
      diameter: parseFloat(diameter.toFixed(3)),
      hazardous: neo.is_potentially_hazardous_asteroid,
      distance: closestApproach ? parseFloat(closestApproach.miss_distance.kilometers) : 0,
      velocity: closestApproach ? parseFloat(closestApproach.relative_velocity.kilometers_per_hour) : 0
    }
  })

  // Prepare data for distance vs velocity scatter plot
  const scatterData = neos.map(neo => {
    const closestApproach = NASAApiService.getClosestApproach(neo)
    const diameter = NASAApiService.calculateAverageDiameter(neo)
    
    return {
      name: neo.name,
      distance: closestApproach ? parseFloat(closestApproach.miss_distance.kilometers) / 1000000 : 0, // Convert to millions of km
      velocity: closestApproach ? parseFloat(closestApproach.relative_velocity.kilometers_per_hour) : 0,
      diameter: diameter,
      hazardous: neo.is_potentially_hazardous_asteroid
    }
  }).filter(item => item.distance > 0 && item.velocity > 0)

  const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: Array<{dataKey: string; value: number; color: string}>; label?: string}) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: {dataKey: string; value: number; color: string}, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const ScatterTooltip = ({ active, payload }: {active?: boolean; payload?: Array<{payload: {name: string; distance: number; velocity: number; diameter: number; hazardous: boolean}}>}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p>Distance: {data.distance.toFixed(2)} million km</p>
          <p>Velocity: {data.velocity.toLocaleString()} km/h</p>
          <p>Diameter: {data.diameter.toFixed(3)} km</p>
          {data.hazardous && (
            <Badge variant="destructive" className="mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Hazardous
            </Badge>
          )}
        </div>
      )
    }
    return null
  }

  if (neos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No NEOs selected for comparison.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NEO Comparison</h2>
        <p className="text-gray-600">
          Comparing {neos.length} Near-Earth Object{neos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{neos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Potentially Hazardous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {neos.filter(neo => neo.is_potentially_hazardous_asteroid).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Diameter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(neos.reduce((sum, neo) => sum + NASAApiService.calculateAverageDiameter(neo), 0) / neos.length).toFixed(2)} km
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diameter Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Diameter Comparison</span>
          </CardTitle>
          <CardDescription>
            Average diameter of selected Near-Earth Objects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diameterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis label={{ value: 'Diameter (km)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="diameter" 
                fill="#3b82f6" 
                name="Diameter (km)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distance vs Velocity Scatter Plot */}
      {scatterData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ScatterIcon className="h-5 w-5" />
              <span>Distance vs Velocity</span>
            </CardTitle>
            <CardDescription>
              Relationship between miss distance and velocity for selected NEOs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={scatterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="distance" 
                  name="Distance"
                  label={{ value: 'Miss Distance (Million km)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="velocity" 
                  name="Velocity"
                  label={{ value: 'Velocity (km/h)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter 
                  name="NEOs" 
                  data={scatterData.filter(d => !d.hazardous)}
                  fill="#3b82f6" 
                />
                <Scatter 
                  name="Potentially Hazardous" 
                  data={scatterData.filter(d => d.hazardous)}
                  fill="#dc2626" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
          <CardDescription>
            Side-by-side comparison of selected NEO properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Diameter (km)</th>
                  <th className="text-left p-2">Hazardous</th>
                  <th className="text-left p-2">Miss Distance</th>
                  <th className="text-left p-2">Velocity</th>
                </tr>
              </thead>
              <tbody>
                {diameterData.map((neo, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium" title={neo.fullName}>
                      {neo.name}
                    </td>
                    <td className="p-2">{neo.diameter}</td>
                    <td className="p-2">
                      {neo.hazardous ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      {neo.distance > 0 ? NASAApiService.formatDistance(neo.distance.toString()) : 'N/A'}
                    </td>
                    <td className="p-2">
                      {neo.velocity > 0 ? NASAApiService.formatVelocity(neo.velocity.toString()) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
