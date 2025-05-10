// src/components/FirmwareUpload.js
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  LinearProgress,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { uploadFirmware } from '../api/airMonitoring';

const FirmwareUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.bin')) {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      setFile(null);
      setUploadStatus({
        severity: 'error',
        message: 'Please select a valid .bin firmware file'
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      const simulateProgress = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(simulateProgress);
            return 95;
          }
          return prevProgress + 5;
        });
      }, 300);

      await uploadFirmware(file);
      
      clearInterval(simulateProgress);
      setUploadProgress(100);
      setUploadStatus({
        severity: 'success',
        message: 'Firmware uploaded successfully!'
      });
    } catch (error) {
      console.error('Error uploading firmware:', error);
      setUploadStatus({
        severity: 'error',
        message: 'Failed to upload firmware. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/firmware`, '_blank');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Firmware Management</Typography>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Upload New Firmware</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload a new firmware file (.bin) to update your air monitoring sensors.
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <input
            accept=".bin"
            style={{ display: 'none' }}
            id="firmware-upload"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="firmware-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Select Firmware File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </Typography>
          )}
        </Box>
        
        {uploading && (
          <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              Uploading: {uploadProgress}%
            </Typography>
          </Box>
        )}
        
        {uploadStatus && (
          <Alert severity={uploadStatus.severity} sx={{ mt: 2, mb: 2 }}>
            {uploadStatus.message}
          </Alert>
        )}
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ mt: 1 }}
        >
          Upload Firmware
        </Button>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Stack spacing={2}>
        <Typography variant="h6">Download Latest Firmware</Typography>
        <Typography variant="body2" color="text.secondary">
          Download the latest firmware file for manual installation or backup.
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download Firmware
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FirmwareUpload;