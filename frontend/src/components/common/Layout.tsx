import { Outlet } from 'react-router-dom';
import Footer from '@/components/common/Footer';
import AppAppBar from '../header/AppHeader';
import { PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
// import getLPTheme from '@/theme';
import './Layout.css';

const Layout = () => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const defaultTheme = createTheme({ palette: { mode } });
  // const LPtheme = createTheme(getLPTheme(mode));

  return (
    <div id="page-container">
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <div id="content-wrap">
          <Outlet />
        </div>
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default Layout;
