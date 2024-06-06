
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Input, Grid, MenuItem, Switch } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QAPairs from '../chat/qaPairs';
import { Stack } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tools from './toolsForLLM';
import { Tool, Property } from '../../lib/type'
import JsonPrettifier from '../common/JsonPrettifier';
import {ExecuteCypher} from '../../lib/middleware'
import {GET_SCHEMA_CYPHER}  from '../../lib/cypherQuery'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "80%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

type QAPair = {
  question: string;
  answer: string;
};
type Connection = {
  port: string;
  host: string;
  protocol: string;
  database: string;
  username: string;
  password: string;
}
type PromptParts = {
  dataModel: string,
  fewshot: QAPair[]
}

interface DialogData {
  title: string;
  description: string;
  key: string,
  schema: string;
  fewshot: QAPair[];
  icon: string;
  schemaDiagram: string;
  connection: Connection,
  convoConnection: Connection,
  saveConvo: boolean,
  promptParts: PromptParts,
  userDefined: boolean,
  aiService: string,
  openAIKey: string,
  openAIModel: string, 
  googleAPIKey: string,
  googleModel: string,
  awsAccessKeyId: string,
  awsSecretAccessKey: string,
  awsModel: string, 
  aimodel: string,
  toolsData: Tool[]
}

interface AgentDialogProps {
  open: boolean;
  agentData: DialogData;
  onSave: (data: DialogData) => void; // Add onSave prop
  onClose: () => void;
}

