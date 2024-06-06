import { runCypher } from "../components/database/callNeo";
import { talkToLLM } from "../components/llm/llmCommunication";
import { talkToLLM as LLMCall } from "../components/llm/llmCommunicationFuncCall";
import { LLMProvider } from "../components/llm/llmConstants";
import { getAgentByName } from "../agents/agentRegistry";
import { LLMDetails } from "./type";
import { StreamingTextResponse } from 'ai';
import { getCount,getArticleCountBySite,getCypher,getRelevantArticles,getVisualization,getChartProps } from "./function_calling/tools";
import { SYSTEM_PROMPT_FUNCTION_CALLING } from "./prompt"
import { invokeFunctions } from "./function_calling/functions"


export async function GenerateContent(
    invokeFromClient:boolean,
    prompt:string,
    generateCypher:boolean,
    respondwithChart:boolean,
    llmDetails: LLMDetails
){
    let response ;
    const llmRequestParams = {provider:llmDetails.provider, model:llmDetails.model, prompt:prompt }
    let llmResponse = null;
    if (invokeFromClient) {
        console.log('talkToLLM');
        // TODO: get this from localstorage / agent settings once Kumar moves it over
        llmRequestParams.llmKeys = {
            OPENAI_API_KEY: llmDetails.openAIKey,
            GOOGLE_API_KEY: llmDetails.googleAPIKey,
            AWS_ACCESS_KEY_ID: llmDetails.awsAccessKeyId,
            AWS_SECRET_ACCESS_KEY: llmDetails.awsSecretAccessKey
        };
        if (llmDetails.provider === LLMProvider.OPENAI) {
            llmRequestParams.llmFlags = { dangerouslyAllowBrowser: true }
        }
        llmResponse = talkToLLM(llmRequestParams);
    } else {
        console.log('calling /api/llm');
        llmResponse = await invokeService("/api/llm", llmRequestParams);
    }
    
    if(generateCypher)
    {
        const result = await readStream(llmResponse);
        response = await cypherCleanup(result);
    }
    else{
        if(respondwithChart)
        {
            const result = await readStream(llmResponse);
            response = await chartPropsCleanup(result);
        }
        else
        {
            response = llmResponse
        }
    }
    return response;
}

export async function ExecuteCypher(
    invokeFromClient:boolean,
    isSaveConvo:boolean,
    agentName:string, 
    cypherQuery:string, 
    options: {},
){
    let jsonResponse = null;
    if (invokeFromClient) {
        let agent = getAgentByName(agentName);
        if (!agent) {
            throw new Error(`Can't find agent '${agentName}'`);
        }
        let { port, host, protocol, database, username, password } = !isSaveConvo ? agent.connection:agent.convoConnection ;

        protocol = protocol.match(/:\/\/$/) ? protocol : `${protocol}://`;
        let databaseInfo = {
            hostUrl: `${protocol}${host}:${port}`,
            username: username,
            password: password,
            databaseName: database
        }
        let cypherResponse = await runCypher(databaseInfo, cypherQuery, options);
        // adding result key so it looks like it came from the backend
        jsonResponse = {
            result: cypherResponse
        }
    } else {
        const neoRequestParams = {agentName:agentName, cypherQuery:cypherQuery, options:options }
        const neoResponse = await invokeService("/api/neoapi", neoRequestParams);
        const response = await readStream(neoResponse);
        jsonResponse = JSON.parse(response);
    }
    return jsonResponse;
}

async function invokeService(url:string, params:{})
{
    const response = await fetch(url, 
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
            }
        );
    return response
}

async function readStream(_response:StreamingTextResponse)
{
    let response = (_response instanceof Promise) ? await _response : _response;
    const reader = response?.body?.getReader();

    let result = ""
    while (true) {
        const { done, value } = await reader?.read();
        let chunkValue = new TextDecoder("utf-8").decode(value);
        result+=chunkValue;
        if (done) {
            break;
        }
    }
    return result;
}

