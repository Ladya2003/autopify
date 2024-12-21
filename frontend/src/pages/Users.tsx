import { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { AuthRole, UserType } from '../types/user';
import Header from '../components/layout/Header';
import userService from '../services/api/userService';

const UsersPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(true);

  const fetchData = async () => {
    setIsSubmitting(true);

    try {
      const users = await userService.fetchUsers();

      setUsers(users);
    } catch (error) {
      alert(`Ошибка получения пользователей: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isSubmitting) {
    return (
      <Header title="Пользователи" action={{}} shouldDisplayLogin>
        Loading...
      </Header>
    );
  }

  return (
    <>
      <Header title="Пользователи" action={{}} shouldDisplayLogin>
        <Grid container direction="column">
          {users.map((user) => (
            <User {...user} fetchData={fetchData} />
          ))}
        </Grid>
      </Header>
    </>
  );
};

const User = ({ _id, email, role, hasRequest, fetchData }: any) => {
  const updateData = async (data: any) => {
    try {
      await userService.updateUserByID(_id, data);

      fetchData();
    } catch (error) {
      alert(`Ошибка при обновлении пользователя: ${error}`);
    }
  };

  const handleRejectClick = async () =>
    updateData({
      sellerRequestStatus: 'rejected',
    });

  const handleAcceptClick = async () =>
    updateData({
      sellerRequestStatus: 'accepted',
    });

  const handleDisableClick = async () =>
    updateData({
      role: 'disabled',
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
      <Grid item xs={4}>
        {email}
      </Grid>
      <Grid item xs={4}>
        {role}
      </Grid>
      <Grid
        item
        container
        xs={4}
        direction="column"
        gap={1}
        alignItems="center"
      >
        {hasRequest && role === AuthRole.User && (
          <Grid item container xs="auto" gap={1}>
            <Grid item>
              <Button color="success" onClick={handleAcceptClick}>
                Одобрить заявку
              </Button>
            </Grid>
            <Grid item>
              <Button color="secondary" onClick={handleRejectClick}>
                Отклонить заявку
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleDisableClick}
            disabled={role === AuthRole.Disabled}
          >
            Заблокировать
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UsersPage;
