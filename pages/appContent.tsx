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
const HeaderHeight = 135;

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
      isChart: false,
      cypher: "",
      chartData:{},
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
          const payload = result_tools.length > 0 ? { tools: result_tools, previous, llmKey } : { userInput: userInput, previous, llmKey }
          
          let result = await functionToCall((payload));
          
          
          console.log(result)

          let isJsonresult = isValidJSON(result)

          result = respondWithChart?chartPropsCleanup(result):result;

          if( !isJsonresult) {
              console.log(result)
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
                role:"assistant"
              }
              setMessages((prev) => [...prev, ...[newAssistantMessage]])
              previous.push({ role: 'assistant', content: result.content })
          }
          if(isJsonresult && JSON.parse(result).tool_calls) {
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
  } catch(error) {
      console.log(error.name, error.message)
  } finally {
      setLoading(false)
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


