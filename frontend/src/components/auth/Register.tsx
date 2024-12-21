import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Typography } from '@mui/material';
import { z } from 'zod';
import { RegistrationFormData, registrationSchema } from './validationSchemas';
import authService from '../../services/api/authService';

type Props = {
  handleRegister?: () => void;
};

const Register = ({ handleRegister }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await authService.register(data.email, data.password);
      alert('Вы успешно зарегистрировались!');
      handleRegister?.();
    } catch (error: any) {
      alert(
        'Ошибка регистрации: ' +
          (error.response?.data?.message || error.message),
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
        Регистрация
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

      <TextField
        label="Повторите Пароль"
        type="password"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button variant="contained" type="submit">
        Зарегистрироваться
      </Button>
    </Box>
  );
};

export default Register;
