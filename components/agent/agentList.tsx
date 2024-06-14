import * as React from 'react';
import { useState, useEffect } from "react";

import Image from "next/image";
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Polyline, AddCircleRounded } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { pink, red } from '@mui/material/colors';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AgentDialog from './agentDialog';
import { Props } from 'next/script';
import { Stack } from '@mui/system';
import { getAgents, saveLocalAgent, removeLocalAgent } from '../../agents/agentRegistry';

const AgentList = (props) => {

    const [showModel, setShowModel] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const [agentData, setAgentData] = useState<DialogData>( { 
          title: '',
          key: '',
          description: '',
          schema: '',
          fewshot: [],
          connection: {port:'', database:'',host:'',password:'',protocol:'',username:''},
          icon: '',
          userDefined: true,
          schemaDiagram: "",
          promptParts: {
            dataModel: '',
            fewshot: []
          },
          openAIModel: '', 
          googleModel: '',
          awsModel: ''
      });;

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
        promptParts: PromptParts,
        userDefined: boolean,
        openAIModel: string, 
        googleModel: string,
        awsModel: string
    }

    interface AgentData {
        dataModelPath: string,
        description: string,
        icon: string,
        key: string,
        order: number,
        promptParts: promptParts,
        title: string
    }

    const {
        agents,
        setAgents,
        agentsAreLoading,
        handleListItemClick,
        selectedAgentKey
    } = props;

    let {
        styleProps
    } = props;

    styleProps = styleProps || {};

    const handleShowModelClose = () => {
        setAnchorElShowModel(null);
        setShowModel(false);
    };

    const exportFromLocalStorage = () => {
        const data = localStorage.getItem('myData');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exportedData.json';
            document.body.appendChild(a); // Required for Firefox
            a.click();
            URL.revokeObjectURL(url);
            alert('Data exported from localStorage to file');
        } else {
            alert('No data in localStorage to export');
        }
    };
    
    const handleOpenDialog = () => {

        setAgentData({ 
            title: '',
            key: '',
            description: '',
            schema: '',
            fewshot: [],
            connection: {port:'', database:'',host:'',password:'',protocol:'',username:''},
            icon: '',
            userDefined: true,
            schemaDiagram: "",
            promptParts: {
              dataModel: '',
              fewshot: []
            }
        });

        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSaveAgentData = (dialogData: DialogData) => {
        saveLocalAgent(dialogData);
        setAgents(getAgents());
        handleCloseDialog(); // Optionally close the dialog after saving
    };

    function editAgent(title: any) {
        let agentObj = agents.filter(data => data.title === title);
        setAgentData(agentObj[0]);
        setDialogOpen(true);
    }

    const handleDeleteClick = (key:any) =>{
        removeLocalAgent(key);
        setAgents(getAgents());
    }

    const handleEditClick = (key:any) =>{
        editAgent(key);
    }
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <>
            <Stack direction="row"   
                justifyContent="space-between" 
                sx={{
                    paddingTop: "6px",
                    backgroundImage: 'url(/shape3_bottom_copy.png)',
                    backgroundSize: 'contain', // Ensure the full image is visible
                    backgroundPosition: 'center', // Center the background image
                    backgroundRepeat: 'repeat', // Prevent the image from repeating
                    }} 
                >
                {/* <div style={{
                    color: "rgba(0, 0, 0, 0.6)", paddingLeft: "20px",
                    marginLeft: -5, fontWeight: 600,
                    fontSize: 18, fontFamily: "sans-serif"
                }}>
                    Agents
                </div> */}
                <Typography
                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", paddingLeft: "20px", fontWeight: 600, fontSize: 18, fontFamily: "sans-serif" }}
                        component="span"
                        variant="caption"
                        color="text.primary"
                    >
                        Neo Agents
                    </Typography>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button  sx={{color:"#606060"}} variant="text" startIcon={<AddCircleRounded  color="#606060"  />} onClick={handleOpenDialog}>
                            Add Agent
                        </Button>
                </div>
            </Stack>
            <AgentDialog open={isDialogOpen} agentData = {agentData} onSave={handleSaveAgentData} onClose={handleCloseDialog}></AgentDialog>
            <Accordion sx={{ marginTop: '4px', '&.Mui-expanded': { marginTop: '4px' }}} >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                        sx={{
                        display: 'inline',
                        color: "rgba(0, 0, 0, 0.6)",
                        fontWeight: 600,
                        fontSize: 18,
                        fontFamily: "sans-serif",
                        paddingLeft: '10px'
                    }}
                    >Explore Predefined Agents</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{
                        width: '100%',
                        // height: `calc(100vh - ${styleProps.HeaderHeight}px)`,
                        overflow: "auto",
                        border: 0,
                        borderTop: '2px dotted lightgray',
                        // marginTop: '3px',
                        borderColor: 'grey.300',
                        bgcolor: 'background.paper',
                        "&& .Mui-selected": {
                            backgroundColor: "#bdbdbd", paddingLeft: "20px"
                        }
                    }}
                    >
                        {(agents && agents.length === 0) ?
                            <Typography
                                sx={{
                                    display: 'inline',
                                    color: "rgba(0, 0, 0, 0.6)",
                                    fontWeight: 400,
                                    fontSize: 15,
                                    fontFamily: "sans-serif",
                                    paddingLeft: '10px'
                                }}
                            >{agentsAreLoading ? 'Loading...' : 'No agents configured'}
                            </Typography>
                            :
                            agents.filter(agentInfo => !agentInfo.userDefined)?.map(agentInfo => {
                                return (
                                    <ListItem button
                                        key={agentInfo?.key}
                                        onClick={(event) => handleListItemClick(event, agentInfo?.key)} selected={selectedAgentKey === agentInfo?.key}
                                        secondaryAction={
                                                <Stack direction="row" spacing={2} sx={{paddingLeft:80}} >
                                                            {
                                                            (agentInfo?.userDefined === true) ?
                                                                <div>
                                                                    <Tooltip title="Edit Agent">
                                                                        <EditIcon sx={{color: "#606060"}}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleEditClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </EditIcon>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Agent">
                                                                        <DeleteIcon sx={{ color: '#979797' }}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleDeleteClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </DeleteIcon>
                                                                    </Tooltip>
                                                                    {
                                                                        (agentInfo?.schema === "") ?
                                                                            <Tooltip  
                                                                            title={
                                                                                <div style={{ whiteSpace: 'pre-line' }}>{`One of the following critical information is missing for this agent \n
                                                                                    1. Schema \n
                                                                                    2. Database connection information \n
                                                                                    3. Gen AI API configuration\n\
                                                                                    
                                                                                    Please provide these information for the agent to work as expected`}</div>
                                                                            }
                                                                            >
                                                                                <ErrorOutlineIcon sx={{ color: '#f50057' }}
                                                                                    // onClick={async (e) => {
                                                                                    //     e.preventDefault();
                                                                                    //     e.stopPropagation();
                                                                                    //     await handleDeleteClick(agentInfo?.key);
                                                                                    //     }}
                                                                                    >
                                                                                    <Polyline />
                                                                                </ErrorOutlineIcon>
                                                                            </Tooltip>:<div/>
                                                                        }
                                                                </div>
                                                                :<div/>
                                                            }
                                                </Stack>
                                            }
                                        >
                                        <ListItemIcon>
                                            <Image width={40} height={40} alt={`${agentInfo?.title} icon`} src={agentInfo?.icon} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <span style={{paddingRight: '8px' }}>{agentInfo?.title}</span>
                                                    {/* <div> */}
                                                    {agentInfo?.userDefined === true
                                                            ? <Chip label="Local" color="success" variant="outlined" size="small" />
                                                            : <Chip label="Remote" color="primary" variant="outlined" size="small" />
                                                        }
                                                    {/* </div> */}
                                                </>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                        component="span"
                                                        variant="caption"
                                                        color="text.primary"
                                                    >
                                                        {agentInfo?.description}
                                                    </Typography>
                                                    {" "}
                                                </React.Fragment>
                                            }
                                        >
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}  sx={{ marginTop: '4px', '&.Mui-expanded': { marginTop: '4px' }}} >
                <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                    <Typography
                     sx={{
                        display: 'inline',
                        color: "rgba(0, 0, 0, 0.6)",
                        fontWeight: 600,
                        fontSize: 18,
                        fontFamily: "sans-serif",
                        paddingLeft: '10px'
                    }}
                    >Agents Created By You</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{
                        width: '100%',
                        // height: `calc(100vh - ${styleProps.HeaderHeight}px)`,
                        overflow: "auto",
                        border: 0,
                        borderTop: '2px dotted lightgray',
                        marginTop: '3px',
                        borderColor: 'grey.300',
                        bgcolor: 'background.paper',
                        "&& .Mui-selected": {
                            backgroundColor: "#bdbdbd", paddingLeft: "20px"
                        }
                    }}
                    >
                        {(agents.filter(agentInfo => agentInfo.userDefined) && agents.filter(agentInfo => agentInfo.userDefined).length === 0) ?
                            <Typography
                                sx={{
                                    display: 'inline',
                                    color: "rgba(0, 0, 0, 0.6)",
                                    fontWeight: 400,
                                    fontSize: 15,
                                    fontFamily: "sans-serif",
                                    paddingLeft: '10px'
                                }}
                            >{agentsAreLoading ? 'Loading...' : "You haven't configured any agents"}
                            </Typography>
                            :
                            agents.filter(agentInfo => agentInfo.userDefined)?.map(agentInfo => {
                                return (
                                    <ListItem button
                                        key={agentInfo?.key}
                                        onClick={(event) => handleListItemClick(event, agentInfo?.key)} selected={selectedAgentKey === agentInfo?.key}
                                        secondaryAction={
                                                <Stack direction="row" spacing={2} sx={{paddingLeft:80}} >
                                                            {
                                                            (agentInfo?.userDefined === true) ?
                                                                <div>
                                                                    <Tooltip title="Edit Agent">
                                                                        <EditIcon sx={{color: "#606060"}}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleEditClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </EditIcon>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Agent">
                                                                        <DeleteIcon sx={{ color: '#979797' }}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleDeleteClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </DeleteIcon>
                                                                    </Tooltip>
                                                                    {
                                                                        (agentInfo?.schema === "") ?
                                                                            <Tooltip  
                                                                            title={
                                                                                <div style={{ whiteSpace: 'pre-line' }}>{`One of the following critical information is missing for this agent \n
                                                                                    1. Schema \n
                                                                                    2. Database connection information \n
                                                                                    3. Gen AI API configuration\n\
                                                                                    
                                                                                    Please provide these information for the agent to work as expected`}</div>
                                                                            }
                                                                            >
                                                                                <ErrorOutlineIcon sx={{ color: '#f50057' }}
                                                                                    // onClick={async (e) => {
                                                                                    //     e.preventDefault();
                                                                                    //     e.stopPropagation();
                                                                                    //     await handleDeleteClick(agentInfo?.key);
                                                                                    //     }}
                                                                                    >
                                                                                    <Polyline />
                                                                                </ErrorOutlineIcon>
                                                                            </Tooltip>:<div/>
                                                                        }
                                                                </div>
                                                                :<div/>
                                                            }
                                                </Stack>
                                            }
                                        >
                                        <ListItemIcon>
                                            <Image width={40} height={40} alt={`${agentInfo?.title} icon`} src={agentInfo?.icon} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <span style={{paddingRight: '8px' }}>{agentInfo?.title}</span>
                                                    {/* <div> */}
                                                    {agentInfo?.userDefined === true
                                                            ? <Chip label="Local" color="success" variant="outlined" size="small" />
                                                            : <Chip label="Remote" color="primary" variant="outlined" size="small" />
                                                        }
                                                    {/* </div> */}
                                                </>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                        component="span"
                                                        variant="caption"
                                                        color="text.primary"
                                                    >
                                                        {agentInfo?.description}
                                                    </Typography>
                                                    {" "}
                                                </React.Fragment>
                                            }
                                        >
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default AgentList;