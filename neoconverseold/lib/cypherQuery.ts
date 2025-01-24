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

export const GET_SCHEMA_CYPHER = `
CALL apoc.meta.stats() YIELD relTypes 
WITH  KEYS(relTypes) as relTypes 
UNWIND relTypes as rel
WITH rel, split(split(rel, '[:')[1],']') as relationship
WITH rel, relationship[0] as relationship
CALL apoc.cypher.run("MATCH p = " + rel + " RETURN p LIMIT 10", {})
YIELD value
WITH relationship as relationshipType, nodes(value.p) as nodes, apoc.any.properties(nodes(value.p)[0]) as startNodeProps, apoc.any.properties(nodes(value.p)[-1]) as endNodeProps
WITH DISTINCT labels(nodes[0]) as startNodeLabels, relationshipType, labels(nodes[-1]) as endNodeLabels,  KEYS(startNodeProps) as startNodeProps,  KEYS(endNodeProps) as endNodeProps
WITH startNodeLabels, relationshipType, endNodeLabels, COLLECT(endNodeProps) as endNodeProps, COLLECT(startNodeProps) as startNodeProps
WITH startNodeLabels, relationshipType, endNodeLabels, apoc.coll.toSet(apoc.coll.flatten(endNodeProps)) as endNodeProps, apoc.coll.toSet(apoc.coll.flatten(startNodeProps)) as startNodeProps
RETURN COLLECT({source:{label:startNodeLabels , properties:startNodeProps}, relationship:relationshipType, target:{label:endNodeLabels , properties:endNodeProps}}) as schema
`;