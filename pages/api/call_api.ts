
const save_convo = async ( conversationId:string,
    prompt:string,
    cypher: string,
    model:string,
    user:string,
    llmResponse:string,
    likeFlag:string,
    feedback:string,
    email:string,
    currentAgentName:string,
    backendAgent:string
    ) => {
    const res = llmResponse.replace(/"/g, '\\"');
    const cyp = cypher.replace(/"/g, '\\"');

    const ingest_cypher:string = `
    MERGE (n:NeoAgent {agent_name: "${currentAgentName}"})
    MERGE (u:User {email: "${email}"})
    SET u.name = \"${user}\"
    MERGE (cd:ConversationDay {agent_name:"${currentAgentName}", date: date()})
    MERGE (c:Conversation {conversation_id:"${conversationId}"})
    SET c.prompt = "${prompt}",
    c.cypher = "${cyp}",
    c.model ="${model}",
    c.user = "${user}",
    c.response = "${res}",
    c.like_flag = "${likeFlag}",
    c.feedback = "${feedback?.replace(/"/g, '\\"')}",
    c.datetime = datetime()
    MERGE (c)-[:BY_USER]->(u)
    MERGE (n)-[:HAS_CONVERSATION_DAY]->(cd)
    MERGE (cd)-[:HAS_CONVERSATION]->(c)
    RETURN "Successfully save conversation" as result
    `
    let body = {
      agentName: backendAgent, cypherQuery: ingest_cypher, options: { write: true }
    }
  
    const response = await fetch("/api/neoapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("response: ", response)
    if (!response.ok) {
      //throw new Error(response.statusText);
      return { results: [{error: response.statusText}] }
    }

    const data = response.body;
    console.log("response.body: ", response.body)

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let responseText = ''
    
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      responseText += chunkValue;
    }
    let jsonResponse = JSON.parse(responseText);
    console.log('response: ', jsonResponse);
    
    return jsonResponse;
  }

  export default save_convo