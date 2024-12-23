import React, { useEffect, useState } from 'react';
import CarFilter from '../components/CarFilter';
import CarCard from '../components/CarCard';
import { Grid, CircularProgress, Box } from '@mui/material';
import carService from '../services/api/carService';
import { Car } from '../types/car';
import { AuthRole, UserType } from '../types/user';
import Header from '../components/layout/Header';
import authService from '../services/api/authService';
import { useNavigate } from 'react-router-dom';

const Cars = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const handleFilter = async (filters?: Record<string, any>) => {
    try {
      setLoading(true);
      const data = await carService.fetchCars({
        ...filters,
        status: 'accepted',
      });
      setCars(data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      alert('An error occurred while fetching cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRole = async () => {
    const user = await authService.fetchUserRole();
    setUser(user);
  };

  useEffect(() => {
    handleFilter();
    fetchRole();
  }, []);

  const handleCreateCar = () => {
    if (user?.role === AuthRole.Admin || user?.role === AuthRole.Seller) {
      navigate('/cars/new');
    } else {
      alert('Станьте Продавцом, чтобы создавать свои объявления!');
    }
  };

  const handleEditCar = (carId: string) => {
    if (user?.role === AuthRole.Admin || user?.role === AuthRole.Seller) {
      navigate(`/cars/edit/${carId}`);
    } else {
      alert('У вас нет прав для редактирования объявлений!');
    }
  };

  return (
    <>
      <Header
        title="Поиск всех автомобилей"
        action={{
          actionTitle: 'Создать объявление',
          onCreate: handleCreateCar,
        }}
        shouldDisplayLogin
      >
        <CarFilter onFilter={handleFilter} />
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {cars?.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <CarCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
      </Header>
    </>
  );
};

export default Cars;
