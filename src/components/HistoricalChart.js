// src/components/HistoricalChart.js
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const HistoricalChart = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('all');

  const handleMetricChange = (event, newMetric) => {
    if (newMetric !== null) {
      setSelectedMetric(newMetric);
    }
  };

  if (!data || data.length === 0) {
    return <Typography>No historical data available</Typography>;
  }

  const labels = data.map(item => item.timeRange);
  
  const datasets = [];
  
  if (selectedMetric === 'all' || selectedMetric === 'temperature') {
    datasets.push({
      label: 'Temperature (°C)',
      data: data.map(item => item.temperature),
      borderColor: '#FF9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      tension: 0.3,
    });
  }
  
  if (selectedMetric === 'all' || selectedMetric === 'humidity') {
    datasets.push({
      label: 'Humidity (%)',
      data: data.map(item => item.humidity),
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      tension: 0.3,
    });
  }
  
  if (selectedMetric === 'all' || selectedMetric === 'dust') {
    datasets.push({
      label: 'Dust (μg/m³)',
      data: data.map(item => item.dust),
      borderColor: '#9E9E9E',
      backgroundColor: 'rgba(158, 158, 158, 0.1)',
      tension: 0.3,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Air Quality Data (Last 24 Hours)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Historical Data</Typography>
        <ToggleButtonGroup
          value={selectedMetric}
          exclusive
          onChange={handleMetricChange}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="temperature">Temperature</ToggleButton>
          <ToggleButton value="humidity">Humidity</ToggleButton>
          <ToggleButton value="dust">Dust</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ height: 400 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default HistoricalChart;