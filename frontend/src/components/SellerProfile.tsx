import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Button, CircularProgress, Alert } from '@mui/material';
import sellerService from '../services/api/sellerService';

const SellerProfile = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<null | { name: string; avatar: string; rating: number; description: string }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await sellerService.getSellerById(sellerId!);
        setSeller(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load seller information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSeller();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!seller) {
    return (
      <Box p={3}>
        <Typography variant="body1">Seller not found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} textAlign="center">
      <Avatar 
        src={seller.avatar} 
        alt={seller.name} 
        sx={{ width: 100, height: 100, margin: '0 auto' }} 
      />
      <Typography variant="h4" gutterBottom>
        {seller.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Rating: {seller.rating.toFixed(1)}
      </Typography>
      <Typography variant="body1" paragraph>
        {seller.description}
      </Typography>
      <Button variant="contained" color="primary">
        Contact Seller
      </Button>
    </Box>
  );
};

export default SellerProfile;
