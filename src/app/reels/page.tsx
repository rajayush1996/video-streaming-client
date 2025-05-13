/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';
import { Film } from 'lucide-react';
import ReelCard from '@/components/reels/ReelCard';
import { useReelsApi } from '@/hooks/useReelsApi';

interface Reel {
  _id: string;
  id: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  category: string;
  admin?: string;
}

export default function ReelsPage() {
  const { fetchReels, isLoading, error } = useReelsApi();
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    const loadReels = async () => {
      const result = await fetchReels();
      setReels(result.results);
    };
    loadReels();
  }, []);

  if (isLoading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#18181b"
      >
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minHeight="100vh"
        bgcolor="#18181b"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Film size={48} color="#A78BFA" style={{ marginBottom: 16 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
              Error Loading Reels
            </Typography>
            <Typography color="rgba(255,255,255,0.7)" sx={{ fontFamily: 'Inter, sans-serif' }}>
              {error}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#18181b" color="white" sx={{ mt: 8 }}>
      {/* Header */}
      <Box
        py={{ xs: 6, md: 8 }}
        textAlign="center"
        sx={{
          background: 'linear-gradient(135deg, #18181b 0%, #7c3aed 100%)',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #fff 0%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(124,58,237,0.2)'
            }}
          >
            Trending Reels
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6
            }}
          >
            Discover the latest and most popular reels from our community
          </Typography>
        </Container>
      </Box>

      {/* Reels Grid */}
      <Box py={{ xs: 6, md: 8 }}>
        <Container maxWidth="lg">
          {reels.length === 0 ? (
            <Box 
              textAlign="center" 
              py={8} 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                No reels available
              </Typography>
              <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>Check back later for new content!</Typography>
            </Box>
          ) : (
            <Grid container component="div" spacing={3}>
              {reels.map((reel: Reel) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={reel.id}>
                  <ReelCard
                    id={reel.id}
                    thumbnail={reel.thumbnailUrl}
                    title={reel.title}
                    description={reel.description}
                    category={reel.category}
                    author={reel.admin || 'Anonymous'}
                    views={0}
                    duration="0:00"
                    likes={0}
                    comments={0}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}