const AgentDialog: React.FC<AgentDialogProps> = ({ open, agentData, onSave, onClose }) => {
const aiOptions = ['Open AI', 'Google Vertex AI', 'AWS Bedrock'];
  const label = { inputProps: { 'aria-label': 'save conversation' } };

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
    openAIModel: '', 
    googleModel: '',
    awsModel: '',
    aimodel: ''
  
  };

  const [settings, setSettings] = React.useState({ ...defaultSettings });

  const [data, setData] = useState<DialogData>(() => {
    let emptyConnection = {
      port: '',
      host: '',
      protocol: '',
      database: '',
      username: '',
      password: ''
    };
    let initAgent = agentData ? agentData : {
        title: '',
        key: '',
        description: '',
        schema: '',
        fewshot: [],
        saveConvo: false,
        icon: '',
        userDefined: true,
        schemaDiagram: "",
        aiService: "",
        openAIKey: '',
        googleAPIKey: '',
        awsAccessKeyId: '',
        awsSecretAccessKey: '',
        openAIModel: '', 
        googleModel: '',
        awsModel: '',
        aimodel: '', 
        toolsData: []
      
    }

    initAgent.connection = (agentData?.connection) ? agentData.connection : {...emptyConnection};
    initAgent.convoConnection = (agentData?.convoConnection) ? agentData.convoConnection : {...emptyConnection};
    initAgent.promptParts = (agentData?.promptParts) ? agentData.promptParts : {
      dataModel: '',
      fewshot: []
    };
    initAgent.toolsData = (agentData?.toolsData) ? agentData.toolsData : {
      name: "",
      description: "",
      parameters: {
        type: "",
        properties: {
          "": {
            type: "",
            description: "",
          },
        },
        required: []
      }
    };

    return initAgent;
  });

  useEffect(() => {
    let dataTemp = agentData ? agentData : data;
    setData(dataTemp);
    const storedSettings = localStorage.getItem('Configurations');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    }, [agentData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleConnectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let connection = {...data.connection, [event.target.name]: event.target.value };
    if (useSameConnection) {
      setData({ ...data, connection: connection, convoConnection: connection });      
    } else {
      setData({ ...data, connection: connection });
    }
  };
const handleConvoConnectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let convoConnection = {...data.convoConnection, [event.target.name]: event.target.value };
    setData({ ...data, convoConnection: convoConnection });
  };

  const handleSave = () => {
    data.icon = "/favicon.ico";
    data.key = data.title;
    data.promptParts.dataModel = data.schema;
    data.promptParts.fewshot = data.fewshot;
    data.userDefined = true;
    onSave(data); // Call the onSave prop with the current dialog data
  };

  const renderAISpecificFields = () => {
    switch (data.aiService) {
      case 'Open AI':
        return (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <TextField label="OpenAI Key" name="openAIKey" value={data.openAIKey} onChange={handleChange} fullWidth />
              <TextField label="OpenAI model" name="openAIModel" value={data.openAIModel} onChange={handleChange} fullWidth />
            </Stack>
          </Grid>
        );
      case 'Google Vertex AI':
        return (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <TextField label="Google API Key" name="googleAPIKey" value={data.googleAPIKey} onChange={handleChange} fullWidth />
              <TextField label="Google model" name="googleModel" value={data.googleModel} onChange={handleChange} fullWidth />
            </Stack>
          </Grid>
        );
      case 'AWS Bedrock':
        return (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <TextField label="AWS_ACCESS_KEY_ID" name="awsAccessKeyId" value={data.awsAccessKeyId} onChange={handleChange} fullWidth />
              <TextField label="AWS_SECRET_ACCESS_KEY" name="awsSecretAccessKey" type="password" value={data.awsSecretAccessKey} onChange={handleChange} fullWidth />
              <TextField label="MODEL" name="awsModel" value={data.awsModel} onChange={handleChange} fullWidth />
            </Stack>
          </Grid>
        );
      default:
        return null;
    }
  };

  const [value, setValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // State to manage whether the switch is checked or not
  const [isSaveConvoOn, setIsSaveConvoOn] = useState(false);

  // Handle the switch toggle
  const handleSwitchChange = (event) => {
    setData({ ...data, saveConvo: event.target.checked });
    // setIsSaveConvoOn(event.target.checked);
  };

  // Handle the get schema button click under Schema tab
  // Todo remove hardcoded agent key
  const handleGetSchema = async (event) => {
    let result = await ExecuteCypher(true, false, data.title, GET_SCHEMA_CYPHER, {});
    setData({ ...data, schema: result.result });
  }

  // State to manage whether the switch is checked or not
  const [useSameConnection, setUseSameConnection] = useState(false);

  // Handle the switch toggle
  const handleUseSameConnectionChange = (event) => {
    setUseSameConnection(event.target.checked);
    if (event.target.checked) {
      setData({ ...data, convoConnection: data.connection });      
    }
    else {
      setData({ ...data, convoConnection: {
          port: '',
          host: '',
          protocol: '',
          database: '',
          username: '',
          password: ''
        } 
      });      
    }
  };

  const handleToolsChange = (tools: Tool[]) => {
    // setToolsData(tools);
    localStorage.setItem('tools', JSON.stringify(tools));
  };

  //console.log('data: ', data);
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: { width: "80%", maxWidth: "none" }, // Custom width here
        }}
      >
        <DialogTitle id="form-dialog-title">Agent Details</DialogTitle>
        <DialogContent>

          <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleTabChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="General" {...a11yProps(0)} />
              <Tab label="Neo4j Connection" {...a11yProps(1)} />
              <Tab label="Gen AI API" {...a11yProps(2)} />
              <Tab label="Schema" {...a11yProps(3)} />
              <Tab label="Few shot examples" {...a11yProps(4)} />
              <Tab label="Tools for LLM" {...a11yProps(5)} />

            </Tabs>

            {/* General */}
            <TabPanel value={value} index={0} >
          <TextField
            autoFocus
            margin="dense"
            sx={{ marginBottom: 2 }}
            name="title"
            label="Agent Name"
            type="text"
            fullWidth
            // inputProps={
            //   { readOnly: true, }
            // }
            value={data.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            sx={{ marginBottom: 2 }}
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={data.description}
            onChange={handleChange}
          />
          </TabPanel>

            {/* Neo4j Connection */}
            <TabPanel value={value} index={1}>
              <Stack direction="row" >
                <TextField
                  autoFocus
                  margin="dense"
                  sx={{ marginBottom: 1, marginRight: 2 }}
                  name="protocol"
                  label="Protocol"
                  type="text"
                  fullWidth
                  value={data.connection?.protocol}
                  onChange={handleConnectionChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  sx={{ marginBottom: 1, marginRight: 2 }}
                  name="host"
                  label="Hostname"
                  type="text"
                  fullWidth
                  value={data.connection?.host}
                  onChange={handleConnectionChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  sx={{ marginBottom: 1 }}
                  name="port"
                  label="Port"
                  type="text"
                  fullWidth
                  value={data.connection?.port}
                  onChange={handleConnectionChange}
                />
              </Stack>
              <TextField
                autoFocus
                margin="dense"
                sx={{ marginBottom: 1, marginRight: 2 }}
                name="database"
                label="Database(optional)"
                type="text"
                fullWidth
                value={data.connection?.database}
                onChange={handleConnectionChange}
              />
              <TextField
                autoFocus
                margin="dense"
                sx={{ marginBottom: 1, marginRight: 2 }}
                name="username"
                label="Username"
                type="text"
                fullWidth
                value={data.connection?.username}
                onChange={handleConnectionChange}
              />
              <TextField
                autoFocus
                margin="dense"
                sx={{ marginBottom: 4 }}
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={data.connection?.password}
                onChange={handleConnectionChange}
/>
            <Stack direction="row" spacing={5} justifyContent="space-between" sx={{ marginBottom: 2, marginRight: 2 }}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="h4"
                    sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 600, fontSize: 22, fontFamily: "sans-serif" }}
                  >
                    Save conversation
                  </Typography>
                  <Typography variant="body2"
                    sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 300, fontSize: 14, fontFamily: "sans-serif" }}
                  >
                    Saving conversations would help with future analytics, ranking the llm responses, building cache layers, and optimizing the future LLM responses.
                  </Typography>
                </Stack>
                <Switch
                  checked={data.saveConvo}
                  onChange={handleSwitchChange}
                  name="dynamicSwitch"
                  color="primary"
                />
              </Stack>
              {(data.saveConvo) ?
                <div>
                  <Stack direction="row" spacing={5} justifyContent="space-between" sx={{ marginBottom: 2, marginRight: 2 }}>
            <Stack direction="column" spacing={1}>
                      <Typography variant="body1"
                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 600, fontSize: 16, fontFamily: "sans-serif" }}
                      >
                        Use same database as above
                      </Typography>
                      <Typography variant="body2"
                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 300, fontSize: 14, fontFamily: "sans-serif" }}>
                        Its advised to have a seperate database for production use cases to avoid resource contention issues for the main workload
                      </Typography>
                    </Stack>
                    <Switch
                      checked={useSameConnection}
                      onChange={handleUseSameConnectionChange}
                      name="dynamicSwitch"
                      color="primary"
                    />
                  </Stack>
                  <Stack direction="row" >
                    <TextField
                      autoFocus
                      margin="dense"
                      sx={{ marginBottom: 1, marginRight: 2 }}
                      name="protocol"
                      label="Protocol"
                      type="text"
                      fullWidth
                      value={data.convoConnection?.protocol}
                      onChange={handleConvoConnectionChange}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      sx={{ marginBottom: 1, marginRight: 2 }}
                      name="host"
                      label="Hostname"
                      type="text"
                      fullWidth
                      value={data.convoConnection?.host}
                      onChange={handleConvoConnectionChange}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      sx={{ marginBottom: 1 }}
                      name="port"
                      label="Port"
                      type="text"
                      fullWidth
                      value={data.convoConnection?.port}
                      onChange={handleConvoConnectionChange}
                    />
                  </Stack>
                  <TextField
                    autoFocus
                    margin="dense"
                    sx={{ marginBottom: 1, marginRight: 2 }}
                    name="database"
                    label="Database(optional)"
                    type="text"
                    fullWidth
                    value={data.convoConnection?.database}
                    onChange={handleConvoConnectionChange}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    sx={{ marginBottom: 1, marginRight: 2 }}
                    name="username"
                    label="Username"
                    type="text"
                    fullWidth
                    value={data.convoConnection?.username}
                    onChange={handleConvoConnectionChange}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    sx={{ marginBottom: 1, marginRight: 2 }}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={data.convoConnection?.password}
                    onChange={handleConvoConnectionChange}
                  />
                </div> : null}
            </TabPanel>

            {/* Gen AI API */}
            <TabPanel value={value} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="AI Service"
                    name="aiService"
                    value={data.aiService}
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
            </TabPanel>

            {/* Schema */}
            <TabPanel value={value} index={3}>
              <Button
              onClick={handleGetSchema}
              > Get Schema from DB </Button>
              {/* <TextField
                name="schema"
                multiline
                fullWidth
                rows={20}
                value={data.schema}
                onChange={handleChange}
              /> */}
              {/* <textarea
                style={{ width: '100%', height: '200px' }}
                value={data.schema}
                onChange={handleChange}
                placeholder="Enter JSON text here"
              /> */}
              <JsonPrettifier jsonText={data.schema} />

            </TabPanel>

            {/* Few shot examples */}
            <TabPanel value={value} index={4}>
              <QAPairs
                fewshot={data.fewshot}
                onChange={(newFewshot) => setData({ ...data, fewshot: newFewshot })}
              />
            </TabPanel>

            {/* Tools for LLM */}
            <TabPanel value={value} index={5}>
              <Tools toolsData={data.toolsData} onToolsChange={(newTool) => setData({ ...data, toolsData: newTool })} />
            </TabPanel>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AgentDialog;
