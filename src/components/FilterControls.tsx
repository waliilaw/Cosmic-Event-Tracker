'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { NEOFilter } from '@/types/neo'
import { Filter, SortAsc, SortDesc, RefreshCw, AlertTriangle } from 'lucide-react'

interface FilterControlsProps {
  filter: NEOFilter
  onFilterChange: (filter: NEOFilter) => void
  onReset: () => void
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  onFilterChange,
  onReset
}) => {
  const handleHazardousToggle = (checked: boolean) => {
    onFilterChange({
      ...filter,
      showOnlyHazardous: checked
    })
  }

  const handleSortByChange = (value: string) => {
    onFilterChange({
      ...filter,
      sortBy: value as NEOFilter['sortBy']
    })
  }

  const handleSortOrderChange = (value: string) => {
    onFilterChange({
      ...filter,
      sortOrder: value as NEOFilter['sortOrder']
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="premium-card rounded-2xl p-6 shadow-premium-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
          <Filter className="h-4 w-4 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 font-space-grotesk">
          Filters & Sorting
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Hazardous Filter */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Label className="text-sm font-medium text-slate-700">Filter Options</Label>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="hazardous"
                checked={filter.showOnlyHazardous}
                onCheckedChange={handleHazardousToggle}
                className="premium-checkbox data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
              <Label 
                htmlFor="hazardous" 
                className="text-sm font-semibold text-visible cursor-pointer flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Show only potentially hazardous</span>
              </Label>
            </div>
          </div>
        </motion.div>

        {/* Sort By */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Label htmlFor="sortBy" className="text-sm font-semibold text-slate-800">
            Sort By
          </Label>
          <Select value={filter.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="premium-select-trigger h-11 font-medium text-slate-900">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent className="premium-dropdown">
              <SelectItem value="date" className="premium-dropdown-item font-medium">
                <div className="flex items-center space-x-2">
                  <span>Approach Date</span>
                </div>
              </SelectItem>
              <SelectItem value="name" className="premium-dropdown-item font-medium">
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                </div>
              </SelectItem>
              <SelectItem value="diameter" className="premium-dropdown-item font-medium">
                <div className="flex items-center space-x-2">
                  <span>Diameter</span>
                </div>
              </SelectItem>
              <SelectItem value="distance" className="premium-dropdown-item font-medium">
                <div className="flex items-center space-x-2">
                  <span>Distance</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Sort Order */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Label htmlFor="sortOrder" className="text-sm font-semibold text-slate-800">
            Sort Order
          </Label>
          <Select value={filter.sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="premium-select-trigger h-11 font-medium text-slate-900">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent className="premium-dropdown">
              <SelectItem value="asc" className="premium-dropdown-item font-medium">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4 text-green-600" />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="desc" className="premium-dropdown-item font-medium">
                <div className="flex items-center space-x-2">
                  <SortDesc className="h-4 w-4 text-blue-600" />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Reset Button */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Label className="text-sm font-medium text-slate-700">Actions</Label>
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full glass-input border-slate-300 text-visible hover:bg-white/80 hover:text-visible font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </motion.div>
      </div>

      {/* Active Filters Summary */}
      {(filter.showOnlyHazardous || filter.sortBy !== 'date' || filter.sortOrder !== 'asc') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <span className="font-medium">Active filters:</span>
              {filter.showOnlyHazardous && (
                <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200">
                  Hazardous only
                </span>
              )}
              {filter.sortBy !== 'date' && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200">
                  Sort: {filter.sortBy}
                </span>
              )}
              {filter.sortOrder !== 'asc' && (
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs border border-purple-200">
                  {filter.sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}