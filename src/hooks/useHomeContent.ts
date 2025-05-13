/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useMediaApi } from './useMediaApi'
import { useReelsApi } from './useReelsApi'
import { useBlogApi } from './useBlogApi'

export interface ContentParams {
  page?: number
  limit?: number
  sortBy?: string
  category?: string
}

export const useHomeContent = () => {
  const { fetchMedia, isLoading: loadingVideos, error: errorVideos } = useMediaApi()
  const { fetchReels, isLoading: loadingReels, error: errorReels } = useReelsApi()
  const { fetchBlogs, isLoading: loadingBlogs, error: errorBlogs } = useBlogApi()

  const [videos, setVideos] = useState<any[]>([])
  const [reels, setReels] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const isLoading = loadingVideos || loadingReels || loadingBlogs
  const error = errorVideos || errorReels || errorBlogs

  // 1) fetchContent: unified loader for page X
  const fetchContent = useCallback(
    async ({
      page = 1,
      limit = 10,
      sortBy = 'createdAt:desc',
      category,
    }: ContentParams = {}) => {
      try {
        // parallel calls
        const [videosRes, reelsRes, blogsRes] = await Promise.all([
          fetchMedia({ page, limit, sortBy, category }),
          fetchReels({ page, limit, sortBy, category }),
          fetchBlogs({ page, limit, sortBy, category }),
        ])

        // console.log('Videos response:', videosRes)
        // console.log('Reels response:', reelsRes)
        // console.log('Blogs response:', blogsRes)

        // replace or append
        if (page === 1) {
          setVideos(videosRes.results || [])
          setReels(reelsRes.results || [])
          setBlogs(blogsRes.results || [])
        } else {
          setVideos((prev) => [...prev, ...(videosRes.results || [])])
          setReels((prev) => [...prev, ...(reelsRes.results || [])])
          setBlogs((prev) => [...prev, ...(blogsRes.results || [])])
        }

        // more if any list filled to `limit`
        const moreVideos = (videosRes.results?.length || 0) === limit
        const moreReels = (reelsRes.results?.length || 0) === limit
        const moreBlogs = (blogsRes.results?.length || 0) === limit

        setHasMore(moreVideos || moreReels || moreBlogs)
      } catch (err) {
        console.error('Error fetching content:', err)
      }
    },
    [fetchMedia, fetchReels, fetchBlogs]
  )

  // 2) Refresh (page=1)
  const refreshContent = useCallback(async () => {
    setCurrentPage(1)
    await fetchContent({ page: 1 })
  }, [fetchContent])

  // 3) Load more (page++)
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    const next = currentPage + 1
    setCurrentPage(next)
    await fetchContent({ page: next })
  }, [currentPage, fetchContent, hasMore, isLoading])

  // 4) initial fetch once
  useEffect(() => {
    refreshContent()
  }, [])

  return {
    videos,
    reels,
    blogs,
    isLoading,
    error,
    hasMore,
    loadMore,
    refreshContent,
    currentPage,
  }
}
