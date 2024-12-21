import { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { AuthRole, UserType } from '../types/user';
import Header from '../components/layout/Header';
import userService from '../services/api/userService';
import carService from '../services/api/carService';
import { Car } from '../types/car';

const PublishRequestsPage = () => {
  const [requests, setRequests] = useState<Car[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(true);

  const hasRequests = requests.length > 0;

  const fetchData = async () => {
    setIsSubmitting(true);

    try {
      const users = await carService.fetchCars({ status: 'pending' });

      setRequests(users);
    } catch (error) {
      alert(`Ошибка получения публикаций: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isSubmitting) {
    return (
      <Header title="Заявки на публикацию" action={{}} shouldDisplayLogin>
        Loading...
      </Header>
    );
  }

  return (
    <>
      <Header title="Заявки на публикацию" action={{}} shouldDisplayLogin>
        <Grid container direction="column">
          {hasRequests
            ? requests.map((request) => (
                <PublishRequest {...request} fetchData={fetchData} />
              ))
            : 'Заявки на публикацию отсутствуют'}
        </Grid>
      </Header>
    </>
  );
};

const PublishRequest = ({ _id, brand, model, year, price, fetchData }: any) => {
  const updateData = async (data: any) => {
    try {
      await carService.updateCar(_id, data);

      fetchData();
    } catch (error) {
      alert(`Ошибка при обновлении публикации: ${error}`);
    }
  };

  const handleRejectClick = async () =>
    updateData({
      status: 'rejected',
    });

  const handleAcceptClick = async () =>
    updateData({
      status: 'accepted',
    });

  return (
    <Grid
      container
      wrap="nowrap"
      py={2}
      rowSpacing={2}
      sx={{
        borderBottom: '1px solid gray',

        '&:last-of-type': {
          borderBottom: 'none',
        },
      }}
    >
      <Grid item xs={2}>
        {brand}
      </Grid>
      <Grid item xs={2}>
        {model}
      </Grid>
      <Grid item xs={2}>
        {year}
      </Grid>
      <Grid item xs={2}>
        {price}
      </Grid>
      <Grid
        item
        container
        xs={4}
        direction="column"
        gap={1}
        alignItems="center"
      >
        <Grid item container xs="auto" gap={1}>
          <Grid item>
            <Button color="success" onClick={handleAcceptClick}>
              Одобрить публикацию
            </Button>
          </Grid>
          <Grid item>
            <Button color="secondary" onClick={handleRejectClick}>
              Отклонить публикацию
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PublishRequestsPage;
