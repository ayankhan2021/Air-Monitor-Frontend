// src/components/AirQualityStats.js
import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const StatCard = ({ title, value, increase, description, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'temperature':
        return <ThermostatIcon sx={{ fontSize: 40, color: '#FF9800' }} />;
      case 'humidity':
        return <OpacityIcon sx={{ fontSize: 40, color: '#2196F3' }} />;
      case 'dust':
        return <AirIcon sx={{ fontSize: 40, color: '#9E9E9E' }} />;
      case 'up':
        return <ArrowUpwardIcon sx={{ fontSize: 40, color: '#4CAF50' }} />;
      case 'down':
        return <ArrowDownwardIcon sx={{ fontSize: 40, color: '#F44336' }} />;
      default:
        return null;
    }
  };

  const increaseColor = increase?.startsWith('+') ? 'success.main' : 'error.main';

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box display="flex" alignItems="center" mb={1}>
        {getIcon()}
        <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {typeof value === 'number' ? value.toFixed(1) : 'N/A'}
      </Typography>
      <Typography variant="body2" color={increaseColor}>
        {increase}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

const AirQualityStats = ({ stats }) => {
  if (!stats) {
    return <Typography>No stats available</Typography>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>Current Air Quality</Typography>
      <Grid container spacing={2}>
        {/* Temperature Stats */}
        {stats.temperature && stats.temperature.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={`temp-${index}`}>
            <StatCard {...stat} />
          </Grid>
        ))}
        
        {/* Humidity Stats */}
        {stats.humidity && stats.humidity.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={`hum-${index}`}>
            <StatCard {...stat} />
          </Grid>
        ))}
        
        {/* Dust Stats */}
        {stats.dust && stats.dust.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={`dust-${index}`}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AirQualityStats;