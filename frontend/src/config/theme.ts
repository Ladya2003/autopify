import { createTheme } from '@mui/material/styles';

// Расширение палитры (если используется кастомизация)
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    customColors: {
      green: string;
      orange: string;
      purple: string;
      white: string;
      black: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      green?: string;
      orange?: string;
      purple?: string;
      white: string;
      black: string;
    };
  }
}

// Создание темы
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Основной цвет
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff616f',
      dark: '#9a0036',
    },
    customColors: {
      green: '#33b249',
      orange: '#ff9800',
      purple: '#9c27b0',
      white: '#FFF',
      black: '#000',
    },
  },
});

export default theme;
