/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useProfileApi } from '@/hooks/useProfileApi'
import { 
  Plus,
  Twitter,
  Instagram,
  Youtube,
  Edit2,
  X,
  Settings,
  History,
  Video,
  FileText,
  Film,
  MapPin
} from 'lucide-react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Fade,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  IconButton
} from '@mui/material'
import Image from 'next/image'

interface SocialLinks {
  twitter: string
  instagram: string
  youtube: string
}

interface NotificationPreferences {
  email: boolean
  push: boolean
}

interface ProfilePreferences {
  isPublic: boolean
  showEmail: boolean
  notifications: NotificationPreferences
}

interface Profile {
  bio: string
  location: string
  avatar: string
  coverImage: string
  socialLinks: SocialLinks
  preferences: ProfilePreferences
}

interface UserStats {
  posts: number
  followers: number
  following: number
}

interface User {
  id: string
  username: string
  email: string
  isVerified: boolean
  role: string
  createdAt: string
  updatedAt: string
}

interface ProfileData {
  user: User
  profile: Profile
  stats: UserStats
}

interface ProfileUpdateResponse {
  profile: Profile
}

// Client component for the profile content
function ProfileContent() {
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  console.log("🚀 ~ ProfileContent ~ user:", user);
  const router = useRouter()
  const { getProfile, updateProfile, uploadAvatar, createCreatorRequest } = useProfileApi()
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('posts')
  const [isEditing, setIsEditing] = React.useState(false)
  const [originalProfile, setOriginalProfile] = React.useState<ProfileData | null>(null)
  const [editedProfile, setEditedProfile] = React.useState<ProfileData | null>(null)
  const hasFetchedProfile = React.useRef(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [creatorForm, setCreatorForm] = useState({
    reason: '',
    portfolio: '',
    youtube: '',
    instagram: '',
    twitter: '',
    website: ''
  })
  const [creatorLoading, setCreatorLoading] = useState(false)
  const [creatorError, setCreatorError] = useState('')
  const [showCreatorModal, setShowCreatorModal] = useState(false)

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthLoading) {
        return
      }

    if (!user) {
      router.push('/login')
        return
      }

      if (hasFetchedProfile.current) {
        return
      }

      try {
        setIsLoading(true)
        const profile = await getProfile() as ProfileData
        setOriginalProfile(profile)
        setEditedProfile(profile)
        hasFetchedProfile.current = true
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()

    return () => {
      hasFetchedProfile.current = false
    }
  }, [user, router, isAuthLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => {
      if (!prev) return prev
      if (name.startsWith('profile.')) {
        const profileField = name.split('.')[1]
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [profileField]: value
          }
        }
      }
      return {
      ...prev,
      [name]: value
      }
    })
  }

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setEditedProfile((prev) => {
      if (!prev) return prev
      return {
      ...prev,
        profile: {
          ...prev.profile,
      socialLinks: {
            ...prev.profile.socialLinks,
        [platform]: value
          }
        }
      }
    })
  }

  const handlePreferenceChange = (preference: keyof ProfilePreferences, value: boolean) => {
    setEditedProfile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        profile: {
          ...prev.profile,
          preferences: {
            ...prev.profile.preferences,
            [preference]: value
          }
        }
      }
    })
  }

  const handleNotificationChange = (type: keyof NotificationPreferences, value: boolean) => {
    setEditedProfile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        profile: {
          ...prev.profile,
          preferences: {
            ...prev.profile.preferences,
            notifications: {
              ...prev.profile.preferences.notifications,
              [type]: value
            }
          }
        }
      }
    })
  }

  const handleEditProfile = () => {
    if (originalProfile) {
      setEditedProfile({ ...originalProfile })
      setIsEditing(true)
      setShowCreatorModal(false)
    }
  }

  const handleOpenCreatorModal = () => {
    setShowCreatorModal(true)
    setIsEditing(false)
  }

  const handleSaveProfile = async () => {
    if (!editedProfile) return
    try {
      setIsLoading(true)
      const profileResponse = await updateProfile(editedProfile.profile) as ProfileUpdateResponse
      setOriginalProfile((prev) => prev ? { ...prev, profile: profileResponse.profile } : null)
      setEditedProfile((prev) => prev ? { ...prev, profile: profileResponse.profile } : null)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    avatarInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    try {
      setIsLoading(true)
      const url = await uploadAvatar(file)
      setEditedProfile((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                avatar: url,
              },
            }
          : prev
      )
    } catch (error) {
      console.error('Failed to upload avatar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreatorForm({ ...creatorForm, [e.target.name]: e.target.value })
  }

  const handleCreatorRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatorLoading(true)
    setCreatorError('')
    try {
      await createCreatorRequest({
        reason: creatorForm.reason,
        portfolio: creatorForm.portfolio,
        socialLinks: {
          youtube: creatorForm.youtube,
          instagram: creatorForm.instagram,
          twitter: creatorForm.twitter,
          website: creatorForm.website,
        },
      })
      // Optionally show a success message or reset the form here
    } catch (err: unknown) {
      let message = 'Failed to submit request';
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        message = (err.response.data as { message?: string }).message || message;
      }
      setCreatorError(message);
    } finally {
      setCreatorLoading(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    )
  }

  if (!user || !editedProfile) {
    return null
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#18181b', color: '#fff', py: 4, mt: 8 }}>
      <Fade in>
        <Box maxWidth={900} mx="auto" px={{ xs: 0, md: 2 }}>
      {/* Cover Image */}
          <Box sx={{ position: 'relative', height: 100, borderRadius: 6, overflow: 'hidden', mb: 0, width: '100%' }}>
            {editedProfile.profile.coverImage ? (
              <Image
                src={editedProfile.profile.coverImage}
          alt="Cover"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <Box sx={{ width: '100%', height: '100%', bgcolor: 'linear-gradient(90deg, #7C3AED 0%, #6D28D9 100%)' }} />
            )}
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), #18181b 90%)' }} />
          </Box>

          {/* Profile Card with glassmorphism and animation */}
          <Fade in timeout={700}>
            <Card sx={{
              mt: -6,
              mb: 4,
              borderRadius: 8,
              bgcolor: 'rgba(40,40,60,0.60)',
              boxShadow: '0 12px 48px 0 rgba(31,38,135,0.25)',
              color: '#fff',
              backdropFilter: 'blur(20px)',
              border: '2.5px solid rgba(124,58,237,0.18)',
              px: { xs: 2, md: 8 },
              pt: 8,
              pb: 4,
              position: 'relative',
              overflow: 'visible',
              width: '100%',
              maxWidth: 900,
              mx: 'auto',
            }}>
              {/* Avatar Overlap */}
              <Box sx={{ position: 'absolute', left: { xs: '50%', md: 40 }, top: -64, transform: { xs: 'translateX(-50%)', md: 'none' }, zIndex: 2 }}>
                <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={editedProfile.profile.avatar || ''}
                  alt={editedProfile.user.username}
                  sx={{
                    width: 128,
                    height: 128,
                    fontSize: 48,
                    bgcolor: '#7C3AED',
                    border: '2px solid #fff'
                  }}
                >
                  {editedProfile.user.username.charAt(0).toUpperCase()}
                </Avatar>
              {isEditing && (
                    <>
                      <IconButton
                      onClick={handleAvatarClick}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: 'rgba(24,24,27,0.7)',
                          color: '#fff',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px #0004',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 0,
                          zIndex: 2,
                          transition: 'background 0.2s',
                          '&:hover': { bgcolor: '#7C3AED' },
                        }}
                      >
                        <Edit2 size={18} />
                      </IconButton>
                    <input
                      type="file"
                      accept="image/*"
                      ref={avatarInputRef}
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                    </>
                )}
                </Box>
              </Box>

              {/* Profile Info and Actions */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ xs: 'center', md: 'flex-start' }}>
                <Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} mb={1} mt={{ xs: 8, md: 0 }}>
                    <Typography variant="h4" fontWeight={700}>{editedProfile.user.username}</Typography>
                    <Box px={2} py={0.5} borderRadius={2} bgcolor="#7C3AED22" color="#7C3AED" fontWeight={600} fontSize={16} letterSpacing={1}>
                      {editedProfile.user.role}
                    </Box>
                  </Stack>
                  {editedProfile.profile.bio && (
                    <Typography color="#fff9" mb={2}>{editedProfile.profile.bio}</Typography>
                  )}
                  {editedProfile.profile.location && (
                    <Stack direction="row" alignItems="center" spacing={1} color="#fff9" mb={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                      <MapPin style={{ width: 20, height: 20 }} />
                      <span>{editedProfile.profile.location}</span>
                    </Stack>
                  )}
              {/* Stats */}
                  <Stack direction="row" spacing={6} justifyContent={{ xs: 'center', md: 'flex-start' }} my={2}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={700}>{editedProfile.stats.posts}</Typography>
                      <Typography variant="body2" color="#fff9">Posts</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={700}>{editedProfile.stats.followers}</Typography>
                      <Typography variant="body2" color="#fff9">Followers</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={700}>{editedProfile.stats.following}</Typography>
                      <Typography variant="body2" color="#fff9">Following</Typography>
                    </Box>
                  </Stack>
              {/* Social Links */}
                  <Stack direction="row" spacing={2} mb={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                    {editedProfile.profile.socialLinks.twitter && (
                      <a href={editedProfile.profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter style={{ width: 28, height: 28, color: '#fff' }} />
                      </a>
                    )}
                    {editedProfile.profile.socialLinks.instagram && (
                      <a href={editedProfile.profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram style={{ width: 28, height: 28, color: '#fff' }} />
                      </a>
                    )}
                    {editedProfile.profile.socialLinks.youtube && (
                      <a href={editedProfile.profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                        <Youtube style={{ width: 28, height: 28, color: '#fff' }} />
                      </a>
                    )}
                  </Stack>
              {/* Action Buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
                {isEditing ? (
                  <Box
                    sx={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 2000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 400,
                        bgcolor: '#18181b',
                        borderRadius: 4,
                        p: 4,
                        position: 'relative',
                        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* Close Button */}
                      <Button
                        onClick={() => {
                          if (originalProfile) setEditedProfile({ ...originalProfile })
                          setIsEditing(false)
                        }}
                        sx={{
                          position: 'absolute',
                          right: 16,
                          top: 16,
                          color: '#fff',
                          minWidth: 0,
                          p: 1,
                        }}
                      >
                        <X size={20} />
                      </Button>
                      {/* Avatar Section */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            src={editedProfile.profile.avatar || ''}
                            alt={editedProfile.user.username}
                            sx={{
                              width: 96,
                              height: 96,
                              fontSize: 40,
                              bgcolor: '#7C3AED',
                              border: '2px solid #fff',
                              boxShadow: '0 2px 12px #7C3AED44',
                            }}
                          >
                            {editedProfile.user.username.charAt(0).toUpperCase()}
                          </Avatar>
                              {isEditing && (
                                <>
                                  <IconButton
                            onClick={handleAvatarClick}
                            sx={{
                              position: 'absolute',
                                      bottom: 8,
                                      right: 8,
                                      width: 36,
                                      height: 36,
                              borderRadius: '50%',
                                      bgcolor: 'rgba(24,24,27,0.7)',
                              color: '#fff',
                                      border: '2px solid #fff',
                                      boxShadow: '0 2px 8px #0004',
                                      backdropFilter: 'blur(6px)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      p: 0,
                                      zIndex: 2,
                                      transition: 'background 0.2s',
                                      '&:hover': { bgcolor: '#7C3AED' },
                                    }}
                                  >
                                    <Edit2 size={18} />
                                  </IconButton>
                          <input
                            type="file"
                            accept="image/*"
                            ref={avatarInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                          />
                                </>
                              )}
                        </Box>
                      </Box>
                      {/* Form Fields */}
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Username"
                          name="username"
                          value={editedProfile.user.username}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                        />
                        <TextField
                          label="Email"
                          name="email"
                          value={editedProfile.user.email}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                        />
                        <TextField
                          label="Bio"
                          name="profile.bio"
                          value={editedProfile.profile.bio}
                          onChange={handleInputChange}
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                        />
                        <TextField
                          label="Location"
                          name="profile.location"
                          value={editedProfile.profile.location}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                        />
                        <Typography sx={{ color: '#fff', mt: 1, mb: 0.5, fontWeight: 600, fontSize: 15 }}>Social Links</Typography>
                        <TextField
                          label="Twitter"
                          value={editedProfile.profile.socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          fullWidth
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                        />
                        <TextField
                          label="Instagram"
                          value={editedProfile.profile.socialLinks.instagram}
                          onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                          fullWidth
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                              placeholder="Instagram"
                        />
                        <TextField
                          label="YouTube"
                          value={editedProfile.profile.socialLinks.youtube}
                          onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                          fullWidth
                          size="small"
                          InputLabelProps={{ style: { color: '#fff' } }}
                          InputProps={{ style: { color: '#fff' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: '#a78bfa' },
                              '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                          }}
                              placeholder="YouTube"
                        />
                      </Box>
                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 2, mt: 4, width: '100%' }}>
                        <Button
                      onClick={handleSaveProfile}
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: '#7C3AED',
                            '&:hover': { bgcolor: '#6D28D9' },
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: 2,
                          }}
                              disabled={creatorLoading}
                              endIcon={creatorLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                              {creatorLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                      onClick={() => {
                            if (originalProfile) setEditedProfile({ ...originalProfile })
                        setIsEditing(false)
                      }}
                          fullWidth
                              variant="outlined"
                          sx={{
                            color: '#fff',
                            borderColor: '#fff2',
                            '&:hover': { borderColor: '#fff', bgcolor: '#fff1' },
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                              disabled={creatorLoading}
                    >
                      Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <>
                        <Button
                      onClick={() => logout()}
                          variant="outlined"
                          sx={{ color: '#fff', borderColor: '#fff2', '&:hover': { borderColor: '#fff', bgcolor: '#fff1' }, minWidth: 120 }}
                    >
                      Logout
                        </Button>
                        <Button
                          onClick={handleEditProfile}
                          variant="contained"
                          sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' }, color: '#fff', fontWeight: 600, minWidth: 140 }}
                          startIcon={<Edit2 style={{ width: 20, height: 20 }} />}
                          disabled={!originalProfile}
                        >
                      Edit Profile
                        </Button>
                        {editedProfile.user.role === 'USER' && (
                          <Button
                            onClick={handleOpenCreatorModal}
                            variant="contained"
                            sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' }, color: '#fff', fontWeight: 600, minWidth: 180 }}
                            startIcon={<Plus style={{ width: 20, height: 20 }} />}
                          >
                        Become Creator
                          </Button>
                    )}
                  </>
                )}
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Fade>

        {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              mb: 4,
              bgcolor: 'rgba(124,58,237,0.10)',
              borderRadius: 2,
              width: '100%',
              '& .MuiTab-root': {
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                minHeight: 48,
                transition: 'color 0.2s',
              },
              '& .Mui-selected': {
                color: '#a78bfa',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#a78bfa',
                height: 4,
                borderRadius: 2,
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={<><FileText style={{ width: 20, height: 20, marginRight: 8, color: activeTab === 'posts' ? '#a78bfa' : '#fff' }} />Posts</>} value="posts" />
            <Tab label={<><Video style={{ width: 20, height: 20, marginRight: 8, color: activeTab === 'videos' ? '#a78bfa' : '#fff' }} />Videos</>} value="videos" />
            <Tab label={<><Film style={{ width: 20, height: 20, marginRight: 8, color: activeTab === 'reels' ? '#a78bfa' : '#fff' }} />Reels</>} value="reels" />
            <Tab label={<><History style={{ width: 20, height: 20, marginRight: 8, color: activeTab === 'history' ? '#a78bfa' : '#fff' }} />History</>} value="history" />
            <Tab label={<><Settings style={{ width: 20, height: 20, marginRight: 8, color: activeTab === 'settings' ? '#a78bfa' : '#fff' }} />Settings</>} value="settings" />
          </Tabs>

          <Fade in>
            <Box
              bgcolor="rgba(255,255,255,0.15)"
              borderRadius={4}
              p={4}
              boxShadow={2}
              border="1.5px solid rgba(124,58,237,0.13)"
              sx={{
                backdropFilter: 'blur(16px)',
                width: '100%',
                maxWidth: 900,
                mx: 'auto',
                mt: 3,
              }}
            >
          {activeTab === 'posts' && (
                <Typography variant="h6" fontWeight={700} mb={2}>Your Posts</Typography>
          )}
          {activeTab === 'videos' && (
                <Typography variant="h6" fontWeight={700} mb={2}>Your Videos</Typography>
          )}
          {activeTab === 'reels' && (
                <Typography variant="h6" fontWeight={700} mb={2}>Your Reels</Typography>
          )}
          {activeTab === 'history' && (
                <Typography variant="h6" fontWeight={700} mb={2}>Content History</Typography>
              )}
          {activeTab === 'settings' && (
                <Box display="flex" flexDirection="column" gap={3}>
                  {!isEditing && (
                    <>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={600} mb={1} color="#fff">Email Verification</Typography>
                      <Typography variant="body2" color="#fff9" mb={1}>
                        {editedProfile.user.isVerified ? 'Your email is verified' : 'Please verify your email address'}
                      </Typography>
                      {!editedProfile.user.isVerified && (
                        <Button size="small" sx={{ color: '#7C3AED' }}>Resend verification email</Button>
                      )}
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={600} mb={1} color="#fff">Account Role</Typography>
                      <Typography variant="body2" color="#fff9" mb={1}>
                        Current role: <span style={{ color: '#7C3AED' }}>{editedProfile.user.role}</span>
                      </Typography>
                      {editedProfile.user.role === 'USER' && (
                        <Button
                              onClick={handleOpenCreatorModal}
                          size="small"
                          sx={{ color: '#7C3AED' }}
                    >
                      Upgrade to Creator
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={600} mb={1} color="#fff">Privacy Settings</Typography>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <input
                            type="checkbox"
                            checked={editedProfile.profile.preferences.isPublic}
                            onChange={e => handlePreferenceChange('isPublic', e.target.checked)}
                          />
                          <Typography variant="body2" color="#fff9">Make profile public</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <input
                            type="checkbox"
                            checked={editedProfile.profile.preferences.showEmail}
                            onChange={e => handlePreferenceChange('showEmail', e.target.checked)}
                          />
                          <Typography variant="body2" color="#fff9">Show email to followers</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={600} mb={1} color="#fff">Notification Settings</Typography>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <input
                            type="checkbox"
                            checked={editedProfile.profile.preferences.notifications.email}
                            onChange={e => handleNotificationChange('email', e.target.checked)}
                          />
                          <Typography variant="body2" color="#fff9">Email notifications</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <input
                            type="checkbox"
                            checked={editedProfile.profile.preferences.notifications.push}
                            onChange={e => handleNotificationChange('push', e.target.checked)}
                          />
                          <Typography variant="body2" color="#fff9">Push notifications</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={600} mb={1} color="#ef4444">Danger Zone</Typography>
                      <Button
                        onClick={() => logout()}
                        size="small"
                        sx={{ color: '#ef4444' }}
                      >
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      </Fade>

      {isEditing && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
            zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            }}
          >
            <Box
              sx={{
              width: '100%',
              maxWidth: 400,
              bgcolor: '#18181b',
                borderRadius: 4,
              p: 4,
              position: 'relative',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Close Button */}
            <Button
              onClick={() => {
                if (originalProfile) setEditedProfile({ ...originalProfile })
                setIsEditing(false)
              }}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: '#fff',
                minWidth: 0,
                p: 1,
              }}
            >
              <X size={20} />
            </Button>
            {/* Title */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, textAlign: 'center', color: '#fff' }}>
              Edit Profile
            </Typography>
            <Box component="form" onSubmit={handleSaveProfile} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Avatar Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={editedProfile.profile.avatar || ''}
                    alt={editedProfile.user.username}
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: 40,
                      bgcolor: '#7C3AED',
                      border: '2px solid #fff',
                      boxShadow: '0 2px 12px #7C3AED44',
                    }}
                  >
                    {editedProfile.user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  {isEditing && (
                    <>
                      <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      position: 'absolute',
                          bottom: 8,
                          right: 8,
                          width: 36,
                          height: 36,
                      borderRadius: '50%',
                          bgcolor: 'rgba(24,24,27,0.7)',
                      color: '#fff',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px #0004',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 0,
                          zIndex: 2,
                          transition: 'background 0.2s',
                          '&:hover': { bgcolor: '#7C3AED' },
                        }}
                      >
                        <Edit2 size={18} />
                      </IconButton>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                    </>
                  )}
                </Box>
              </Box>
              {/* Form Fields */}
              <TextField
                label="Username"
                name="username"
                value={editedProfile.user.username}
                onChange={handleInputChange}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                value={editedProfile.user.email}
                onChange={handleInputChange}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
              />
              <TextField
                label="Bio"
                name="profile.bio"
                value={editedProfile.profile.bio}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
              />
              <TextField
                label="Location"
                name="profile.location"
                value={editedProfile.profile.location}
                onChange={handleInputChange}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
              />
              <Typography sx={{ color: '#fff', mt: 1, mb: 0.5, fontWeight: 600, fontSize: 15 }}>Social Links</Typography>
              <TextField
                label="Twitter"
                value={editedProfile.profile.socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
              />
              <TextField
                label="Instagram"
                value={editedProfile.profile.socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
                placeholder="Instagram"
              />
              <TextField
                label="YouTube"
                value={editedProfile.profile.socialLinks.youtube}
                onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
                placeholder="YouTube"
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#7C3AED',
                    '&:hover': { bgcolor: '#6D28D9' },
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                  disabled={creatorLoading}
                  endIcon={creatorLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {creatorLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    if (originalProfile) setEditedProfile({ ...originalProfile })
                    setIsEditing(false)
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    color: '#fff',
                    borderColor: '#fff2',
                    '&:hover': { borderColor: '#fff', bgcolor: '#fff1' },
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                  disabled={creatorLoading}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {showCreatorModal && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box
            sx={{
                width: '100%',
                maxWidth: 400,
              bgcolor: '#18181b',
              borderRadius: 4,
              p: 4,
                position: 'relative',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
            {/* Close Button */}
              <Button
                onClick={() => setShowCreatorModal(false)}
              sx={{ position: 'absolute', top: 16, right: 16, minWidth: 0, p: 1, color: '#fff' }}
              >
              <X size={20} />
              </Button>
            {/* Title */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, textAlign: 'center', color: '#fff' }}>
                Become a Creator
              </Typography>
            <Box component="form" onSubmit={handleCreatorRequestSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Why do you want to become a creator?"
                  name="reason"
                  value={creatorForm.reason}
                  onChange={handleCreatorFormChange}
                  required
                  fullWidth
                  multiline
                  minRows={2}
                size="small"
                  InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#a78bfa' },
                      '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Portfolio URL"
                  name="portfolio"
                    value={creatorForm.portfolio.startsWith('http') ? creatorForm.portfolio : ''}
                    onChange={e => {
                      const value = e.target.value;
                      setCreatorForm(prev => ({ ...prev, portfolio: value }));
                    }}
                  fullWidth
                    size="small"
                  InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: '#a78bfa' },
                      '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                      },
                    }}
                    placeholder="Paste your portfolio URL"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <Box sx={{ flex: 1, height: 1, bgcolor: '#333', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#a78bfa', fontWeight: 600 }}>or</Typography>
                    <Box sx={{ flex: 1, height: 1, bgcolor: '#333', ml: 1 }} />
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ color: '#fff', borderColor: '#a78bfa', '&:hover': { borderColor: '#7C3AED', bgcolor: '#a78bfa11' }, fontWeight: 600, borderRadius: 2 }}
                  >
                    Upload File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif,.zip,.rar,.7z"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          setCreatorForm(prev => ({ ...prev, portfolio: file.name }));
                        }
                      }}
                    />
                  </Button>
                  {creatorForm.portfolio && !creatorForm.portfolio.startsWith('http') && (
                    <Typography variant="body2" sx={{ color: '#a78bfa' }}>{creatorForm.portfolio}</Typography>
                  )}
                </Box>
                <div>
                  <label className="block text-sm mb-1 text-white">YouTube</label>
                <TextField
                  label="YouTube"
                  name="youtube"
                  value={creatorForm.youtube}
                  onChange={handleCreatorFormChange}
                  fullWidth
                    size="small"
                  InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: '#a78bfa' },
                      '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                    },
                  }}
                    placeholder="YouTube"
                />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-white">Instagram</label>
                <TextField
                  label="Instagram"
                  name="instagram"
                  value={creatorForm.instagram}
                  onChange={handleCreatorFormChange}
                  fullWidth
                    size="small"
                  InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: '#a78bfa' },
                      '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                    },
                  }}
                    placeholder="Instagram"
                />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-white">Twitter</label>
                <TextField
                  label="Twitter"
                  name="twitter"
                  value={creatorForm.twitter}
                  onChange={handleCreatorFormChange}
                  fullWidth
                    size="small"
                  InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: '#a78bfa' },
                      '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                    },
                  }}
                    placeholder="Twitter"
                />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-white">Website</label>
                <TextField
                  label="Website"
                  name="website"
                  value={creatorForm.website}
                  onChange={handleCreatorFormChange}
                  fullWidth
                    size="small"
                  InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: '#a78bfa' },
                      '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                    },
                  }}
                    placeholder="Website"
                />
                </div>
                {creatorError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {creatorError}
                  </Alert>
                )}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#7C3AED',
                    '&:hover': { bgcolor: '#6D28D9' },
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                  disabled={creatorLoading}
                  endIcon={creatorLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {creatorLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button
                  onClick={() => setShowCreatorModal(false)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    color: '#fff',
                    borderColor: '#fff2',
                    '&:hover': { borderColor: '#fff', bgcolor: '#fff1' },
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                  disabled={creatorLoading}
                >
                  Cancel
                </Button>
            </Box>
          </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

// Loading component
function ProfileLoading() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ color: '#7C3AED' }} />
    </Box>
  )
}

// Main page component with Suspense boundary
export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  )
} 