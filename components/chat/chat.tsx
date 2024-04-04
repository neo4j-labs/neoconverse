
import * as React from 'react';
import { useState, useRef } from "react";

import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Image from "next/image";

import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';

import ArticleIcon from '@mui/icons-material/Article';
import CodeSharpIcon from '@mui/icons-material/CodeSharp';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { MuiMarkdown, getOverrides } from 'mui-markdown';

import List from '@mui/material/List';

import ReactEcharts from "echarts-for-react";
import LoadingDots from "../common/LoadingDots";
import CypherEditor from "./cypherEditor"
import SchemaModal from '../common/SchemaModal';
import QuestionsModal from '../common/QuestionsModal';

const ExtraPadding = 10;

const Chat = (props) => {

    let {
        dbSchemaImageUrl,
        loading,
        messages,
        respondWithChart,
        runCypher,
        sampleQuestions,
        scrollToBios,
        setContext,
        setLoading,
        setMessages,
        setRespondWithChart,
        setUserInput,
        setBioRef,
        styleProps,
        StreamResponse,
        userInput
    } = props;

    styleProps = styleProps || {};

    const bioRef = useRef<null | HTMLDivElement>(null);
    const howCanIHelpRef = useRef<null | HTMLDivElement>(null);

    const [openCypherBlock, setOpenCypherBlock] = useState(null);
    const [questionsModalVisible, setQuestionsModalVisible] = useState(false);
    const [schemaModalVisible, setSchemaModalVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    setBioRef(bioRef);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const howCanIHelpYouHeight = () => {
        if (howCanIHelpRef.current) {
            return howCanIHelpRef.current.clientHeight;
        } else {
            return 50;
        }
    }

    const getChatHeight = () => styleProps.HeaderHeight + howCanIHelpYouHeight() + ExtraPadding

    const handleCypherBlockClick = (event: React.MouseEvent<HTMLButtonElement>, i: any) => {
        // setAnchorEl(event.currentTarget);

        if (openCypherBlock === i) {
            setOpenCypherBlock(-1);
        }
        else {
            setOpenCypherBlock(i);
        }

    };

    const handleCypherBlockClose = () => {
        setAnchorEl(null);
        setOpenCypherBlock(null);
    };

    return (
        <>
            <Stack style={{
                color: "rgba(0, 0, 0, 0.6)", paddingTop: "12px", paddingBottom: "12px", marginLeft: -5, overflow: 'auto', fontWeight: 600, fontSize: 18, fontFamily: "sans-serif",
                backgroundImage: 'url(/shape3_bottom_copy.png)',
                backgroundSize: 'contain', // Ensure the full image is visible
                backgroundPosition: 'center', // Center the background image
                backgroundRepeat: 'repeat', // Prevent the image from repeating
            }}
            >
                Chat </Stack>
            <List sx={{
                width: '100%',
                height: `calc(100vh - ${getChatHeight()}px)`,
                borderLeft: 1,
                borderColor: 'grey.300',
                bgcolor: 'background.paper',
                overflow: 'auto',
                borderTop: '2px dotted lightgray',
                borderBottom: '2px dotted lightgray',
                // marginTop: '19px',
            }}>
                {messages.map((m, i) => (
                    // <ChatMessage key={`message-${i}`} message={m} />
                    <div className="chat-message">
                        <ListItem divider sx={{ width: "100%" }}>
                            <ListItemAvatar>
                                <Image width={30} height={30} alt="Neo4j" src={m.avatar} />
                            </ListItemAvatar>

                            {i === 0 && (
                                <span>
                                    <ListItemText style={{ whiteSpace: "pre-wrap" }}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                    component="span"
                                                    variant="caption"
                                                    color="text.primary"
                                                >
                                                    Hey there! NeoConverse uses generative AI to help you communicate with neo4j database using natural language. If you encounter any inaccurate responses, please report them using the report icon. Let's start chatting!
                                                </Typography>
                                                {" "}
                                            </React.Fragment>
                                        }
                                    /></span>
                            )
                            }
                            {i != 0 && !m.isChart && (
                                <ListItemText disableTypography
                                    style={{ whiteSpace: "pre-wrap", color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                    secondary={
                                        <React.Fragment>
                                            <MuiMarkdown
                                                codeWrapperStyles={{
                                                    borderRadius: '0.5rem',
                                                    padding: '0.5rem 0.75rem',
                                                    overflow: 'scroll'
                                                }}
                                                overrides={{
                                                    ...getOverrides(), // This will keep the other default overrides.

                                                    h5: {
                                                        component: 'p',
                                                        props: {
                                                            style: { color: "rgba(0, 0, 0, 0.6)", paddingLeft: "20px", marginLeft: -5, overflow: 'auto', fontWeight: 600, fontSize: 15, fontFamily: "sans-serif" },
                                                        } as React.HTMLProps<HTMLParagraphElement>,
                                                    },
                                                    p: {
                                                        component: 'p',
                                                        props: {
                                                            style: { color: "rgba(0, 0, 0, 0.6)", paddingLeft: "20px", marginLeft: -5, overflow: 'auto', fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" },
                                                        } as React.HTMLProps<HTMLParagraphElement>,
                                                    },
                                                    li: {
                                                        component: 'li',
                                                        props: {
                                                            style: { color: "rgba(0, 0, 0, 0.6)", paddingLeft: "20px", marginLeft: -5, overflow: 'auto', fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" },
                                                        } as React.HTMLProps<HTMLParagraphElement>,
                                                    }
                                                }}
                                            >{m.text}
                                            </MuiMarkdown>

                                            {openCypherBlock === i && m.author.name === "ai" && (
                                                <div>
                                                    <CypherEditor
                                                        cypherQuery={m.cypher}
                                                        messages={messages}
                                                        messageIndex={i}
                                                        runCypher={runCypher}
                                                        scrollToBios={scrollToBios}
                                                        setContext={setContext}
                                                        setLoading={setLoading}
                                                        setMessages={setMessages}
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    }
                                />
                            )
                            }
                            {i != 0 && m.isChart && m.chartData.toString() != '' && (
                                <ReactEcharts option={m.chartData} style={{ height: '300px', width: '96%' }} />
                            )
                            }
                            {i != 0 && m.isChart && m.chartData.toString() === '' && (
                                <ListItemText disableTypography
                                    style={{ whiteSpace: "pre-wrap", color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                    // primary={m.text} 
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                component="span"
                                                variant="caption"
                                                color="text.primary"
                                            >
                                                {m.text}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            )
                            }
                            {!loading && i === messages.length - 1 && (
                                <span ref={bioRef}></span>)
                            }
                            {loading && i === messages.length - 1 && (
                                <span>
                                    <LoadingDots color="black" style="large" marginLeft="-500px" />
                                </span>
                            )
                            }
                            {m.author.name === "ai" && i !== 0 && (
                                <Stack>
                                    <ThumbUpOffAltIcon style={{ cursor: 'pointer' }} />
                                    <ThumbDownOutlinedIcon style={{ cursor: 'pointer' }} />
                                    <ReportOutlinedIcon style={{ cursor: 'pointer' }} />
                                    <CodeSharpIcon id={'csi' + i + m.date.toUTCString()} key={'csi' + m.date.toUTCString()} style={{ cursor: 'pointer' }} onClick={(e) => handleCypherBlockClick(e, i)} />
                                </Stack>
                            )
                            }
                        </ListItem>
                        {/* <ListItem>
                        <ReactEcharts  option={option} style={{height: '300px', width: '100%'}} />
                    </ListItem> */}
                    </div>
                ))}
            </List>
            <TextField ref={howCanIHelpRef} fullWidth id="standard-basic" label="How can i help you today ?" variant="standard"
                sx={{ fontWeight: 400, fontSize: 15 }}
                multiline
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        StreamResponse(e)
                    }
                }}
                onChange={(e) => {
                    if (e.key !== "Enter" || e.shiftKey) {
                        setUserInput(e.target.value)
                    } 
                }}
                value={userInput}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title={"Sample Questions and Model"}>
                                <MoreVertIcon style={{ cursor: "pointer" }} onClick={handleMenu} />
                            </Tooltip>
                            {respondWithChart ?
                                <Tooltip title="Respond with Chart">
                                    <DonutSmallIcon sx={{ cursor: "pointer" }} onClick={() => { setRespondWithChart(!respondWithChart) }} />
                                </Tooltip>
                                :
                                <Tooltip title="Respond with Text">
                                    <ArticleIcon sx={{ cursor: "pointer" }} onClick={() => { setRespondWithChart(!respondWithChart) }} />
                                </Tooltip>
                            }
                            <Tooltip title="Send Message">
                                <SendIcon sx={{ cursor: "pointer", paddingLeft: "10px", paddingRight: "10px" }} onClick={(e) => {
                                    StreamResponse(e)
                                }} />
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            />
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    setTimeout(() => {
                        setSchemaModalVisible(true);
                    }, 50)
                }}>
                    Graph Model
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setTimeout(() => {
                        setQuestionsModalVisible(true);
                    }, 50)
                }}>
                    Sample Questions
                </MenuItem>
            </Menu>
            <SchemaModal
                visible={schemaModalVisible}
                setSchemaModalVisible={setSchemaModalVisible}
                schemaImageUrl={dbSchemaImageUrl}
            />

            <QuestionsModal
                visible={questionsModalVisible}
                questions={sampleQuestions}
                setQuestion={setUserInput}
                setQuestionsModalVisible={setQuestionsModalVisible}
            />
        </>
    )
}

export default Chat;