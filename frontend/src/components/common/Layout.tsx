import { Outlet } from 'react-router-dom';
import Footer from '@/components/common/Footer';
import AppAppBar from '../header/AppHeader';
import { PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
// import getLPTheme from '@/theme';

const Layout = () => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const defaultTheme = createTheme({ palette: { mode } });
  // const LPtheme = createTheme(getLPTheme(mode));

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Outlet />
      <Footer />
      </ThemeProvider>
    </>
  );
};

export default Layout;
