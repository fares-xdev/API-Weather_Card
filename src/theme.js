// src/theme.js
import { createTheme } from '@mui/material/styles';
import '@fontsource/ibm-plex-sans-arabic';

const theme = createTheme({
  typography: {
    fontFamily: 'IBM Plex Sans Arabic, sans-serif',
  },
});

export default theme;