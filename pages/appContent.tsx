import * as React from 'react';

import Grid from '@mui/material/Grid';
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";


import { initAgents, getAgents, getAgentByKey } from '../agents/agentRegistry';
import AgentList from '../components/agent/agentList';
import Chat from '../components/chat/chat';
import { runNeoApi } from '../components/database/runNeoApi';
import save_convo from './api/call_api';
import { GenerateContent, ExecuteCypher, InvokeLLMForMessage, InvokeLLMForTool } from '../lib/middleware';
import * as prompts from '../lib/prompt';
import { getUser } from './api/authHelper';
import { track, Events } from '../components/common/tracking';
import { LLMDetails } from '../lib/type';
import {SAVE_CONVO_CYPHER} from '../lib/cypherQuery'
import { userInfo } from 'os';
// import  {BasicNvlWrapper}  from '@neo4j-nvl/react';
const HeaderHeight = 135;
// import type { Node, Relationship } from '@neo4j-nvl/core';
// const [nodes, setNodes] = useState<Node[]>([]);
// const [relationships, setRelationships] = useState<Relationship[]>([]);
// import  ForceGraph3D from 'react-force-graph';
// import ForceGraph3D from '3d-force-graph'
// import ForceGraph3D from 'react-force-graph-3d';

import dynamic from 'next/dynamic';

// const ForceGraph3D = dynamic(() => import("../node_modules/react-force-graph-3d"), {ssr: false})
// import SpriteText from "//unpkg.com/three-spritetext/dist/three-spritetext.mjs";


// const BasicNvlWrapper = dynamic(() => import("@neo4j-nvl/react/lib/index"), {ssr:false})
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false
});

type Message =  {
  text: any;
  author: {
    name: string;
  };
  avatar: string;
  isChart: boolean;
  cypher: string;
  date: Date;
};

