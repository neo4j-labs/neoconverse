import * as React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import ApplicationContent from './applicationContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Divider, Typography } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link';
import { securePage, getUser, AuthMethod, getAuthMethod } from './api/authHelper';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const LogoutLink = () => {
  return (
    (getAuthMethod() === AuthMethod.Auth0)
      ?
      <Link style={{
        marginLeft: '10px', marginTop: '8px', marginRight: '5px',
        color: '#545454',
        textDecoration: 'none'
      }} href="/api/auth/logout">Logout
      </Link>
      :
      <></>
  )
}

const Home: NextPage = () => {

  const { user, error, isLoading } = getUser();

  // console.log("userInfo ", user);
  const Capabilities = {
    TalkToMyData: "TalkToMyData",
    CypherGenie: "CypherGenie"
  }
  const [capability, setCapability] = useState(Capabilities.TalkToMyData);
  const [showOptions, setShowOptions] = useState(false);
  const handleCapabilityChange = async (event: any) => {
    setCapability(event.target.value);
    console.log('selected capability', event.target.value);
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Head>
        <title>NeoConverse</title>
        {/*<link rel="icon" href="/logo-section-5.svg" /> */}
        {/* adding ?v=2 because Chrome won't update it*/}
        {/*https://stackoverflow.com/questions/2208933/how-do-i-force-a-favicon-refresh*/}
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
      </Head>
      {/* <Header /> */}
      <main style={{ overflowY: "scroll", height: "100vh" }}>
        <Grid container spacing={12}
          sx={{ paddingTop: '8px', background: "rgba(251, 249, 246, 1)" }}
        >
          <Grid item xs={2}
            style={{ verticalAlign: "center", }}
            sx={{
              width: '100%',
              height: '100%,',
              backgroundImage: 'url(/shape3_top.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center', // Center the background image
              backgroundRepeat: 'no-repeat', // Prevent the image from repeating
            }}
          >
          </Grid>
          <Grid item xs={9}
          >
            <Stack direction="row" justifyContent={"center"} spacing={0} style={{ paddingLeft: 10 }}
            >
              <img
                height="24"
                width="auto"
                src="https://dist.neo4j.com/wp-content/uploads/20210422140034/Neo4j-logo_color.png"
                alt="Logo"
                style={{ marginRight: '18px', marginTop: '12px' }}
              />
              <Typography style={{ letterSpacing: "0.1em", color: "rgba(42, 96, 140, 1)", whiteSpace: "pre-wrap", textAlign: 'left', fontSize: "30px", fontWeight: 600 }}
              >NeoConverse
              </Typography>
              {/* Switching to FontAwesome so I can make a favicon */}
              <div style={{ width: 24, height: 24 }}>
                <FontAwesomeIcon icon={faComments} style={{ color: "rgba(240, 148, 114, 1)" }} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                marginLeft: '10px',
                fontStyle: 'italic',
                height: '2.5em'
              }}>
                <Typography variant="caption" display="block" gutterBottom
                  style={{ textAlign: 'left', color: "rgba(42, 96, 140, 1)" }}
                >
                  A GenAI copilot to converse with your neo4j graph data
                </Typography>
              </div>
            </Stack>
          </Grid>
        
          <Grid item xs={1}
            style={{ verticalAlign: "center", }}
            sx={{
              width: '100%',
              height: '100%,',
              backgroundImage: 'url(/shape2_bottom.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'top', // Center the background image
              backgroundRepeat: 'repeat', // Prevent the image from repeating
            }}
          >
            <Item>
              <Stack direction="row" spacing={0} style={{ paddingLeft: 10, justifyContent: "flex-end" }}

              >
                {showOptions && <FormControl size="small"
                  style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif", paddingLeft: 10 }}
                >
                  <Select
                    id="demo-simple-select-helper"
                    value={capability}
                    style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                    onChange={handleCapabilityChange}
                  >
                    <MenuItem value={Capabilities.TalkToMyData} style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}>Azure OpenAI</MenuItem>
                    <MenuItem value={Capabilities.CypherGenie} style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}>Google Vertex AI</MenuItem>
                  </Select>
                </FormControl>
                }
                <LogoutLink suppressHydrationWarning />
              </Stack>
            </Item>
          </Grid>
        </Grid>
        {/* <Divider light /> */}
        {/* className="overflow-auto hover:overflow-scroll justify-end" */}
        <ApplicationContent></ApplicationContent>
        {/*}
      {capability === Capabilities.TalkToMyData && (
         <OpenAI></OpenAI>
      )}
      {capability === Capabilities.CypherGenie && (
          <VertexAI></VertexAI>
          // <div style={{ backgroundImage: comingsoon }}>Overlay text</div>
          // <img src="./comingsoon.jpeg" alt="React Image" style={{ objectFit:'cover', height:"100%", width:"100%"}} />
      )}
      */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default securePage(Home);
//export default withPageAuthRequired(Home);


