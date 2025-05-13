import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios'
import config from '@/config/config'

const endpoints = config.endpoints.media

interface MediaMetadata {
  id: string
  thumbnailId: string
  mediaFileId: string
  title: string
  description: string
  category: string
  mediaType: 'video' | 'reel'
  userId: string
  views: number
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  thumbnailUrl: string
  mediaFileUrl: string
}

interface MediaResponse {
  results: MediaMetadata[]
  skip: number
  limit: number
  hasMore: boolean
  totalPages: number
  totalResults: number
}

interface FetchMediaParams {
  page?: number
  limit?: number
  sortBy?: string
  status?: string
  category?: string
  mediaType?: 'video' | 'reel'
}

export const useMediaApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMedia = useCallback(async (params: FetchMediaParams = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axiosInstance.get<{ data: MediaResponse }>(endpoints.getMedia, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || 'createdAt:desc',
          status: params.status || 'approved',
          category: params.category,
          mediaType: params.mediaType
        }
      })

      return response.data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, []);

  const fetchMediaById = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axiosInstance.get<{ data: MediaMetadata }>(`${endpoints.getMedia}/${id}`)
      return response.data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, []);

  return {
    fetchMedia,
    fetchMediaById,
    isLoading,
    error
  }
} 