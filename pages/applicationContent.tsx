import { useUser } from '@auth0/nextjs-auth0/client';
import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import { Divider } from "@mui/material";

import { initAgents, getAgents, getAgentByKey } from '../agents/agentRegistry';
import AgentList from '../components/agent/agentList';
import Chat from '../components/chat/chat';
import { runNeoApi } from '../components/database/runNeoApi';
import save_convo from './api/call_api';
import { GenerateContent, ExecuteCypher } from '../lib/middleware';
import * as prompts from '../lib/prompt';
import { getUser } from './api/authHelper';
import { track, Events } from '../components/common/tracking';
import { LLMDetails } from '../lib/type';

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

const ApplicationContent: NextPage = () => {

  const { user, error, isLoading } = getUser();

  const [loading, setLoading] = useState(false);
  const mainRef = useRef<null | HTMLDivElement>(null);

  const [bioRef, setBioRef] = useState();
  const [userInput, setUserInput] = useState("");
  const [context, setContext] = useState("");
  const [initialContext, setInitialContext]= useState("");
  const [fewShot, setFewShot]= useState("");
  const [additionContext, setAdditionContext]= useState("")
  const [domain, setDomain]= useState(1);
  const [cypherInput, setCypherInput]= useState("")
  const [dbSchemaImageUrl, setDbSchemaImageUrl] = useState('');
  const [respondWithChart, setRespondWithChart] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [anchorElShowModel, setAnchorElShowModel] = React.useState<HTMLButtonElement | null>(null);
  const [currentDomainImage, setCurrentDomainImage] = useState("/realtorchat.png");
  const [openAIModel,setOpenAIModel] = useState('gpt=4');
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

  //const [selectedAgentKey, setSelectedAgentKey] = useState(NeoAgents.MicrosoftGraph.key);
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
      avatar: '/Neo4j-icon-color.png',
      isChart: false,
      chartData: {},
      cypher:  ""
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
        setOpenAIModel(process.env.NEXT_PUBLIC_SMALL_CONTEXT_OPENAI_MODEL as string);
        let keys = await getLLMKey(agent)
        setLLMKey(keys);
        setIsUserDefinedAgent(agent.isUserDefined)
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
      author: {
        name: "User"
      },
      avatar: "/userProfile.jpeg",
      isChart: false,
      cypher: "",
      chartData:{}
    })

    userData.push({
      conversation_id : Date.now()+"-"+user?.name,
      text: "",
      date: new Date(),
      author: {
        name: "ai"
      },
      avatar: currentDomainImage,
      isChart: respondWithChart,
      cypher: "",
      chartData:{}
    })

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
    const filteredMessages = messages.filter((message, index) => index !== 0 && !message.isChart);

    // Slice the array to get the last two conversation after filtering
    const lastTwoMessages = filteredMessages.slice(-6);

    // Concatenate the text of the last two messages, with a newline character in between
    const convoHistory = lastTwoMessages.map(message => message.text).join("\n");


    // var prompt = initialContext +' \n'+ context +' \n'+ additionContext +'\nCreate a cypher query for '+ userInput+'""" \n cypher query = ';

    // Form the prompt template
    // initialContext - datamodel schema
    // fewShot - few shot examples for give database
    // userInput - actual user question 
    let fewShotStr = (Array.isArray(fewShot)) 
      ? fewShot.map(x => `\nAsk:\n${x.question}\nCypher Query:\n${x.answer}`).join('\n')
      : fewShot;
    // var prompt = initialContext  +' \n'+ fewShotStr+'\n'+additionContext +'\nAsk :'+ userInput+'\nCypher Query:  ';
    var prompt = initialContext  +' \n'+ fewShotStr+'\n'+ convoHistory +'\nAsk :'+ userInput+'\nCypher Query:  ';

    console.log('Prompt for Cypher generation \n' , prompt);
    let provider =  currentAgent?.userDefined ? currentAgent?.aiService : "Open AI";
    
    let responseText = await GenerateContent(isUserDefined, prompt, true, respondWithChart, llmKey)
    console.log('responseText \n' , responseText);

    var query = "";
    if (responseText.toString().toLowerCase().indexOf('limit') !== -1 ) {
      query = responseText.toString();
    } else {
      query = respondWithChart? responseText.toString().trim().replace(';','') : responseText.toString().trim().replace(';','') + '\nLIMIT 5';
    }

    userData[userData.length-1].cypher = query;

    try{
        console.log('Cypher Query Generated by LLM \n' , query);
        var neoResponse:any = await ExecuteCypher(isUserDefined, selectedAgentKey, query, {});
        console.log('Result from Neo4j' , neoResponse.result);

        var prompt = ""
        if(!respondWithChart){
            if(neoResponse?.result?.length ===0)
            {
              prompt = prompts.GRACEFUL_MESSAGE_PROMPT;
            }
            else if(neoResponse?.result?.length > 500){
              prompt = prompts.GRACEFUL_HUGE_TEXT_PROMPT;
            }
            else{
              prompt = prompts.HUMAN_READABLE_MESSAGE_PROMPT(userInput, JSON.stringify(neoResponse.result).trim())
            }
        }
        else{
          
          if(neoResponse?.result?.length ===0)
          {
            prompt = prompts.GRACEFUL_MESSAGE_PROMPT;
          }
          else{
            prompt = prompts.CHART_GENERATION_PROMPT(userInput, JSON.stringify(neoResponse.result).trim())
          }
        }

        console.log('Prompt \n' , prompt);
     
        let finalResponse = await GenerateContent(isUserDefined, prompt, false, respondWithChart, llmKey)
        let finalMessage = ""
        if(!respondWithChart)
        {
          const reader = finalResponse?.body?.getReader();
          let result = ""
          while (true) {
              const { done, value } = await reader?.read();
              let chunkValue = new TextDecoder().decode(value);
              result+=chunkValue;
              setContext((prev) => prev + chunkValue);
              !respondWithChart ?  userData[userData.length-1].text = userData[userData.length-1].text + chunkValue : ""
              finalMessage+=chunkValue;
              if (done) {
                  break;
              }
          }
        }
        else
        {
          finalMessage = finalResponse.toString();
          setContext((prev) => prev + finalMessage);
        }
    
        setLoading(false);
        console.log("chartConfStr", finalMessage);

        if (respondWithChart && neoResponse.result.length !=0){
          finalMessage = JSON.stringify(eval("(" + finalMessage + ")"));
          userData[userData.length-1].chartData = JSON.parse(finalMessage);
        }
        else if (respondWithChart && neoResponse.result.length ==0){
          userData[userData.length-1].chartData = "";
          userData[userData.length-1].text = prompts.GRACEFUL_CHART_FAILURE_PROMPT;
        }
        const userDataForceRefresh = userData.slice(0);
        setMessages([...userDataForceRefresh]);
        console.log(userData[userData.length-1].chartData);
        scrollToBios();
      }
      catch (neo4jError){
        console.log('neo4jError',neo4jError)
        var prompt = prompts.GRACEFUL_MESSAGE_PROMPT;

        console.log('localContext',prompt);

        let response = await GenerateContent(isUserDefined, prompt, false, false, llmKey)
        const reader = response?.body?.getReader();
        let result = ""
        while (true) {
            const { done, value } = await reader?.read();
            let chunkValue = new TextDecoder().decode(value);
            result+=chunkValue;
            setContext((prev) => prev + chunkValue);
            !respondWithChart ?  userData[userData.length-1].text = userData[userData.length-1].text + chunkValue : ""
            if (done) {
                break;
            }
        }
        userData[userData.length-1].text = result.toString();

        scrollToBios();
        userData[userData.length-1].chartData = "";
        const userDataForceRefresh = userData.slice(0);
        setMessages([...userDataForceRefresh]);
        setLoading(false);
      }
      if (process.env.NEXT_PUBLIC_SAVE_CONVERSATION === 'true') {
        save_convo(userData[userData.length-1].conversation_id,
          userInput,
          userData[userData.length-1].cypher,
          'gpt-4',
          user?.name,
          userData[userData.length-1].text,
          null,
          null,
          user?.email,
          selectedAgentKey,
          'Backend')
      }
  };

  async function runCypher(cypher:string){
    //  var resp = await runNeoApi(selectedAgentKey, cypher,{})
     console.log('Cypher Query Generated by LLM \n' , cypher);
     let isUserDefined = getAgentByKey(selectedAgentKey)?.userDefined;
     var neoResponse:any = await ExecuteCypher(isUserDefined, selectedAgentKey, cypher, {});
     console.log('Result from Neo4j' , neoResponse.result);
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

export default ApplicationContent;


