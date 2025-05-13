import axiosInstance from '@/lib/axios'
import config from '@/config/config'

export function useProfileApi() {
  const getProfile = async () => {
    const response = await axiosInstance.get(config.endpoints.user.getProfile)
    return (response.data as { data: unknown }).data;
  }

  const updateProfile = async (profileData: unknown) => {
    const response = await axiosInstance.patch(config.endpoints.user.updateProfile, profileData)
    return (response.data as { data: unknown }).data;
  }

  const updateUser = async (userData: unknown) => {
    const response = await axiosInstance.put(config.endpoints.user.updateUser, userData)
    return (response.data as { data: unknown }).data;
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await axiosInstance.post('/api/v1/user/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return (response.data as { url: string }).url
  }

  const uploadCoverImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('coverImage', file)
    const response = await axiosInstance.post('/api/v1/user/profile/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return (response.data as { url: string }).url
  }

  const createCreatorRequest = async (data: {
    reason: string
    portfolio: string
    socialLinks: {
      youtube?: string
      instagram?: string
      twitter?: string
      website?: string
    }
  }) => {
    const response = await axiosInstance.post('/api/v1/creator-requests', data)
    return (response.data as { data: unknown }).data
  }

  const getMyCreatorRequest = async () => {
    const response = await axiosInstance.get('/api/v1/creator-requests/user/me')
    return (response.data as { data: unknown }).data
  }

  return { getProfile, updateProfile, updateUser, uploadAvatar, uploadCoverImage, createCreatorRequest, getMyCreatorRequest }
} 