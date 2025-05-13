/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/videos/VideoCard";
import { useMediaApi } from '@/hooks/useMediaApi';
import { Box, Container, Typography, CircularProgress } from '@mui/material';

interface Video {
  id: string;
  thumbnailId: string;
  mediaFileId: string;
  title: string;
  description: string;
  category: string;
  mediaType: 'video' | 'reel';
  userId: string;
  views: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
  mediaFileUrl: string;
}

const VideosPage = () => {
  const { fetchMedia, isLoading, error } = useMediaApi();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetchMedia({
          page: 1,
          limit: 12,
          sortBy: 'createdAt:desc',
          status: 'approved',
          mediaType: 'video'
        });
        setVideos(response.results || []);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      }
    };
    loadVideos();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#18181b', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        {/* Header */}
        <Box sx={{ py: { xs: 6, md: 10 }, background: 'linear-gradient(135deg, #1E293B 0%, #7C3AED 100%)' }}>
          <Container maxWidth="md">
            <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 2, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                Videos
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}>
                Watch and enjoy our collection of long-form video content
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Videos Grid */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#7C3AED' }} />
                <Typography sx={{ mt: 2, color: '#A78BFA' }}>Loading videos...</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#EF4444', fontWeight: 600 }}>Error loading videos: {error}</Typography>
              </Box>
            ) : videos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography>No videos found</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                  justifyContent: 'flex-start',
                }}
              >
                {videos.map(video => (
                  <Box
                    key={video.id}
                    sx={{
                      width: { xs: '100%', sm: '48%', md: '31%', lg: '23%' },
                      minWidth: 220,
                      maxWidth: 340,
                      flexGrow: 1,
                      display: 'flex',
                    }}
                  >
                    <VideoCard
                      id={video.id}
                      thumbnail={video.thumbnailUrl}
                      title={video.title}
                      description={video.description}
                      duration="0:00"
                      views={video.views}
                      likes={0}
                      comments={0}
                      category={video.category}
                      author={video.userId}
                      mediaFileUrl={video.mediaFileUrl}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default VideosPage; 