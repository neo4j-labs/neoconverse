import * as React from 'react';
import Button from '@mui/material/Button';

import CodeMirror from '@uiw/react-codemirror';
import { cypher as CypherMode } from "@codemirror/legacy-modes/mode/cypher";
import { StreamLanguage } from "@codemirror/language";
import { GenerateContent, ExecuteCypher } from '../../lib/middleware';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const CypherEditor = (props) => {

    let {
        cypherQuery,
        messageIndex,
        messages,
        setContext,
        setLoading,
        setMessages,
        scrollToBios,
        runCypher,
        isUserDefined,
        llmKey
    } = props;

    const style = {
        background: 'linear-gradient(45deg, #403d39 30%, #403d39 90%)',
        borderRadius: 0,
        border: 0,
        color: 'white',
        height: 33,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px #424242',
    };

    async function correctCypher(cypher:any, index:any){
        const userDataForceRefresh = messages.slice(0);
        userDataForceRefresh[index].cypher = cypher;
        setMessages([...userDataForceRefresh]);
    }

    async function reSubmitCypher(index:any) {
    
        try{
          // console.log('Cypher Query \n' , messages[index].cypher);
          const query = messages[index].cypher;
          var neoResponse:any = await runCypher(query);
          // console.log('Neo4j Result' , neoResponse.result);
    
          let jsonResult1:any = messages[index-1].text+":"+JSON.stringify(neoResponse.result)
    
          var prompt = ""
          // console.log("neoResponse.result).trim()",JSON.stringify(neoResponse.result).trim());
          if(!messages[index].isChart){
              if(neoResponse.result.length ===0)
              {
                prompt = 'Articulate that you couldnt find any relevant information for the request, may be you are not yet to trained to handle this request, but you are continously improving and ask user to try ask the question differently';
    
              }
              else if(neoResponse.result.length > 500){
                prompt = 'Articulate that the response is huge text and cannot be responded here, please ask for specific questions';
              }
              else{
                prompt = `
                Transform below data to human readable format with bullets if needed, And summarize it in a sentence or two if possible
                #Sample Ask and Response :
                Ask: Get distinct watch terms ?
                Response:
                [\"alert\",\"attorney\",\"bad\",\"canceled\",\"charge\"]
                Output:
                Here are the distinct watch terms
                - "alert"
                - "attorney"
                - "bad"
                - "canceled"
                - "charge"
                Ask: Can you summarize the review  ?
                Response:
                Really cute!. Excellent \"little\" machine. Excellent Chromebook and Soft-touch Keyboard. ACE'S HIGH. Great little computers!. Purchased through the Kindle special offer. Phenomenal buy. Fast, Light, Battery life is insane. Get it.. Works great but there are currently some software limitations to be aware of.. Interesting: just not for me.. Outstanding value. A great entry level Chromebook (plus some suggestions for a mid-range Chromebook). Fast, Cheap, and fantastic battery. A very nice computer for the money.. Excellent value, good performance. Acer C720 + Ubuntu 13.10 = Full featured and fast laptop for $200. Acer Chromebook. Great so far.. Wow. I love it!!!!. Light and Easy. No fuss solution. Can not believe how great it is for the money. Happy. Better than I expected. I like it....mostly.  3 1/2 stars!. Great browser. Not for me. No more questions, at last!!. WONDERFUL piece of laptop. Fantastic. Fantastic. Four Stars. First impressions. Very convenient. Great little Device. Acer Chromebook. Bought for 9 year old. love it. Great little device
                Output:
                This review gives a positive assessment of the Acer Chromebook, noting its excellent value and performance. The reviewer mentions its speed, battery life, and affordability as standout features. They also mention using Ubuntu 13.10 on the Chromebook as a way to enhance its capabilities. While there are some software limitations, the review overall describes the Acer Chromebook as a great little device for the money.
                #Generate similar output for below Ask and Response
                Ask: ${messages[index-1].text}
                Response:
                ${JSON.stringify(neoResponse.result)}
                Output: 
                `
              }
          }
          else{
            if(neoResponse.result.length ===0)
            {
              prompt = 'Articulate that you couldnt find any relevant information for the request, may be you are not yet to trained to handle this request, but you are continously improving and ask user to try ask the question differently';
              // prompt = 'Articulate that this user doesnt have previlages to modify the patient informations, Please contact the system administrator at admin@healthcare.com';
    
            }
            else{
              prompt =`
              Write code of getting options for apache echart for below input data \n
              ${messages[index-1].text} \n
              ${JSON.stringify(neoResponse.result).trim()} \n
              const option = 
              `
            }
          }
          // console.log('Prompt \n' , prompt);
       
          if (!messages[index].isChart ) {

          let response1 = await GenerateContent(isUserDefined, prompt, false, messages[index].isChart, llmKey)
          
          const userData = messages.slice(0);
          setMessages([...userData]);
          userData[userData.length-1].text = "";
          const reader = response1?.body?.getReader();
          let responseText1 = ""
          while (true) {
              const { done, value } = await reader?.read();
              let chunkValue = new TextDecoder().decode(value);
              setContext((prev) => prev + chunkValue);
              !userData[index-1].isChart ?  userData[userData.length-1].text = userData[userData.length-1].text + chunkValue : ""
              responseText1+=chunkValue;
              if (done) {
                  break;
              }
          }

          // const response1 = await fetch("/api/generate", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //     "Cache-Control": "no-cache,no-store",
          //   },
          //   body: JSON.stringify({
          //     prompt,
          //   }),
          // });
    
          // // .then(response1 => response1.json())
    
          // if (!response1.ok) {
          //   throw new Error(response1.statusText);
          // }
          
          // // This data is a ReadableStream
          // const data1 = response1.body;
          // if (!data1) {
          //   return;
          // }
    
          // const userData = messages.slice(0);
    
          // setMessages([...userData]);
    
          // const reader1 = data1.getReader();
          // const decoder1 = new TextDecoder();
          // let done1 = false;
          // let responseText1 = ""
          // userData[index].text ="";
          // while (!done1) {
          //   const { value, done: doneReading } = await reader1.read();
          //   done1 = doneReading;
          //   const chunkValue = decoder1.decode(value);
          //   setContext((prev) => prev + chunkValue);
          //   !userData[index-1].isChart ?  userData[index].text = userData[index].text + chunkValue : ""
          //   responseText1+=chunkValue;
          // }
          // console.log('responseText1',responseText1)
          setLoading(false);
          let chartConfStr =responseText1.toString().trim().startsWith("{")? responseText1.toString().trim().replace(';',''): "{"+responseText1.toString().trim().replace(';','') ;
          if (userData[index].isChart  && neoResponse.result.length !=0){
            chartConfStr = JSON.stringify(eval("(" + chartConfStr + ")"));
            userData[userData.length-1].chartData = JSON.parse(chartConfStr);
          }
          else if (userData[index].isChart  && neoResponse.result.length ==0){
            userData[index].chartData = "";
            userData[index].text = "Sorry, i'm not trained yet to help charting this request, please contact your admin to train me with more samples"
          }
        }
        else{

          let response2 = await GenerateContent(isUserDefined, prompt, false, messages[index].isChart, llmKey)

          const reader = response2?.body?.getReader();

          let userDataForceRefresh = messages.slice(0);
          let result="";
          let responseText1=""
          userDataForceRefresh[userDataForceRefresh.length-1].text = "";
          while (true) {
            const { done, value } = await reader?.read();
            let chunkValue = new TextDecoder().decode(value);
            responseText1+=chunkValue;
            setContext((prev) => prev + chunkValue);
            if (done) {
                break;
            }
          }
          !userDataForceRefresh[index-1].isChart ?  userDataForceRefresh[index].text = userDataForceRefresh[index].text + result : "";

          setMessages([...userDataForceRefresh]);

          // const payload1: OpenAIStreamPayload = {
          //   // model:"gpt-35-turbo",
          //   // model:"gpt-3.5-turbo",
          //   messages: [{ role: "user", content: prompt }],
          //   temperature: 0.0,
          //   top_p: 1,
          //   frequency_penalty: 0,
          //   presence_penalty: 0,
          //   max_tokens: 3000,
          //   stream: true,
          //   n: 1,
          // };
          // let responseText1 = ''
          // await fetchEventSource (process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT  as string,{
          //   method:"POST",
          //   headers: {
          //     // "Accept":"text/event-stream",
          //     "Content-type":"application/json",
          //     // "Content-type":"text/event-stream",
          //     Connection: 'keep-alive',
          //     'Cache-Control': 'no-cache',
          //     "api-key":process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY  as string
          //   },
          //   body: JSON.stringify(payload1),
          //   // aysnc onopen(res) {
          //   //   console.log(res);
          //   // },
          //   onmessage(event) {
          //     const data = JSON.parse(event.data);
          //     const text :string = data.choices[0].delta.content;
          //     typeof text !== 'undefined' && text !== null? responseText1+=text:responseText1 = responseText1;
          //     // responseText+=text;
          //     const userDataForceRefresh = messages.slice(0);
          //     typeof text !== 'undefined' && text !== null? !userDataForceRefresh[index-1].isChart ?  userDataForceRefresh[index].text = userDataForceRefresh[index].text + text : "": responseText1 = responseText1;
    
          //     // console.log(text);
    
          //     setMessages([...userDataForceRefresh]);
    
          //   },
          //   onclose() {
          //     console.log("connection closed by the server");
          //     setLoading(false);
          //   },
          //   onerror(err) {
          //     console.log("there is an error from server", err);
          //     messages[index].text = "Sorry, you have reached the max token limit, i can still answer new questions if its fit withing the amount of content i can produce"
          //     messages[index].chartData = "" ;
          //     const userDataForceRefresh = messages.slice(0);
          //     setMessages([...userDataForceRefresh]);
          //   }
          // }
          // )
    
          let chartConfStr =responseText1.toString().trim().startsWith("{")? responseText1.toString().trim().replace(';',''): "{"+responseText1.toString().trim().replace(';','') ;
          // console.log(chartConfStr);
          if (userDataForceRefresh[index-1].isChart && neoResponse.result.length !=0){
            chartConfStr = JSON.stringify(eval("(" + chartConfStr.replace(';','') + ")"));
            messages[index].chartData = JSON.parse(chartConfStr);
          }
          else if (userDataForceRefresh[index-1].isChart && neoResponse.result.length ==0){
            messages[index].chartData = "";
            messages[index].text = "Sorry, i'm not trained yet to help charting this request, please contact your admin to train me with more samples"
          }
          
          userDataForceRefresh = messages.slice(0);
          setMessages([...userDataForceRefresh]);
        }
          // console.log(messages[index].chartData);
          scrollToBios();
        }
        catch (neo4jError){
          // console.log('neo4jError',neo4jError)
          // var prompt =  userInput;
          var prompt = 'Articulate that you couldnt find any relevant information for the request, may be you are not yet to trained to handle this request, but you are continously improving and ask user to try ask the question differently';
    
          // console.log('localContext',prompt);

          let responseText2 = await GenerateContent(isUserDefined, prompt, false, messages[index].isChart, llmKey)

          const reader = responseText2?.body?.getReader();
          messages[index].text = "";
          let result="";
          while (true) {
            const { done, value } = await reader?.read();
            let chunkValue = new TextDecoder().decode(value);
            result+=chunkValue;
            setContext((prev) => prev + chunkValue);
            messages[index].text = messages[index].text + chunkValue
            if (done) {
                break;
            }
          }
  

          // const response = await fetch("/api/generate", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     prompt,
          //   }),
          // });
      
          // if (!response.ok) {
          //   throw new Error(response.statusText);
          // }
      
          // // This data is a ReadableStream
          // const data = response.body;
          // if (!data) {
          //   return;
          // }
          // const reader = data.getReader();
          // const decoder = new TextDecoder();
          // let done = false;
          // let responseText = ''
          // messages[index].text = "";

          // while (!done) {
          //   const { value, done: doneReading } = await reader.read();
          //   done = doneReading;
          //   const chunkValue = decoder.decode(value);
          //   //setGeneratedBios((prev) => prev + chunkValue);
          //   setContext((prev) => prev + chunkValue);
          //   messages[index].text = messages[index].text + chunkValue
          //   responseText+=chunkValue;
          // }
          scrollToBios();
          messages[messages.length-1].chartData = "";
          const userDataForceRefresh = messages.slice(0);
          setMessages([...userDataForceRefresh]);
    
          setLoading(false);
        }
    }
    
    return (
        <>
            <h3>Generated Cypher</h3>
            <CodeMirror  
                value={cypherQuery}
                extensions={[StreamLanguage.define(CypherMode)]}
                onChange={(cypher) => correctCypher(cypher, messageIndex)}
            >
            </CodeMirror>
            <div>
                <Button variant="contained" sx={{  display: "flex",float: "right" }} onClick={(e) => reSubmitCypher(messageIndex)}
                    style={style}
                    >
                    Submit Again
                </Button>
            </div>
        </>
    )
  }

  export default CypherEditor;
