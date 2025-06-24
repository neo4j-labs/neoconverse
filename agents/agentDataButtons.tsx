import React, { useRef } from 'react';
import { downloadAgentData, uploadAgentData } from './localAgents';
import Button from '@mui/material/Button';
import { CloudDownload, CloudUpload } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AgentDataButtons = () => {
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAgentData(file);
      alert('Agent data imported successfully');
      // Optionally refresh your component or page
      window.location.reload();
    } catch (error) {
      alert(`Error importing data: ${error.message}`);
    }

    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 1,
      mt: 1, // Add margin top to create vertical separation
      borderTop: '1px solid #eaeaea', // Optional: adds a subtle divider
      pt: 1, // Add padding top
      justifyContent: 'flex-start' // Align buttons to the left
    }}>
      <Button
        sx={{
          color:"#606060",
          fontSize: '0.85rem' // Slightly smaller font size
        }}
        variant="text"
        size="small" // Use small size for more compact buttons
        startIcon={<CloudDownload color="#606060" />}
        onClick={downloadAgentData}
      >
        Download
      </Button>

      <Button
        sx={{
          color:"#606060",
          fontSize: '0.85rem' // Slightly smaller font size
        }}
        variant="text"
        size="small" // Use small size for more compact buttons
        startIcon={<CloudUpload color="#606060" />}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept=".json"
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default AgentDataButtons;