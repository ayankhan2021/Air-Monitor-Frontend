// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, CircularProgress } from '@mui/material';
import AirQualityStats from './AirQualityStats';
import HistoricalChart from './HistoricalChart';
import { Typography } from '@mui/material';
import { fetchAirDataStats, fetchHalfHourlyData } from '../api/airMonitoring';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, historicalResponse] = await Promise.all([
          fetchAirDataStats(),
          fetchHalfHourlyData()
        ]);
        
        setStats(statsResponse.data.data);
        setHistoricalData(historicalResponse.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Air Quality Stats Section */}
        <Grid item xs={12}>
          <AirQualityStats stats={stats} />
        </Grid>
        
        {/* Historical Chart Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <HistoricalChart data={historicalData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;