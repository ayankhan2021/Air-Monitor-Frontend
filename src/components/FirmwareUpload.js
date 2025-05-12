import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Paper, Alert, LinearProgress, 
  TextField, Divider, Card, CardContent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
    setFile(selectedFile);
    setUploadStatus(null);
  };

  const checkFirmwareStatus = async () => {
    setChecking(true);
    try {
      const response = await axios.get("https://air-monitor-backend.vercel.app/api/firmware-info");
      console.log("Firmware info response:", response.data);
      setFirmwareInfo(response.data.data);
    } catch (error) {
      console.error("Error checking firmware status:", error);
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
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    if (targetChipId.trim()) {
      formData.append('targetChipId', targetChipId.trim());
    }
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 300);
      
      const response = await uploadFirmware(formData);
      console.log("Upload response:", response.data);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus({
        severity: 'success',
        message: 'Firmware uploaded successfully!'
      });
      
      await checkFirmwareStatus();
    } catch (error) {
      console.error("Error uploading firmware:", error);
      setUploadStatus({
        severity: 'error',
        message: `Upload failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    checkFirmwareStatus();
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Firmware Upload</Typography>
        
        <Box sx={{ my: 3 }}>
          <input
            accept=".bin,.ino.bin"
            style={{ display: 'none' }}
            id="firmware-file-input"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="firmware-file-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Select Firmware File
            </Button>
          </label>
          
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
          )}
        </Box>
        
        <TextField
          label="Target Chip ID (Optional)"
          variant="outlined"
          value={targetChipId}
          onChange={(e) => setTargetChipId(e.target.value)}
          fullWidth
          margin="normal"
          helperText="Leave empty to target all devices"
          disabled={uploading}
        />
        
        <Box sx={{ my: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Firmware'}
          </Button>
        </Box>
        
        {uploading && (
          <Box sx={{ my: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {uploadProgress}%
            </Typography>
          </Box>
        )}
        
        {uploadStatus && (
          <Alert severity={uploadStatus.severity} sx={{ mt: 2 }}>
            {uploadStatus.message}
          </Alert>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>Current Firmware</Typography>
        
        {checking ? (
          <LinearProgress />
        ) : firmwareInfo ? (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">
                Filename: {firmwareInfo.filename}
              </Typography>
              <Typography variant="body2">
                Size: {(firmwareInfo.size / 1024).toFixed(2)} KB
              </Typography>
              <Typography variant="body2">
                Uploaded: {new Date(firmwareInfo.uploadDate).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">No firmware currently available</Alert>
        )}
      </Paper>
      
      {/* Direct upload form for testing */}
      <Paper sx={{ p: 3, backgroundColor: '#2d2d2d' }}>
        <Typography variant="h6" gutterBottom>Direct Upload Form (For Troubleshooting)</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If the regular upload isn't working, use this simple form to diagnose the issue.
        </Typography>
        
        <form 
          action="https://air-monitor-backend.vercel.app/api/upload-bin-file"
          method="post" 
          encType="multipart/form-data" 
          target="_blank"
        >
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              name="file"
              accept=".bin,.ino.bin"
            />
          </Box>
          <Button 
            type="submit" 
            variant="contained" 
            color="warning"
          >
            Direct Upload Test
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default FirmwareUpload;