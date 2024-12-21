import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { LoginFormData, loginSchema } from './validationSchemas';
import authService from '../../services/api/authService';

type Props = {
  handleLogin?: () => void;
};

const Login = ({ handleLogin }: Props) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(
        data.email,
        data.password,
        handleLogin,
      );
      // localStorage.setItem('access_token', response.access_token);
      // navigate('/');
    } catch (error: any) {
      alert(
        'Ошибка входа: ' + (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        margin: 'auto',
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" textAlign="center">
        Вход
      </Typography>
      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Пароль"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button variant="contained" type="submit">
        Войти
      </Button>
    </Box>
  );
};

export default Login;
