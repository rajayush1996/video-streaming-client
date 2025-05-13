/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axiosInstance from '@/lib/axios'
import config from '@/config/config'

const endpoints = config.endpoints.media

interface Blog {
  _id: string
  title: string
  content: string
  description: string
  category: string
  status: string
  admin: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

interface FetchBlogsParams {
  page?: number
  limit?: number
  sortBy?: string
  status?: string
  category?: string
}

export const useBlogApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async (params: FetchBlogsParams = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response: any = await axiosInstance.get<ApiResponse<Blog[]>>(endpoints.getBlogs, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || 'createdAt:desc',
          status: params.status || 'published',
          category: params.category
        }
      })

      console.log('Blogs API Response:', response.data)
      return response.data.data;
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBlogById = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axiosInstance.get<ApiResponse<Blog>>(`${endpoints.getBlogs}/${id}`)
      console.log('Blog Detail API Response:', response.data)
      return response.data.data
    } catch (err) {
      console.error('Error fetching blog by id:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch blog')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fetchBlogs,
    fetchBlogById,
    isLoading,
    error
  }
} 