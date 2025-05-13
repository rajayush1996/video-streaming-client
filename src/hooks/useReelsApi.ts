import { useState } from 'react';
import axiosInstance from '@/lib/axios'
import config from '@/config/config'

const endpoints = config.endpoints.media

interface Reel {
  id: string
  title: string
  description: string
  url: string
  thumbnailUrl: string
  views: number
  category: string
  createdAt: string
  status: string
  userId: string
  author?: {
    id: string
    name: string
  }
}

interface ReelsResponse {
  success: boolean
  message: string
  data: {
    results: never[]
    items: Reel[]
    total: number
    page: number
    limit: number
  }
}

interface FetchReelsParams {
  page?: number
  limit?: number
  sortBy?: string
  status?: string
  category?: string
}

export const useReelsApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReels = async (params: FetchReelsParams = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axiosInstance.get<ReelsResponse>(endpoints.getReels, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || 'createdAt:desc',
          status: params.status || 'approved',
          category: params.category
        }
      })

      return response.data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reels')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReelById = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axiosInstance.get<{ success: boolean; message: string; data: Reel }>(`${endpoints.getReels}/${id}`)
      return response.data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reel')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fetchReels,
    fetchReelById,
    isLoading,
    error
  }
} 