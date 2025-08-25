'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { NEOFilter } from '@/types/neo'
import { Filter, SortAsc, SortDesc } from 'lucide-react'

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
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters & Sorting</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Hazardous Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Filter Options</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hazardous"
              checked={filter.showOnlyHazardous}
              onCheckedChange={handleHazardousToggle}
            />
            <Label htmlFor="hazardous" className="text-sm">
              Show only potentially hazardous
            </Label>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy" className="text-sm font-medium">
            Sort By
          </Label>
          <Select value={filter.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Approach Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="diameter">Diameter</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sortOrder" className="text-sm font-medium">
            Sort Order
          </Label>
          <Select value={filter.sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4" />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center space-x-2">
                  <SortDesc className="h-4 w-4" />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="space-y-2">
          <Label className="text-sm font-medium invisible">Reset</Label>
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
