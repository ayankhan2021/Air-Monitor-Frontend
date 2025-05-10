// src/components/MonthlyAverages.js
import React, { useState, useEffect } from 'react';
import { fetchMonthlyAverages } from '../api/airMonitoring';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAverages = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const years = [2023, 2024, 2025];
  const metrics = [
    { value: 'temperature', label: 'Temperature (°C)' },
    { value: 'humidity', label: 'Humidity (%)' },
    { value: 'dust', label: 'Dust (μg/m³)' }
  ];

  useEffect(() => {
    const getMonthlyData = async () => {
      setLoading(true);
      try {
        const response = await fetchMonthlyAverages(selectedYear, selectedMetric);
        const monthlyData = response.data.data.monthlyAverages;
        
        const labels = monthlyData.map(item => item.month);
        const values = monthlyData.map(item => item[selectedMetric]);
        
        let color;
        switch (selectedMetric) {
          case 'temperature':
            color = '#FF9800';
            break;
          case 'humidity':
            color = '#2196F3';
            break;
          case 'dust':
            color = '#9E9E9E';
            break;
          default:
            color = '#4CAF50';
        }

        setChartData({
          labels,
          datasets: [
            {
              label: metrics.find(m => m.value === selectedMetric).label,
              data: values,
              backgroundColor: color,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching monthly data:', error);
      } finally {
        setLoading(false);
      }
    };

    getMonthlyData();
  }, [selectedYear, selectedMetric]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Average ${metrics.find(m => m.value === selectedMetric).label} for ${selectedYear}`,
      },
    },
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Monthly Trends</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Metric</InputLabel>
            <Select
              value={selectedMetric}
              label="Metric"
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {metrics.map(metric => (
                <MenuItem key={metric.value} value={metric.value}>{metric.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ height: 500, position: 'relative' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Typography align="center">No data available</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default MonthlyAverages;