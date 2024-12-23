import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Grid,
  CardMedia,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import carService from '../../services/api/carService';
import { useNavigate, useParams } from 'react-router-dom';
import { UserType } from '../../types/user';
import Header from '../../components/layout/Header';

const TransmissionType = {
  Automatic: 'Автомат',
  Manual: 'Ручная',
} as const;

type TransmissionType = keyof typeof TransmissionType;

const FuelType = {
  Petrol: 'Бензин',
  Diesel: 'Дизель',
} as const;

type FuelType = keyof typeof FuelType;

const carSchema = z.object({
  brand: z.string().trim().min(1, 'Марка автомобиля обязательна'),
  model: z.string().trim().min(1, 'Модель автомобиля обязательна'),
  year: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Год должен быть положительным числом',
    ),
  transmission: z
    .enum(['Automatic', 'Manual'])
    .refine((value) => value !== undefined, {
      message: 'Выберите тип трансмиссии',
    }),
  engineSize: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Объем двигателя должен быть положительным числом',
    ),
  fuelType: z
    .enum(['Petrol', 'Diesel'])
    .refine((value) => value !== undefined, {
      message: 'Выберите тип топлива',
    }),
  mileage: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Пробег должен быть положительным числом',
    ),
  price: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Цена должна быть положительным числом',
    ),
  description: z.string().trim().min(1, 'Описание обязательно'),
  images: z
    .union([
      z.instanceof(FileList).optional(),
      z.array(z.string()).optional(), // Для строковых значений (URL)
    ])
    .refine(
      (value) =>
        (value instanceof FileList && value.length > 0) || // Проверка FileList
        (Array.isArray(value) && value.length > 0), // Проверка массива строк
      'Загрузите хотя бы одно изображение',
    ),
  testDriveAvailability: z.array(z.string().trim()),
});

type CarFormData = z.infer<typeof carSchema>;

interface CreateOrEditCarProps {
  carId?: string;
  user: UserType | null;
}