export async function cypherCleanup(generatedCypher:string){

    // Remove prepended cypher query text from LLM response
    generatedCypher = generatedCypher.toString().trim().replace('Cypher Query:','');
    generatedCypher = generatedCypher.toString().trim().replace('cypher query:','');
    generatedCypher = generatedCypher.toString().trim().replace('cypher:','');
    generatedCypher = generatedCypher.toString().trim().replace('Cypher:','');
    generatedCypher = generatedCypher.toString().trim().replace('cypher','');
    generatedCypher = generatedCypher.toString().trim().replace('Cypher','');

    // Remove markdown quotes
    generatedCypher = generatedCypher.toString().trim().replaceAll('```','');

    if(generatedCypher.startsWith('"')&& generatedCypher.endsWith('"'))
    {
        generatedCypher = generatedCypher.slice(1, -1);
    }
    generatedCypher = await isCypherQuery(generatedCypher)?generatedCypher:"RETURN '" + generatedCypher + "' as response";
    // LLM generated cypher sometimes doesn't have right directionalities in cypher pattern, so removing directions in cypher except known variable length patterns
    // Includes the relationhships where relationship directionalities changes the semantic meaning of the traversal
    if (!(generatedCypher.includes('LEADS_TO') || generatedCypher.includes('NEXT') || generatedCypher.includes('PREVIOUS'))) {
        generatedCypher = generatedCypher.replace(/<-/g, "-");
        generatedCypher = generatedCypher.replace(/->/g,'-');
      }
    
    // Add any additional cypher generation logic here

    return generatedCypher;

}

async function chartPropsCleanup(generatedChartProps:string){

    let chartConfStr = generatedChartProps.replaceAll('```','').replace("json",'').replace("jsx",'').replace("const option =",'')
    chartConfStr =chartConfStr.toString().trim().startsWith("{")? chartConfStr.toString().trim().replace(';',''): "{"+chartConfStr.toString().trim().replace(';','') ;

    // Add any additional cypher generation logic here

    return chartConfStr;

}

async function isCypherQuery(text: string) {
    // Regular expressions to match basic Cypher patterns
    const patterns = [
        /^\s*MATCH\s+/i, // Matches "MATCH" at the start of the string, ignoring leading spaces
        /^\s*CREATE\s+/i, // Matches "CREATE" at the start
        /^\s*RETURN\s+/i, // Matches "RETURN" at the start
        /^\s*MERGE\s+/i, // Matches "MERGE" at the start
        /^\s*WITH\s+/i, // Matches "MERGE" at the start
        /\(\s*:\w+\s*\)/, // Matches node patterns like "(:Label)"
        /-\[\s*:\w+\s*\]-/ // Matches relationship patterns like "-[:REL]-"
    ];

    // Check if the text matches any of the Cypher patterns
    return patterns.some(pattern => pattern.test(text));
}

function removeKeysFromObject<T extends Record<string, any>>(obj: T, keysToRemove: string[]): T {
    // Create a shallow copy of the original object
    const newObj = { ...obj };

    // Remove the specified keys from the new object
    keysToRemove.forEach(key => {
        delete newObj[key];
    });

    return newObj;
  }

