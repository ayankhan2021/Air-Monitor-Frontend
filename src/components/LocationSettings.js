// src/components/LocationSettings.js
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Grid,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { saveLocation } from '../api/airMonitoring';

const LocationSettings = () => {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    regionName: '',
    lon: '',
    lat: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert longitude and latitude to numbers
      const payload = {
        ...formData,
        lon: parseFloat(formData.lon),
        lat: parseFloat(formData.lat)
      };
      
      await saveLocation(payload);
      setAlert({
        open: true,
        message: 'Sensor location saved successfully!',
        severity: 'success'
      });
      
      // Reset form after successful submission
      setFormData({
        country: '',
        city: '',
        regionName: '',
        lon: '',
        lat: ''
      });
    } catch (error) {
      console.error('Error saving location:', error);
      setAlert({
        open: true,
        message: 'Failed to save sensor location. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Sensor Location Settings</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the geographic location of your air monitoring sensor.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="regionName"
              label="Region/State Name"
              value={formData.regionName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lon"
              label="Longitude"
              value={formData.lon}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lat"
              label="Latitude"
              value={formData.lat}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
              inputProps={{ step: 'any' }}
            />
          </Grid>
        </Grid>
        
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Location'}
          </Button>
        </Box>
      </Box>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LocationSettings;