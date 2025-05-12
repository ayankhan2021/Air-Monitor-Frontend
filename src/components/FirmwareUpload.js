import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  LinearProgress,
  Alert,
  Stack,
  Divider,
  TextField,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { uploadFirmware } from '../api/airMonitoring';
import axios from 'axios';

const FirmwareUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [firmwareInfo, setFirmwareInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [targetChipId, setTargetChipId] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.bin') || selectedFile.name.endsWith('.ino.bin'))) {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      setFile(null);
      setUploadStatus({
        severity: 'error',
        message: 'Please select a valid firmware file (.bin or .ino.bin)'
      });
    }
  };

  const checkFirmwareStatus = async () => {
    setChecking(true);
    try {
      const response = await axios.get("https://air-monitor-backend.vercel.app/api/firmware-info");
      setFirmwareInfo(response.data.data);
    } catch (error) {
      console.error('Error checking firmware status:', error);
      setFirmwareInfo(null);
    } finally {
      setChecking(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    // Create form data with the file and optional chip ID target
    const formData = new FormData();
    formData.append('file', file);
    if (targetChipId.trim()) {
      formData.append('targetChipId', targetChipId.trim());
    }

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

      await uploadFirmware(formData);
      
      clearInterval(simulateProgress);
      setUploadProgress(100);
      setUploadStatus({
        severity: 'success',
        message: 'Firmware uploaded successfully!'
      });

      // Refresh firmware info after upload
      await checkFirmwareStatus();
    } catch (error) {
      console.error('Error uploading firmware:', error);
      setUploadStatus({
        severity: 'error',
        message: `Upload failed: ${error.response?.data?.message || 'Please try again.'}`
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    window.open(`${process.env.REACT_APP_API_URL || 'https://air-monitor-backend.vercel.app'}/api/firmware`, '_blank');
  };

  // Check firmware status on component mount
  React.useEffect(() => {
    checkFirmwareStatus();
  }, []);

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
            accept=".bin,.ino.bin"
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

        <TextField
          label="Target Chip ID (Optional)"
          variant="outlined"
          fullWidth
          value={targetChipId}
          onChange={(e) => setTargetChipId(e.target.value)}
          placeholder="Leave blank to target all devices"
          disabled={uploading}
          margin="normal"
          helperText="Specify a chip ID to update a specific device only"
        />
        
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Current Firmware</Typography>
          <Button 
            size="small"
            startIcon={<RefreshIcon />}
            onClick={checkFirmwareStatus}
            disabled={checking}
          >
            Refresh
          </Button>
        </Box>
        
        {checking ? (
          <CircularProgress size={24} />
        ) : firmwareInfo ? (
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Filename:</strong> {firmwareInfo.filename}<br />
              <strong>Size:</strong> {Math.round(firmwareInfo.size / 1024)} KB<br />
              <strong>Uploaded:</strong> {new Date(firmwareInfo.uploadDate).toLocaleString()}<br />
              {firmwareInfo.targetChipId && (
                <><strong>Target Device:</strong> {firmwareInfo.targetChipId}</>
              )}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning">No firmware has been uploaded yet</Alert>
        )}
        
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!firmwareInfo}
        >
          Download Current Firmware
        </Button>
      </Stack>
    </Paper>
  );
};

export default FirmwareUpload;