export async function InvokeLLMForTool(
    payload:{}
)
{
    const { agent, schema, availableTools, previous, tools, userInput, llmKey, isGraphViz } = payload;
    if (!Array.isArray(tools)) {
        return new Response('Prompt is not in correct format', {
            status: 400,
        })
    }

    let prededinedTools = availableTools.map((item) => {
        const keys: string[] = ["category", "categorical_input"];
        let availableTools_temp = removeKeysFromObject(item, keys)
          return {
            type: "function",
            function: availableTools_temp,
        }
      })

    let inBuiltTools = 
    [
        { type: 'function', function: getCypher },
    ]

    prededinedTools = prededinedTools.concat(inBuiltTools);

    let tools_output = []
    for(let tool of tools) {
        let tool_args = JSON.parse(tool?.function?.arguments)
        let info = [...availableTools.values()].filter((item: Event) => item.name === tool?.function?.name);

        let tool_output = await invokeFunctions(agent, info, tool?.function?.name, tool_args)
        tools_output.push({ 
            tool_call_id: tool?.id, 
            role: 'tool', 
            name: tool?.function?.name, 
            content: JSON.stringify(tool_output, null, 2) 
        })

    }
    // let system_prompt = "You are a helpful assistant suppporting NeoConverse web application that enables natural language interaction with Neo4j databases"
    let system_prompt = SYSTEM_PROMPT_FUNCTION_CALLING(schema)
    let messages = [{ role: 'system', content: system_prompt }]
    if(previous?.length > 0) {
        messages = messages.concat(previous)
    }

    messages.push({ role: 'user', content: userInput })

    messages.push({ role: 'assistant', content: null, tool_calls: tools })
    for(let output_item of tools_output) {
        messages.push(output_item)
    }

    console.log("chat-history for tool: ", messages)

    let llmKeys = {
        OPENAI_API_KEY: llmKey.openAIKey,
        GOOGLE_API_KEY: llmKey.googleAPIKey,
        AWS_ACCESS_KEY_ID: llmKey.awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: llmKey.awsSecretAccessKey
    };

    if(!isGraphViz)
    {
        let llmResponse = LLMCall({chatMessages:messages, tools:prededinedTools,provider:llmKey.provider, model:llmKey.model, llmKeys:llmKeys,llmFlags:{dangerouslyAllowBrowser: true}})
        // const result = await readStream(llmResponse);
        return llmResponse;
    }
    else
    {
        return tools_output[0].content;
    }
}

export async function InvokeLLMForMessage(payload:{})
{
    const userInput = payload.userInput;
    const previousMessages = payload.previous;
    const llmDetails = payload.llmKey;
    const schema = payload.schema;

    if (!userInput) {
        return new Response('Prompt is not in correct format', {
            status: 400,
        })
    }

    // let system_prompt = "You are a helpful assistant suppporting NeoConverse web application that enables natural language interaction with Neo4j databases"
    let system_prompt = SYSTEM_PROMPT_FUNCTION_CALLING(schema)

    let messages = [{ role: 'system', content: system_prompt }]
    if(previousMessages?.length > 0) {
        messages = messages.concat(previousMessages)
    }

    messages.push({ role: 'user', content: userInput })
    console.log("chat-history for message: ", messages)
    // let prededinedTools = payload.availableTools;


    let prededinedTools = payload.availableTools.map((item) => {
        const keys: string[] = ["category", "categorical_input"];
        let availableTools_temp =  removeKeysFromObject(item, keys)
          return {
            type: "function",
            function: availableTools_temp,
        }
      })
      let inBuiltTools = 
      [
          { type: 'function', function: getCypher },
      ]

      prededinedTools = prededinedTools.concat(inBuiltTools);
      // [
    //     { type: 'function', function: getCount },
    //     { type: 'function', function: getRelevantArticles },
    //     { type: 'function', function: getCypher },
    //     { type: 'function', function: getChartProps},
    //     { type: 'function', function: getArticleCountBySite},
    //     { type: 'function', function: getVisualization}
    // ]
    let llmKeys = {
        OPENAI_API_KEY: llmDetails.openAIKey,
        GOOGLE_API_KEY: llmDetails.googleAPIKey,
        AWS_ACCESS_KEY_ID: llmDetails.awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: llmDetails.awsSecretAccessKey
    };

    let llmResponse = LLMCall({chatMessages:messages, tools:prededinedTools,provider:llmDetails.provider, model:llmDetails.model, llmKeys:llmKeys,llmFlags:{dangerouslyAllowBrowser: true}})
    const result = await readStream(llmResponse);
    return result;
}