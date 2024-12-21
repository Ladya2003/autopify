import React, { ReactNode, useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Modal,
  useTheme,
  alpha,
  SxProps,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Login from '../auth/Login';
import Register from '../auth/Register';
import CloseIcon from '@mui/icons-material/Close';
import authService from '../../services/api/authService';
import { UserType } from '../../types/user';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({
  title,
  action: { actionTitle = 'Создать объявление', onCreate },
  children,
  shouldDisplayLogin,
  sx,
}: {
  title: string;
  action: { onCreate?: () => void; actionTitle?: string };
  children: ReactNode;
  shouldDisplayLogin?: boolean;
  sx?: SxProps;
}) => {
  const theme = useTheme();

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const token = localStorage.getItem('access_token');

  const fetchUser = async () => {
    const user = await authService.fetchUserRole();
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleRegisterOpen = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const changeRegisterToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleRegisterClose = () => setRegisterOpen(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null); // Очистка состояния пользователя
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          marginBottom: 3,
          backgroundColor: theme.palette.customColors.white,
          boxShadow: `0 3px 4px 0 ${alpha(
            theme.palette.customColors.black,
            0.07,
          )}`,
        }}
      >
        <Toolbar sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
            {title}
          </Typography>
          {actionTitle && onCreate && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={onCreate}
              sx={{ backgroundColor: theme.palette.customColors.green }}
            >
              {actionTitle}
            </Button>
          )}
          {shouldDisplayLogin &&
            (!user ? (
              <IconButton color="inherit" onClick={handleLoginOpen}>
                <AccountCircleIcon
                  sx={{ color: theme.palette.primary.main, fontSize: '2.5rem' }}
                />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{ color: theme.palette.primary.main }}
              >
                <LogoutIcon />
              </IconButton>
            ))}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          m: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.customColors.white,
          ...sx,
        }}
      >
        {children}
      </Box>

      <Modal open={isLoginOpen} onClose={handleLoginClose}>
        <Box
          sx={{
            padding: 4,
            maxWidth: 400,
            margin: 'auto',
            mt: 8,
            bgcolor: 'white',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleLoginClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon sx={{ color: theme.palette.customColors.black }} />
          </IconButton>

          <Login handleLogin={handleLoginClose} />

          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Еще нет аккаунта?{' '}
            <Button onClick={handleRegisterOpen} color="primary">
              Зарегистрируйся
            </Button>
          </Typography>
        </Box>
      </Modal>

      <Modal open={isRegisterOpen} onClose={handleRegisterClose}>
        <Box
          sx={{
            padding: 4,
            maxWidth: 400,
            margin: 'auto',
            mt: 8,
            bgcolor: 'white',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleRegisterClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon sx={{ color: theme.palette.customColors.black }} />
          </IconButton>

          <Register handleRegister={handleRegisterClose} />

          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Уже есть аккаунт?{' '}
            <Button onClick={changeRegisterToLogin} color="primary">
              Войти
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Header;
