import React, { useEffect } from 'react';
import { Button, TextField, MenuItem, Grid, Paper, Typography } from '@mui/material';
import { Stack } from '@mui/system';

const protocolOptions = ['neo4j', 'neo4j+s', 'bolt', 'bolt+s'];
const aiOptions = ['Open AI', 'Google Vertex AI', 'AWS Bedrock'];

const defaultSettings = {
  protocol: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  aiService: '',
  openAIKey: '',
  googleAPIKey: '',
  awsAccessKeyId: '',
  awsSecretAccessKey: '',
};

const SettingsComponent = () => {
  const [settings, setSettings] = React.useState({ ...defaultSettings });

  useEffect(() => {
    const storedSettings = localStorage.getItem('Configurations');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const handleChange = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('Configurations', JSON.stringify(settings));
    console.log(settings);
    // Here you would usually handle your form submission (e.g., API call)
  };

  const handleCancel = () => {
    // Reset settings or handle cancel
  };

  const renderAISpecificFields = () => {
    switch (settings.aiService) {
      case 'Open AI':
        return (
        <Grid item xs={12}>
          <TextField label="OpenAI Key" name="openAIKey" value={settings.openAIKey} onChange={handleChange} fullWidth />
        </Grid>
        );
      case 'Google Vertex AI':
        return (
        <Grid item xs={12}>
          <TextField label="Google API Key" name="googleAPIKey" value={settings.googleAPIKey} onChange={handleChange} fullWidth />
          </Grid>
        );
      case 'AWS Bedrock':
        return (
        <Grid item xs={12}>
            <Stack direction = "row" spacing={2}>
                <TextField label="AWS_ACCESS_KEY_ID" name="awsAccessKeyId" value={settings.awsAccessKeyId} onChange={handleChange} fullWidth />
                <TextField label="AWS_SECRET_ACCESS_KEY" name="awsSecretAccessKey" type="password" value={settings.awsSecretAccessKey} onChange={handleChange} fullWidth />
            </Stack>
        </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Paper style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>Settings</Typography>
      <form onSubmit={handleSubmit}>
        {/* Database Configuration */}
        <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Database Configuration</Typography>
        <Grid container spacing={3}>
        <Grid item xs={3}>
            <TextField select label="Protocol" name="protocol" value={settings.protocol} onChange={handleChange} fullWidth>
              {protocolOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Host" name="host" value={settings.host} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Port" name="port" value={settings.port} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Database (optional)" name="database" value={settings.database} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Username" name="username" value={settings.username} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Password" name="password" type="password" value={settings.password} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>

        {/* AI API Configuration */}
        <Typography variant="subtitle1" style={{ margin: '20px 0' }}>Gen AI API Configuration</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              label="AI Service"
              name="aiService"
              value={settings.aiService}
              onChange={handleChange}
              fullWidth
            >
              {aiOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {renderAISpecificFields()}
        </Grid>

        {/* Buttons */}
        <Grid container spacing={3} style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
            Submit
          </Button>
          <Button variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </form>
    </Paper>
  );
};

export default SettingsComponent;
