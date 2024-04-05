export function SAVE_CONVO_CYPHER( conversationId:string,
    prompt:string,
    cypher: string,
    model:string,
    user:string,
    llmResponse:string,
    likeFlag:string,
    feedback:string,
    email:string,
    currentAgentName:string,
    )  {
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
return ingest_cypher
}