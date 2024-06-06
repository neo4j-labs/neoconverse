import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, IconButton, Grid, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon } from '@mui/icons-material';
import { Tool, Property } from '../../lib/type';
import { cypher } from "@codemirror/legacy-modes/mode/cypher";
import { StreamLanguage } from "@codemirror/language";
import CodeMirror from '@uiw/react-codemirror';


interface ToolsProps {
  toolsData: Tool[];
  onToolsChange: (tools: Tool[]) => void;
}

const ToolForm: React.FC<{ tool: Tool; index: number; onChange: (index: number, tool: Tool) => void; onRemove: (index: number) => void; onClose: () => void }> = ({ tool, index, onChange, onRemove, onClose }) => {
  const [newProperty, setNewProperty] = useState<Property>({ name: '', type: '', description: '' });

  const handleChange = (field: keyof Tool, value: any) => {
    const updatedTool = { ...tool, [field]: value };
    onChange(index, updatedTool);
  };

  const handlePropertyChange = (propName: string, field: 'type' | 'description', value: any) => {
    const updatedProperties = { ...tool.parameters.properties, [propName]: { ...tool.parameters.properties[propName], [field]: value } };
    const updatedTool = { ...tool, parameters: { ...tool.parameters, properties: updatedProperties } };
    onChange(index, updatedTool);
  };

  const handleAddProperty = () => {
    if (newProperty.name && !tool.parameters.properties[newProperty.name]) {
      const updatedProperties = { ...tool.parameters.properties, [newProperty.name]: { type: newProperty.type, description: newProperty.description } };
      const updatedTool = { ...tool, parameters: { ...tool.parameters, properties: updatedProperties } };
      onChange(index, updatedTool);
      setNewProperty({ name: '', type: '', description: '' });
    }
  };

  const handleRemoveProperty = (propName: string) => {
    const { [propName]: _, ...updatedProperties } = tool.parameters.properties;
    const updatedTool = { ...tool, parameters: { ...tool.parameters, properties: updatedProperties } };
    onChange(index, updatedTool);
  };

  const handleRequiredChange = (value: string) => {
    const requiredFields = value.split(',').map((field) => field.trim());
    const updatedTool = { ...tool, parameters: { ...tool.parameters, required: requiredFields } };
    onChange(index, updatedTool);
  };

  const handleRequiredSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const updatedTool = { ...tool, parameters: { ...tool.parameters, required: value as string[] } };
    onChange(index, updatedTool);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Tool</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={tool.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={tool.description}
          onChange={(e) => handleChange('description', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Parameters Type"
          value={tool.parameters.type}
          onChange={(e) => handleChange('parameters', { ...tool.parameters, type: e.target.value })}
          fullWidth
          margin="normal"
        />
        {Object.keys(tool.parameters.properties).map((propName) => (
          <Box key={propName} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Property Name"
              value={propName}
              disabled
              fullWidth
            />
            <TextField
              label="Property Type"
              value={tool.parameters.properties[propName].type}
              onChange={(e) => handlePropertyChange(propName, 'type', e.target.value)}
              fullWidth
            />
            <TextField
              label="Property Description"
              value={tool.parameters.properties[propName].description}
              onChange={(e) => handlePropertyChange(propName, 'description', e.target.value)}
              fullWidth
            />
            <IconButton onClick={() => handleRemoveProperty(propName)}>
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
          <TextField
            label="New Property Name"
            value={newProperty.name}
            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="New Property Type"
            value={newProperty.type}
            onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
            fullWidth
          />
          <TextField
            label="New Property Description"
            value={newProperty.description}
            onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
            fullWidth
          />
          <IconButton onClick={handleAddProperty}>
            <AddIcon />
          </IconButton>
        </Box>
        <TextField
          label="Required Fields"
          select
          SelectProps={{ multiple: true }}
          value={tool.parameters.required}
          onChange={handleRequiredSelectChange}
          fullWidth
          margin="normal"
        >
          {Object.keys(tool.parameters.properties).map((propName) => (
            <MenuItem key={propName} value={propName}>
              {propName}
            </MenuItem>
          ))}
        </TextField>
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={tool.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            label="Category"
          >
            <MenuItem value="Cypher Execution">Cypher Execution</MenuItem>
            <MenuItem value="API Call">API Call</MenuItem>
          </Select>
        </FormControl>
        {tool.category === 'Cypher Execution' && (
          <CodeMirror
          value={tool.categorical_input || ''}
          extensions={[StreamLanguage.define(cypher)]}
          onChange={(editor, data, value) => {
            handleChange('categorical_input', editor);
          }}
      />
        )}
        {tool.category === 'API Call' && (
            <TextField
            label="API endpoint"
            value={tool.categorical_input || ''}
            fullWidth
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Tools: React.FC<ToolsProps> = ({ toolsData, onToolsChange }) => {
  const [tools, setTools] = useState<Tool[]>(toolsData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setTools(toolsData);
  }, [toolsData]);

  const handleAddTool = () => {
    setTools([
      ...tools,
      {
        name: '',
        description: '',
        category: '',
        cypherQuery: '',
        parameters: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ]);
    setEditingIndex(tools.length);
  };

  const handleToolChange = (index: number, updatedTool: Tool) => {
    const updatedTools = tools.map((tool, i) => (i === index ? updatedTool : tool));
    setTools(updatedTools);
    onToolsChange(updatedTools);
  };

  const handleToolRemove = (index: number) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    setTools(updatedTools);
    onToolsChange(updatedTools);
  };

  const handleSave = () => {
    onToolsChange(tools);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setTools(toolsData);
    setEditingIndex(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Function Calling Tools
      </Typography>
      <Grid container spacing={2}>
        {tools?.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">{tool.name}</Typography>
              <Typography variant="body2">{tool.description}</Typography>
              <Typography variant="body2">Category: {tool.category}</Typography>
              {tool.category === 'Cypher Execution' && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>Cypher Query: {tool.cypherQuery}</Typography>
              )}
              <Button variant="contained" color="primary" onClick={() => setEditingIndex(index)} startIcon={<EditIcon />} sx={{ marginTop: 2 }}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleToolRemove(index)} sx={{ marginTop: 2, marginLeft: 2 }}>
                Remove
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" onClick={handleAddTool}>
          Add Tool
        </Button>
      </Box>
      {editingIndex !== null && (
        <ToolForm
          tool={tools[editingIndex]}
          index={editingIndex}
          onChange={handleToolChange}
          onRemove={handleToolRemove}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </Container>
  );
};

export default Tools;
