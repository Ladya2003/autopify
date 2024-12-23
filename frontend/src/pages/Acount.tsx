import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CardMedia,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { AuthRole, UserType } from '../types/user';
import sellerService from '../services/api/sellerService';
import Header from '../components/layout/Header';
import userService from '../services/api/userService';
import testDriveService from '../services/api/testDriveService';
import { TestDrive, TestDriveStatus } from '../types/test-drive';
import theme from '../config/theme';
import { parseAvatarURL } from '../services/utils/utils';

const AccountPage = ({ user }: { user: UserType }) => {
  const [name, setName] = useState(user.nickname || '');
  const [description, setDescription] = useState(user.description || '');
  const [avatarUrl, setAvatarUrl] = useState(user.profilePicture || '');
  const [avatarFile, setAvatarFile] = useState<File | Blob>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);

  const handleSubmitRequest = async () => {
    try {
      setIsSubmitting(true);
      await sellerService
        .createRequest()
        .then(() => alert('Заявка отправлена успешно!'));
    } catch (error: any) {
      // alert(error.response.data.message || 'Error submitting request');
      alert('Ваша заявка обрабатывается!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nickname', name);
      formData.append('description', description);

      if (avatarFile) {
        formData.append('profilePicture', avatarFile);
      }

      await userService
        .updateUser(formData)
        .then(() => alert('Профиль обновлен успешно!'));
    } catch (error: any) {
      alert(error.response.data.message || 'Error updating profile');
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl); // Устанавливаем превью изображений
      onChange(file); // Передаем файлы в контроллер формы
    }
  };

  useEffect(() => {
    setAvatarUrl(user.profilePicture);
    if (user?.id) {
      testDriveService.fetchTestDrivesByUserId(user.id).then(setTestDrives);
    }
  }, [user]);

  const parsedAvatarURL = parseAvatarURL(avatarUrl);

  return (
    <Header action={{}} title={`Настройка аккаунта`} shouldDisplayLogin>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Хотите продавать собственные авто?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitRequest}
          disabled={
            user.role === AuthRole.Seller ||
            // user.role === AuthRole.Admin ||
            isSubmitting
          }
        >
          Отправь заявку чтобы стать Продавцом
        </Button>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Редактировать профиль
          </Typography>
          <TextField
            fullWidth
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Почта"
            value={user.email}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            Редактировать изображение профиля
          </Typography>
          {/* FIXED: сохранение аватара через файл не работает. можно временно сделать сохранение через ссылку в нете и забить */}
          <Box sx={{ mb: 1 }}>
            <CardMedia
              style={{
                width: '200px',
                // maxHeight: '200px',
                marginRight: '0.5rem',
                aspectRatio: 1,
                borderRadius: '100%',
              }}
              component="img"
              // height="140"
              image={parsedAvatarURL}
              alt={parsedAvatarURL}
            />
          </Box>
          {/* Кнопка загрузки */}
          <Button variant="contained" component="label" sx={{ mr: 1 }}>
            Загрузить изображения
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => handleFileChange(event, setAvatarFile)}
            />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleProfileUpdate}
          >
            Сохранить изменения
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" pt={4}>
        Ваши заявки на тест-драйвы
      </Typography>
      {testDrives.length === 0 ? (
        <Typography color={theme.palette.customColors.secondaryText}>
          Заявок пока нету
        </Typography>
      ) : (
        testDrives?.map((test, index) => (
          <Grid container wrap="wrap" rowSpacing={2} py={2}>
            <Grid item xs={2}>
              {test.car?.brand}
            </Grid>
            <Grid item xs={2}>
              {test.car?.model}
            </Grid>
            <Grid item xs={2}>
              {test.car?.year}
            </Grid>
            <Grid item xs={2}>
              {test.car?.price}
            </Grid>
            <Grid item xs={2}>
              {test.testDriveDatetime}
            </Grid>
            <Grid
              item
              container
              xs={2}
              direction="row"
              gap={2}
              alignItems="center"
            >
              {test.status === TestDriveStatus.Accepted ? (
                <Grid item color="green">
                  Одобрено
                </Grid>
              ) : test.status === TestDriveStatus.Rejected ? (
                <Grid item color="red">
                  Отказано
                </Grid>
              ) : (
                <Grid item color={theme.palette.customColors.secondaryText}>
                  На рассмотрении
                </Grid>
              )}
            </Grid>
          </Grid>
        ))
      )}
    </Header>
  );
};

export default AccountPage;