// TODO-на будущее-будущее: добавить два поля: место и время тест-драйва (можно забить)
// TODO: не работает изменение авто
// Проверить что вся валидация рабоатет
const CreateOrEditCar: React.FC<CreateOrEditCarProps> = ({
  carId: paramCarId,
  user,
}) => {
  const { carId } = useParams<{ carId: string }>();
  const [previews, setPreviews] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: 'Audi',
      model: 'A7',
      year: `${new Date().getFullYear()}`,
      transmission: 'Automatic',
      engineSize: '1.5',
      fuelType: 'Petrol',
      mileage: '250000',
      price: '10000',
      description: 'Very cool car',
      images: undefined,
      testDriveAvailability: [],
    },
  });

  useEffect(() => {
    if (carId) {
      (async () => {
        const carData = await carService.fetchCar(carId);
        reset({
          ...carData,
          year: carData.year.toString(),
          engineSize: carData.engineSize.toString(),
          mileage: carData.mileage.toString(),
          price: carData.price.toString(),
          testDriveAvailability: carData.testDriveAvailability.map(
            (date: string) => new Date(date).toISOString(),
          ),
          images: carData.images,
        });

        setPreviews(carData.images);
      })();
    }
  }, [carId, reset]);

  const onSubmit = async (data: CarFormData) => {
    try {
      const formData = new FormData();

      // Преобразование данных для числовых и других полей
      const payload = {
        ...data,
        year: Number(data.year),
        engineSize: Number(data.engineSize),
        mileage: Number(data.mileage),
        price: Number(data.price),
        testDriveAvailability: data.testDriveAvailability.map((date) =>
          new Date(date).toISOString(),
        ),
      };

      // Добавляем текстовые данные в FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== 'images') {
          if (Array.isArray(value)) {
            // Если значение — массив
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Добавляем файлы
      if (data.images) {
        Array.from(data.images as FileList).forEach((file) => {
          formData.append('images', file);
        });
      }

      if (carId) {
        console.log('Update Data:', formData);
        await carService
          .updateCar(carId, formData)
          .then(() => alert('Объявление обновлено!'));
        navigate('/');
      } else {
        await carService
          .createCar(formData)
          .then(() => alert('Заявка на создание объявления отправлена!'));
        navigate('/');
      }
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Произошла ошибка при сохранении.');
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void,
  ) => {
    const files = event.target.files;
    if (files) {
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setPreviews(previewUrls); // Устанавливаем превью изображений
      onChange(files); // Передаем файлы в контроллер формы
    }
  };

  console.log(
    'previews',
    `http://localhost:3000/assets/images/${previews[0]?.split('\\').pop()}`,
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Header
        title={carId ? 'Редактировать объявление' : 'Создать новое объявление'}
        action={{
          actionTitle: 'Создать объявление',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography variant="h5" mb={2}>
            {carId ? 'Редактировать объявление' : 'Создать новое объявление'}
          </Typography>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Марка автомобиля"
                fullWidth
                error={!!errors.brand}
                helperText={errors.brand?.message}
              />
            )}
          />
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Модель автомобиля"
                fullWidth
                error={!!errors.model}
                helperText={errors.model?.message}
              />
            )}
          />
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Год выпуска"
                views={['year']} // Ограничиваем выбор только годами
                value={field.value ? dayjs(String(field.value)) : null} // Преобразуем значение для DatePicker
                onChange={(date) => field.onChange(date?.year().toString())} // Сохраняем только год
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.year,
                    helperText: errors.year?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="transmission"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Трансмиссия</InputLabel>
                <Select {...field} label="Трансмиссия">
                  {Object.entries(TransmissionType).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="engineSize"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Объем двигателя"
                type="number"
                fullWidth
                error={!!errors.engineSize}
                helperText={errors.engineSize?.message}
              />
            )}
          />
          <Controller
            name="fuelType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Тип топлива</InputLabel>
                <Select {...field} label="Тип топлива">
                  {Object.entries(FuelType).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="mileage"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Пробег"
                type="number"
                fullWidth
                error={!!errors.mileage}
                helperText={errors.mileage?.message}
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Цена ($)"
                type="number"
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Описание"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          {/* TODO-на будущее-будущее: сделать еще инпут для загрузки фото через инет и сделать так чтобы можно было Редактировать определенные фото а не все сразу, */}
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <div>
                {/* Предварительный просмотр изображений */}
                {previews.length > 0 && (
                  <Box
                    style={{
                      marginBottom: '1rem',
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    {previews.map((preview, index) =>
                      carId ? (
                        <CardMedia
                          key={index}
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            marginRight: '0.5rem',
                            borderRadius: '8px',
                          }}
                          component="img"
                          height="140"
                          image={
                            preview?.startsWith('http')
                              ? preview
                              : `http://localhost:3000/assets/images/${preview
                                  ?.split('\\')
                                  .pop()}`
                          }
                          alt={`${preview}`}
                        />
                      ) : (
                        <img
                          src={preview}
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            marginRight: '0.5rem',
                            borderRadius: '8px',
                          }}
                          key={preview}
                          alt={preview}
                        />
                      ),
                    )}
                  </Box>
                )}

                {/* Кнопка загрузки */}
                <Button variant="contained" component="label">
                  Загрузить изображения
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(event) =>
                      handleFileChange(event, field.onChange)
                    }
                  />
                </Button>

                {errors.images?.message && (
                  <Typography color="red">{errors.images?.message}</Typography>
                )}
              </div>
            )}
          />
          {/* TODO: make this abligatary */}
          {/* TODO: посмотреть чтобы корректно работало при изменении самой публикации. изменять статусы на canceld для тех что создатель убрал при редактировании */}
          <Controller
            name="testDriveAvailability"
            control={control}
            render={({ field }) => {
              const handleAddDate = () => {
                field.onChange([...(field.value || []), null]); // Добавить новую дату
              };

              const handleRemoveDate = (index: number) => {
                const newDates = [...(field.value || [])];
                newDates.splice(index, 1);
                field.onChange(newDates); // Удалить выбранную дату
              };

              const handleDateChange = (
                index: number,
                date: dayjs.Dayjs | null,
              ) => {
                const newDates = [...(field.value || [])];

                if (date && date.isValid()) {
                  newDates[index] = date.toISOString();
                } else {
                  newDates[index] = dayjs().toISOString(); // Сбрасываем некорректную дату
                }

                field.onChange(newDates); // Обновить дату по индексу
              };

              return (
                <div>
                  <label>Доступные даты для тест-драйва</label>
                  <Grid container spacing={2}>
                    {(field.value || []).map((date: string, index: number) => (
                      <Grid item xs={12} md={6} key={index}>
                        <DatePicker
                          label={`Date ${index + 1}`}
                          value={date ? dayjs(date) : null}
                          onChange={(date) => handleDateChange(index, date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.testDriveAvailability,
                              helperText: errors.testDriveAvailability?.message,
                            },
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleRemoveDate(index)}
                          style={{ marginTop: 8 }}
                        >
                          Удалить дату
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddDate}
                    style={{ marginTop: 16 }}
                  >
                    Добавить дату
                  </Button>
                </div>
              );
            }}
          />
          <Button type="submit" variant="contained">
            {carId ? 'Сохранить изменения' : 'Создать'}
          </Button>
        </Box>
      </Header>
    </LocalizationProvider>
  );
};

export default CreateOrEditCar;
