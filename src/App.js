// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Container, AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import Dashboard from './components/Dashboard';
import MonthlyAverages from './components/MonthlyAverages';
import LocationSettings from './components/LocationSettings';
import FirmwareUpload from './components/FirmwareUpload';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Air Monitoring System
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Dashboard" />
            <Tab label="Monthly Trends" />
            <Tab label="Location Settings" />
            <Tab label="Firmware Update" />
          </Tabs>
        </Box>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {tabValue === 0 && <Dashboard />}
          {tabValue === 1 && <MonthlyAverages />}
          {tabValue === 2 && <LocationSettings />}
          {tabValue === 3 && <FirmwareUpload />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;