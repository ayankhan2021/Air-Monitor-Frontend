import axios from 'axios';

const API_URL = 'https://air-monitor-backend.vercel.app/api';

export const fetchAirData = () => {
  return axios.get(`${API_URL}/get-air-data`);
};

export const fetchAirDataStats = () => {
  return axios.get(`${API_URL}/get-stat-data`);
};

export const fetchHalfHourlyData = () => {
  return axios.get(`${API_URL}/get-data-last-hour`);
};

export const fetchMonthlyAverages = (year, type) => {
  return axios.get(`${API_URL}/get-monthly-averages?year=${year}&type=${type}`);
};

export const saveLocation = (locationData) => {
  return axios.post(`${API_URL}/save-sensor-location`, locationData);
};

export const uploadFirmware = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/upload-bin-file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const addAirData = (airData) => {
  return axios.post(`${API_URL}/add-air-data`, airData);
};