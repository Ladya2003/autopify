import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material';
import userService from '../services/api/userService';
import Header from '../components/layout/Header';

interface User {
  _id: string;
  email: string;
  nickname: string;
  profilePicture: string; // Ссылки на изображения
  description: string;
}

export const Sellers = () => {
  const [sellers, setSellers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Получаем список продавцов
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await userService.fetchSellers();
        setSellers(data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, []);

  // Обработка клика на карточку
  const handleCardClick = (id: string) => {
    navigate(`/seller/${id}`);
  };

  return (
    <Header title="Наши продавцы" action={{}} shouldDisplayLogin>
      <Box textAlign="center" p={5}>
        <Grid container spacing={4} justifyContent="flex-start">
          {sellers?.map((seller) => (
            <Grid item xs={12} sm={6} md={4} key={seller._id}>
              <Card
                sx={{ cursor: 'pointer', height: '100%' }}
                onClick={() => handleCardClick(seller._id)}
              >
                {/* Аватарка пользователя */}
                {seller.profilePicture && seller.profilePicture.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={seller.profilePicture}
                    alt={seller.nickname || 'Seller Avatar'}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="140"
                    image="/placeholder-avatar.png"
                    alt="No Avatar"
                  />
                )}
                <CardContent>
                  {/* Имя пользователя */}
                  <Typography variant="h6" noWrap>
                    {seller.nickname || 'Нет имени'}
                  </Typography>
                  {/* Почта */}
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {seller.email}
                  </Typography>
                  {/* Описание */}
                  <Typography variant="body2" color="textPrimary">
                    {seller.description
                      ? seller.description.split(' ').slice(0, 10).join(' ') +
                        '...'
                      : 'Описание отсутствует'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Header>
  );
};