const AppContent: NextPage = () => {

  const { user, error, isLoading } = getUser();

  const [loading, setLoading] = useState(false);
  const mainRef = useRef<null | HTMLDivElement>(null);

  const [bioRef, setBioRef] = useState();
  const [userInput, setUserInput] = useState("");
  const [context, setContext] = useState("");
  const [initialContext, setInitialContext]= useState("");
  const [fewShot, setFewShot]= useState("");
  const [dbSchemaImageUrl, setDbSchemaImageUrl] = useState('');
  const [respondWithChart, setRespondWithChart] = useState(false);
  const [anchorElShowModel, setAnchorElShowModel] = React.useState<HTMLButtonElement | null>(null);
  const [currentDomainImage, setCurrentDomainImage] = useState("/realtorchat.png");
  const [llmKey, setLLMKey] = useState();
  const [isUserDefinedAgent, setIsUserDefinedAgent] = useState();
  const [sampleQuestions, setSampleQuestions] = useState([
    { question: 'Question 1', priority: 1 },
    { question: 'Question 2', priority: 2 },
    { question: 'Question 3', priority: 3 },
    { question: 'Question 4', priority: 4 },
    { question: 'Question 5', priority: 5 }
  ]);
  // 
  type ChatGPTAgent = "user" | "system";

    interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
  }

  const [selectedAgentKey, setSelectedAgentKey] = useState("");
  const [agents, setAgents] = useState([]);
  const [agentsAreLoading, setAgentsAreLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
 let json = 
  {
    "nodes": [
      { "id": "react-force-graph", "user": "vasturiano" },
      { "id": "force-graph", "user": "vasturiano" },
      { "id": "3d-force-graph", "user": "vasturiano" },
      { "id": "three-render-objects", "user": "vasturiano" },
      { "id": "3d-force-graph-vr", "user": "vasturiano" },
      { "id": "3d-force-graph-ar", "user": "vasturiano" },
      { "id": "aframe-forcegraph-component", "user": "vasturiano" },
      { "id": "three-forcegraph", "user": "vasturiano" },
      { "id": "d3-force-3d", "user": "vasturiano" },
      { "id": "d3-force", "user": "d3" },
      { "id": "ngraph", "user": "anvaka" },
      { "id": "three.js", "user": "mrdoob" },
      { "id": "aframe", "user": "aframevr" },
      { "id": "AR.js", "user": "jeromeetienne" }
    ],
    "links": [
      { "target": "force-graph", "source": "react-force-graph" },
      { "target": "3d-force-graph", "source": "react-force-graph" },
      { "target": "3d-force-graph-vr", "source": "react-force-graph" },
      { "target": "3d-force-graph-ar", "source": "react-force-graph" },
      { "target": "aframe-forcegraph-component", "source": "3d-force-graph-vr" },
      { "target": "aframe-forcegraph-component", "source": "3d-force-graph-ar" },
      { "target": "three-forcegraph", "source": "3d-force-graph" },
      { "target": "three-render-objects", "source": "3d-force-graph" },
      { "target": "three-forcegraph", "source": "aframe-forcegraph-component" },
      { "target": "d3-force-3d", "source": "three-forcegraph" },
      { "target": "ngraph", "source": "three-forcegraph" },
      { "target": "d3-force", "source": "force-graph" },
      { "target": "aframe", "source": "3d-force-graph-vr" },
      { "target": "three.js", "source": "aframe" },
      { "target": "three.js", "source": "3d-force-graph" },
      { "target": "AR.js", "source": "3d-force-graph-ar" },
      { "target": "aframe", "source": "AR.js" }]
  }
  const [graphElements, setGraphElements] =  useState(json);

  const [messages, setMessages] = useState([  
    { conversation_id: Date.now()+"-"+user?.name,
      text: "Welcome to our NeoConverse, powered by generative AI! Ask your questions in natural language and get the most appropriate information from your neo4j database,  Let's get started! ",
      date: new Date(),
      author: {
        name: "ai"
      },
      agent:"System",
      avatar: '/Neo4j-icon-color.png',
      isChart: false,
      chartData: {},
      cypher:  "",
      graphElements: {},
      role:"system"
    }])

  const getLLMKey = async(currentAgent) =>{
    const llmKey = (() => {
      const provider = currentAgent.aiService; // Directly use aiService if it's expected to be a string or undefined
      switch (provider) {
        case 'Open AI':
          return {
            openAIKey: currentAgent.openAIKey,
            provider: currentAgent.aiService,
            model: currentAgent.openAIModel,
          };
        case 'Google Vertex AI':
          return {
            googleAPIKey: currentAgent.googleAPIKey,
            provider: currentAgent.aiService,
            model: currentAgent.googleModel,
          };
        case 'AWS Bedrock':
          return {
            awsAccessKeyId: currentAgent.awsAccessKeyId,
            awsSecretAccessKey: currentAgent.awsSecretAccessKey,
            provider: currentAgent.aiService,
            model: currentAgent.awsModel,
          };
        default:
          return {};
      }
    })();
    return llmKey;
  }
  const handleListItemClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: string,
  ) => {
    setSelectedAgentKey(key);
    await processDomainChange(key);    
  };

  function extractQuestions(input:string) {
    const asks = input?.split("Ask:").slice(1); // Split by "Ask:" and remove the first element (empty string before the first "Ask:")
    return asks?.map((ask, index) => {
      const question = ask?.split("Cypher Query:")[0].trim().replace("Ask:",""); // Isolate the question
      return {
          question: question,
          priority: index + 1 // Assign priority based on order
      };
  });
}

  const processDomainChange = async (key: string) => {
      let agent:any = agents.find(agent => agent?.key === key);
      if (agent) {
        setContext("");
        setUserInput("");
        setInitialContext(agent.promptParts.dataModel);    
        setFewShot(agent.promptParts.fewshot);
        setCurrentDomainImage(agent.icon);
        setDbSchemaImageUrl(agent.dataModelPath);
        // setOpenAIModel(process.env.NEXT_PUBLIC_SMALL_CONTEXT_OPENAI_MODEL as string);
        let keys = await getLLMKey(agent)
        setLLMKey(keys);
        setIsUserDefinedAgent(agent.userDefined)
        if(!agent.userDefined)
          setSampleQuestions(extractQuestions(agent.promptParts.fewshot));
          else{
            setSampleQuestions({})
          }
      } else {
        throw new Error(`Unable to find agent with key '${key}'`);
      }
  }

  useEffect(() => {
    const initialize = async () => {
      setAgentsAreLoading(true);
      await initAgents();
      setAgentsAreLoading(false);
      setAgents(getAgents());
    }
    initialize();
  }, [initialized])

  useEffect(() => {
    let firstAgent = agents[0];
    if (!selectedAgentKey && firstAgent) {
      setSelectedAgentKey(firstAgent.key);
      processDomainChange(firstAgent.key);    
    }
  }, [agents])

  if (!initialized) {
      setInitialized(true);
  }

  // to keep questions in view
  useEffect(() => {
    let chatMessageDivs = document.getElementsByClassName("chat-message");
    if (chatMessageDivs && chatMessageDivs.length > 0) {
      chatMessageDivs[chatMessageDivs.length - 1].scrollIntoView(false);
    }
  }, [messages])

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isValidJSON = str => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  function chartPropsCleanup(generatedChartProps:string){

    let chartConfStr = generatedChartProps.replaceAll('```','').replace("json",'').replace("jsx",'').replace("const option =",'')
    chartConfStr =chartConfStr.toString().trim().startsWith("{")? chartConfStr.toString().trim().replace(';',''): "{"+chartConfStr.toString().trim().replace(';','') ;

    // Add any additional cypher generation logic here
    return chartConfStr;
  }

  const StreamResponse = async (e: any) => {
    e.preventDefault();

    // Enable progress loading bar while response is being generated
    setLoading(true);
    if(context === "")
    {
      setContext((prev) => prev + '\n' +userInput.toString()+ '\n');
    }
    else
    {
      setContext((prev) => prev + '\n\n' +userInput.toString()+ '\n');
    }

    // Refresh the chat list 
    const userData = messages.slice(0);
    userData.push({
      conversation_id : Date.now()+"-"+user?.name,
      text: userInput,
      date: new Date(),
      agent: selectedAgentKey,
      author: {
        name: "User"
      },
      avatar: "/userProfile.jpeg",
      isChart: respondWithChart,
      cypher: "",
      chartData:{},
      graphElements: {},
      role:"user"
    })

    // userData.push({
    //   conversation_id : Date.now()+"-"+user?.name,
    //   text: "",
    //   date: new Date(),
    //   agent: selectedAgentKey,
    //   author: {
    //     name: "ai"
    //   },
    //   avatar: currentDomainImage,
    //   isChart: respondWithChart,
    //   cypher: "",
    //   chartData:{},
    //   role:"assistant"
    // })

    setMessages([...userData]);

    let currentAgent = agents.find(agent => agent?.key === selectedAgentKey);
    let isUserDefined: boolean = (currentAgent?.userDefined === true) ? true : false;

    // TODO: we may want to restrict the total string size of user-defined schemas/fewshots

    track(Events.AskQuestion, { 
      saveConvoOn: (isUserDefined) ? currentAgent.saveConvo : process.env.NEXT_PUBLIC_SAVE_CONVERSATION,
      isChart: respondWithChart,
      isUserDefined: isUserDefined,
      key: (isUserDefined) ? 'UserDefined' : currentAgent?.key,
      // TODO: provider defined below for neo4j agents should come from the agentRegistry
      aiService: (isUserDefined) ? currentAgent?.aiService : "Open AI"
    });      

    
    // Filter the array to exclude the first element and any element where isChart is true
    const filteredMessages = messages.filter((message, index) => index !== 0 && !message.isChart && message.agent==selectedAgentKey);

    // Slice the array to get the last two conversation after filtering
    const lastTwoMessages = filteredMessages.slice(-6);

    // Concatenate the text of the last two messages, with a newline character in between
    const convoHistory = lastTwoMessages.map(message => message.text).join("\n");

    let previous = filteredMessages.map((item) => {
        return {
            role: item.role,
            content: item.text,
        }
    })

    let result_tools = []
    let isCompleted = false
    let MAX_LOOP_COUNT = 10 // Don't want to let it run loose
    let loopCount = 0

    try {  
      do {
          const functionToCall = result_tools.length > 0 ? InvokeLLMForTool : InvokeLLMForMessage
          const payload = result_tools.length > 0 ? { tools: result_tools, previous, userInput, llmKey, isGraphViz:true } : { userInput: userInput, previous, llmKey, isGraphViz:true  }
          
          let result = await functionToCall((payload));
          
          // console.log(result)
          let isJsonresult = isValidJSON(result)

          result = respondWithChart?chartPropsCleanup(result):result;

          if( !isJsonresult) {
                console.log("result : ", result)
                const newAssistantMessage = {
                conversation_id : Date.now()+"-"+user?.name,
                text: result,
                date: new Date(),
                agent: selectedAgentKey,
                author: {
                  name: "assistant"
                },
                avatar: currentDomainImage,
                isChart: respondWithChart,
                cypher: "",
                chartData:respondWithChart?JSON.parse(result):{},
                graphElements: {},
                role:"assistant"
              }
              setMessages((prev) => [...prev, ...[newAssistantMessage]])
              previous.push({ role: 'assistant', content: result.content })
          }
          if(isJsonresult && JSON.parse(result).result)
          {
            let graphEntities = JSON.parse(result).result;
            
            let nodes = graphEntities.map((f) => f.nodes);
            let rels = graphEntities.map((f) => f.rels);

            const formatedNodes: [] = nodes[0].map((g:any) => ({
              id: g.elementId,
              size: 40,
              captionAlign: 'bottom',
              iconAlign: 'bottom',
              captionHtml: <b>Test</b>,
              caption: `${g.labels}: ${g.name}`,
            }));

            const formatedRels: [] = rels[0].map((r: any) => ({
                  id: r.elementId,
                  from: r.startNodeElementId,
                  to: r.endNodeElementId,
                  caption: r.typeç
      
            }));

            setNodes(formatedNodes);
            setRelationships(formatedRels);

            const formatedNodes1: [] = nodes[0].map((g:any) => ({
              id: g.elementId,
              name:g.properties.name?g.properties.name:g.properties.title,
              label:g.labels[0]
            }));
            const formatedRels1: [] = rels[0].map((r: any) => ({
              source: r.startNodeElementId,
              target: r.endNodeElementId,  
              type: r.type
          }));

            let obj = {
              nodes:formatedNodes1,
              links:formatedRels1
            }
            setGraphElements(obj)
            
            const newAssistantMessage = {
              conversation_id : Date.now()+"-"+user?.name,
              text: "",
              date: new Date(),
              agent: selectedAgentKey,
              author: {
                name: "assistant"
              },
              avatar: currentDomainImage,
              isChart: respondWithChart,
              cypher: "",
              chartData:{},
              graphElements: obj,
              role:"assistant"
            }
            setMessages((prev) => [...prev, ...[newAssistantMessage]])
            previous.push({ role: 'assistant', content: result.content })
          }

          if(isJsonresult && JSON.parse(result).tool_calls) {
            console.log("tool calls : ", JSON.parse(result).tool_calls)

              loopCount++
              if(loopCount >= MAX_LOOP_COUNT) {
                  isCompleted = true
              } else {
                  result_tools = JSON.parse(result).tool_calls
              }
          } else {
              isCompleted = true
          }
      } while(!isCompleted)
      setUserInput("");

  } catch(error) {
      console.log(error.name, error.message)
      setUserInput("");

  } finally {
      setLoading(false)
      setUserInput("");

      setTimeout(() => {
          // inputRef.current.focus()
      }, 100)
  }
  };

  function getDomainFromEmail(email: string): string {
    // Split the email string into parts using "@" as the delimiter
    const parts = email.split("@");

    // Check if the split operation resulted in at least 2 parts
    if (parts.length >= 2) {
        // The domain part is always the last part after splitting by "@"
        return parts[parts.length - 1];
    } else {
        // Return a message or throw an error if "@" is not found in the email
        throw new Error("Invalid email address");
    }
  }
  async function runCypher(cypher:string){
    //  var resp = await runNeoApi(selectedAgentKey, cypher,{})
    //  console.log('Cypher Query Generated by LLM \n' , cypher);
     let isUserDefined = getAgentByKey(selectedAgentKey)?.userDefined;
     var neoResponse:any = await ExecuteCypher(isUserDefined, false,  selectedAgentKey, cypher, {});
    //  console.log('Result from Neo4j' , neoResponse.result);
     //var resp = await run(cypher)
    return neoResponse
  }
  
  // const [myNodes] = useState<Node[]>([
  //   { id: '0', size: 20 },
  //   { id: '1', size: 50 }
  // ])
  // const [relationships] = useState<Relationship[]>([{ id: '10', from: '0', to: '1' }])


  return (
    <div>
     <main >
      {/* <Divider light /> */}
      <div ref={mainRef} style={{ height: 'calc(100vh - 70px)'}}>
            <Grid container spacing={2} sx={{paddingTop:"0px"}}>
                <Grid item xs={3} sx={{paddingTop: '0px', overflow: 'none'}}>
                  <AgentList
                    anchorElShowModel={anchorElShowModel} 
                    handleListItemClick={handleListItemClick}
                    initialContext={initialContext}
                    refs={{
                      bioRef,
                      mainRef
                    }}
                    agents={agents}
                    setAgents={setAgents}
                    agentsAreLoading={agentsAreLoading}
                    selectedAgentKey={selectedAgentKey}
                    setAnchorElShowModel={setAnchorElShowModel}
                    styleProps={{
                      HeaderHeight
                    }}
                    setUserInput={setUserInput}
                  />
                </Grid>
                <Grid item xs={9} sx={{paddingTop: '0px'}}>
                {/* <InteractiveNvlWrapper
                                    nodes={nodes}
                                    rels={relationships}
                                    mouseEventCallbacks={{
                                        onHover: (element) => console.log(element),
                                        onNodeClick: (node) => console.log(node),
                                        // onMultiSelect: multiSelect
                                    }}
                                    /> */}
                {/* <BasicNvlWrapper nodes={nodes} rels={relationships} /> */}
                {/* <ForceGraph3D
                    graphData={graphElements}
                    backgroundColor = {"#000000"}
                    linkColor = {"#000000"}
                    linkWidth={1}
                    // forceEngine = {"ngraph"}
                    linkCurvature={"curvature"}
                    dagMode="lr"
                    nodeLabel={"name"}
                    dagLevelDistance={60}
                    linkLabel = {"type"}
                    // linkWidth
                    nodeId="id"
                    nodeAutoColorBy="label"
                    linkDirectionalParticles={2}
                    linkDirectionalParticleWidth={0.5}
                    // onNodeClick={node => window.open(`https://github.com/${node.user}/${node.package}`, '_blank')}
                    // nodeThreeObject={node => {
                    //   const sprite = new SpriteText(node.package);
                    //   sprite.color = node.color;
                    //   sprite.textHeight = 5;
                    //   return sprite;
                    // }}
                    width={700}
                    height={300}
                  /> */}
                  <Chat
                    dbSchemaImageUrl={dbSchemaImageUrl}
                    loading={loading}
                    messages={messages}
                    respondWithChart={respondWithChart}
                    runCypher={runCypher}
                    sampleQuestions={sampleQuestions}
                    scrollToBios={scrollToBios}
                    setContext={setContext}
                    setLoading={setLoading}
                    setMessages={setMessages}
                    setRespondWithChart={setRespondWithChart}
                    setUserInput={setUserInput}
                    setBioRef={setBioRef}
                    styleProps={{
                      HeaderHeight
                    }}
                    StreamResponse={StreamResponse}
                    userInput={userInput}
                    llmKey = {llmKey}
                    isUserDefined = {isUserDefinedAgent}
                    graphElements = {graphElements}
                  >
                  </Chat>
                </Grid>
            </Grid>
       </div>
      </main>
    </div>
  );
};

export default AppContent;


