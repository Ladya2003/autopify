import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Button,
  Avatar,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import carService from '../../../services/api/carService';
import testDriveService from '../../../services/api/testDriveService';
import commentService from '../../../services/api/commentService';
import { Car, FuelType, TransmissionType } from '../../../types/car';
import Header from '../../../components/layout/Header';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarSlider from '../../../components/slider/CarSlider';
import theme from '../../../config/theme';
import { DEFAULT_AVATAR, UserType } from '../../../types/user';
import { TestDriveStatus } from '../../../types/test-drive';
import dayjs from 'dayjs';
import authService from '../../../services/api/authService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommentType } from '../../../types/comment';

// TODO: на этой странице нужно еще доделать комментарии, и не забыть реализовать одобрение отклонение тест драйвов на странице продавца
const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [testDriveComment, setTestDriveComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<UserType | null>(null);
  const navigator = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const commentsPerPage = 5; // Количество комментариев на странице

  useEffect(() => {
    if (id) {
      carService.fetchCar(id).then(setCar);
      commentService.fetchComments(id).then(setComments);
    }
  }, [id]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    setDisplayedComments(comments.slice(startIndex, endIndex));
  }, [currentPage, comments]);

  const handleTestDriveRequest = async () => {
    if (!selectedDate) return;
    await testDriveService
      .createTestDrive({
        carId: id!,
        status: TestDriveStatus.Pending,
        description: testDriveComment,
        testDriveDatetime: new Date(selectedDate).toISOString(),
      })
      .then(() => {
        alert(
          'Заявка отправлена успешно! Ожидайте одобрения/отклонения от прадавца!',
        );
        window.location.reload();
      });
    setTestDriveModalOpen(false);
    setSelectedDate(null);
    setTestDriveComment('');
  };

  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const createdComment = await commentService.createComment(id!, {
        text: newComment,
        status: CommentType.Car,
      });
      setComments([createdComment, ...comments]); // Используем ответ от сервера
      setNewComment(''); // Сбрасываем текст нового комментария
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const token = localStorage.getItem('access_token');

  const fetchUser = async () => {
    const user = await authService.fetchUserRole();
    setUser(user);
  };

  const handleDelete = async () => {
    try {
      if (car?._id)
        await carService
          .deleteCar(car?._id)
          .then(() => alert('Публикация успешно удалена'));
      setIsDeleteModalOpen(false);
      navigator('/');
    } catch (error) {
      console.error('Ошибка при удалении машины:', error);
      alert('Не удалось удалить публикацию. Попробуйте позже.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  console.log('car', car);

  if (!car) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  console.log('displayedComments', displayedComments);
  return (
    <>
      {/* TODO: добавить назад в хедер */}
      <Header
        action={{}}
        title={`${car?.brand} ${car?.model} (${car?.year}г)`}
        shouldDisplayLogin
      >
        <Box sx={{ padding: 4, position: 'relative' }}>
          {car && (
            <>
              {user?.id === car?.seller?.id && (
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <IconButton
                    onClick={() => navigator(`/cars/edit/${car._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setIsDeleteModalOpen(true)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  {(car.images?.length ?? 0) > 1 ? (
                    <CarSlider car={car} />
                  ) : (
                    <CardMedia
                      component="img"
                      height="300"
                      image={
                        car?.images?.[0]?.startsWith('http')
                          ? car?.images?.[0]
                          : `http://localhost:3000/assets/images/${car?.images?.[0]
                              .split('\\')
                              .pop()}`
                      }
                      alt={`${car.brand} ${car.model}`}
                      sx={{ marginBottom: 2, borderRadius: 2 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Car details */}
                  <Box>
                    <Typography variant="h6">Характеристики</Typography>
                    <Typography>Двигатель: {car.engineSize} л</Typography>
                    <Typography>
                      Коробка:{' '}
                      {car.transmission === Object.keys(TransmissionType)[0]
                        ? TransmissionType.Automatic
                        : TransmissionType.Manual}
                    </Typography>
                    <Typography>
                      Тип топлива:{' '}
                      {car.fuelType === Object.keys(FuelType)[0]
                        ? FuelType.Petrol
                        : FuelType.Diesel}
                    </Typography>
                    <Typography>Пробег: {car.mileage} км</Typography>
                    <Typography>Цена: {car.price} $</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6">Описание</Typography>

              <Typography>{car.description}</Typography>

              {/* Seller Info */}
              <Box mt={4}>
                <Typography variant="h6">Продавец</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={car.seller?.profilePicture || DEFAULT_AVATAR} />
                  <Box>
                    <Typography>
                      Почта: {car?.seller?.email || 'test@gmail.com'}
                    </Typography>
                    <Typography>
                      Имя: {car?.seller?.nickname || 'Аноним'}
                    </Typography>
                    <Button
                      variant="outlined"
                      // TODO: make this component
                      href={`/sellers/${car.sellerId}`}
                    >
                      Перейти к профилю
                    </Button>
                  </Box>
                </Box>
              </Box>
              {/* Test Drive Dates */}
              {car.testDriveAvailability.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6">
                    Доступные даты для тест-драйва
                  </Typography>
                  <Grid container spacing={2}>
                    {car.testDriveAvailability.map((date, idx) => (
                      <Grid item key={idx}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedDate(date);
                            user
                              ? setTestDriveModalOpen(true)
                              : alert(
                                  'Зарегистрируйтесь, чтобы подавать заявку на тест-драйв!',
                                );
                          }}
                        >
                          {new Date(date).toLocaleDateString()}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* TODO: добавить инфу о заявках на тест-драйв */}

              {/* Comments */}
              <Box mt={4}>
                <Typography variant="h6">Комментарии</Typography>

                {/* New comment */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
                  <TextField
                    fullWidth
                    placeholder="Добавить комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' &&
                      (user
                        ? handleAddComment()
                        : alert(
                            'Зарегистрируйтесь, чтобы оставлять комментарии!',
                          ))
                    }
                  />

                  <Button
                    variant="contained"
                    onClick={() => {
                      user
                        ? handleAddComment()
                        : alert(
                            'Зарегистрируйтесь, чтобы оставлять комментарии!',
                          );
                    }}
                  >
                    Добавить
                  </Button>
                </Box>

                <List>
                  {/* TODO: добавить дату коммента */}
                  {displayedComments &&
                    displayedComments.map((comment, idx) => (
                      <ListItem key={idx}>
                        <ListItemAvatar>
                          {/* <Avatar
                            src={
                              comment.author?.profilePicture || DEFAULT_AVATAR
                            }
                          /> */}
                          <CardMedia
                            component="img"
                            image={
                              comment.author?.profilePicture
                                ? comment.author?.profilePicture?.startsWith(
                                    'http',
                                  )
                                  ? comment.author?.profilePicture
                                  : `http://localhost:3000/assets/images/${comment.author?.profilePicture
                                      ?.split('\\')
                                      .pop()}`
                                : DEFAULT_AVATAR
                            }
                            alt={`${car.brand} ${car.model}`}
                            sx={{
                              marginBottom: 2,
                              borderRadius: '100%',
                              aspectRatio: 1,
                              width: '40px',
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            comment.author?.nickname || comment.author?.email
                          }
                          secondary={comment.text}
                        />
                      </ListItem>
                    ))}
                </List>
                {displayedComments.length > 0 && (
                  <Pagination
                    count={Math.ceil(comments.length / commentsPerPage)}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Header>

      {/* Test Drive Modal */}
      <Modal
        open={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            padding: 4,
            backgroundColor: 'white',
            margin: 'auto',
            borderRadius: 2,
            minWidth: 700,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => setTestDriveModalOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon sx={{ color: theme.palette.customColors.black }} />
          </IconButton>

          <Typography variant="h6">Запись на тест-драйв</Typography>
          <Typography>
            {new Date(selectedDate!).toLocaleDateString()}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Комментарий"
            value={testDriveComment}
            onChange={(e) => setTestDriveComment(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleTestDriveRequest}
            sx={{ marginTop: 2 }}
          >
            Отправить
          </Button>
        </Box>
      </Modal>

      {/* Модалка удаления */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 300,
          }}
        >
          <Typography>Вы точно хотите удалить эту публикацию?</Typography>
          <Box
            sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button onClick={() => setIsDeleteModalOpen(false)}>Отмена</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Да
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CarDetailsPage;