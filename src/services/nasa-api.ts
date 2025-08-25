import axios from 'axios'
import { format, addDays } from 'date-fns'
import { NEOResponse, NEO } from '@/types/neo'

const NASA_BASE_URL = process.env.NEXT_PUBLIC_NASA_BASE_URL || 'https://api.nasa.gov'
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'

export class NASAApiService {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = NASA_BASE_URL
    this.apiKey = NASA_API_KEY
  }

  /**
   * Fetch Near Earth Objects for a date range
   */
  async getNEOFeed(startDate: Date, endDate: Date): Promise<NEOResponse> {
    try {
      const start = format(startDate, 'yyyy-MM-dd')
      const end = format(endDate, 'yyyy-MM-dd')
      
      const response = await axios.get(`${this.baseURL}/neo/rest/v1/feed`, {
        params: {
          start_date: start,
          end_date: end,
          api_key: this.apiKey
        }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching NEO feed:', error)
      throw new Error('Failed to fetch Near Earth Objects data')
    }
  }

  /**
   * Get NEOs for the current date and next 7 days
   */
  async getCurrentWeekNEOs(): Promise<NEOResponse> {
    const today = new Date()
    const nextWeek = addDays(today, 7)
    return this.getNEOFeed(today, nextWeek)
  }

  /**
   * Get NEOs for a specific date range with pagination support
   */
  async getNEOsWithPagination(startDate: Date, days: number = 7): Promise<NEOResponse> {
    const endDate = addDays(startDate, days)
    return this.getNEOFeed(startDate, endDate)
  }

  /**
   * Get detailed information about a specific NEO
   */
  async getNEODetails(neoId: string): Promise<NEO> {
    try {
      const response = await axios.get(`${this.baseURL}/neo/rest/v1/neo/${neoId}`, {
        params: {
          api_key: this.apiKey
        }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching NEO details:', error)
      throw new Error('Failed to fetch NEO details')
    }
  }

  /**
   * Get NEO lookup by asteroid designation
   */
  async lookupNEO(asteroidId: string): Promise<NEO> {
    try {
      const response = await axios.get(`${this.baseURL}/neo/rest/v1/neo/browse`, {
        params: {
          api_key: this.apiKey
        }
      })

      const neo = response.data.near_earth_objects.find((n: NEO) => 
        n.id === asteroidId || n.neo_reference_id === asteroidId
      )

      if (!neo) {
        throw new Error('NEO not found')
      }

      return neo
    } catch (error) {
      console.error('Error looking up NEO:', error)
      throw new Error('Failed to lookup NEO')
    }
  }

  /**
   * Calculate average diameter of a NEO
   */
  static calculateAverageDiameter(neo: NEO): number {
    const { estimated_diameter_min, estimated_diameter_max } = neo.estimated_diameter.kilometers
    return (estimated_diameter_min + estimated_diameter_max) / 2
  }

  /**
   * Get the closest approach data for a NEO
   */
  static getClosestApproach(neo: NEO) {
    if (!neo.close_approach_data || neo.close_approach_data.length === 0) {
      return null
    }

    // Sort by date and return the closest one
    return neo.close_approach_data.sort((a, b) => 
      new Date(a.close_approach_date).getTime() - new Date(b.close_approach_date).getTime()
    )[0]
  }

  /**
   * Format distance for display
   */
  static formatDistance(kilometers: string): string {
    const km = parseFloat(kilometers)
    if (km > 1000000) {
      return `${(km / 1000000).toFixed(2)}M km`
    } else if (km > 1000) {
      return `${(km / 1000).toFixed(2)}K km`
    }
    return `${km.toFixed(2)} km`
  }

  /**
   * Format velocity for display
   */
  static formatVelocity(kmPerHour: string): string {
    const velocity = parseFloat(kmPerHour)
    return `${velocity.toFixed(2)} km/h`
  }
}

export const nasaApi = new NASAApiService()
