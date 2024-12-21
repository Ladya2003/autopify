import React from 'react';
import Slider from 'react-slick';
import { Box, CardMedia, IconButton } from '@mui/material';
import { Car } from '../../types/car';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CarSlider = ({ car }: { car: Car }) => {
  const settings = {
    dots: true, // Индикаторы под слайдером
    infinite: true, // Зацикливает слайдер
    speed: 500, // Скорость смены слайда
    slidesToShow: 1, // Количество видимых слайдов
    slidesToScroll: 1, // Количество слайдов при пролистывании
    arrows: true, // Кнопки навигации
    prevArrow: <CustomArrow direction="left" />, // Кастомная кнопка "Назад"
    nextArrow: <CustomArrow direction="right" />, // Кастомная кнопка "Вперед"
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Slider {...settings}>
        {car.images?.map((image, idx) => (
          <CardMedia
            key={idx}
            component="img"
            height="250"
            image={
              image?.startsWith('http')
                ? image
                : `http://localhost:3000/assets/images/${image
                    .split('\\')
                    .pop()}`
            }
            alt={`${car.brand} ${car.model}`}
            sx={{ marginBottom: 2, borderRadius: 2 }}
          />
        ))}
      </Slider>
    </Box>
  );
};

// Кастомная кнопка для навигации
const CustomArrow = ({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick?: () => void;
}) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      [direction === 'left' ? 'left' : 'right']: '10px',
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    }}
  >
    {direction === 'left' ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
  </IconButton>
);

export default CarSlider;
