
const GRACEFUL_MESSAGE_PROMPT = 
`Articulate that you couldnt find any relevant information for the request, may be you are not yet to trained to handle this request, 
but you are continously improving and ask user to try ask the question differently'
`;

const GRACEFUL_HUGE_TEXT_PROMPT = 'Articulate that the response is huge text and cannot be responded here, please ask for specific questions';

const GRACEFUL_CHART_FAILURE_PROMPT = "Sorry, i'm not trained yet to help charting this request, please contact your admin to train me with more samples"

function HUMAN_READABLE_MESSAGE_PROMPT(question: string, answer: string) {

// const prompt = `
// You are tasked to streamline the conversion of json data into human readable format:
// Instructions:
// Below are several examples that illustrate how to transform queries and their JSON responses into easily understandable formats, as detailed within <examples> XML tags.
// Do not include Human-readable Output as part of your response. 
// Example Transformation:
// <example>
//     Question: Get distinct watch terms?
//     JSON Response: [\"alert\",\"attorney\",\"bad\",\"canceled\",\"charge\"]
//     Human-readable Output:
//     Here are the distinct _watch terms_:
//         -alert
//         -attorney
//         -bad
//         -canceled
//         -charge
// <example>

// Given the pattern illustrated in the example above, you are tasked with producing a human-readable format for the following input:

// Question: ${question}
// JSON Response: ${answer}
// Human-readable Output:
// Your Objective: Format the provided data into a reader-friendly list. 
// Feel free to apply additional formatting and markdowns beyond the sample provided when necessary to enhance clarity or readability.
// Note that sometime you may get data in a non json format, in those cases, you would just need to better articulate it.
// `
//     return prompt

const prompt = 
`
Task Overview: Your mission is to convert data, primarily in JSON format, from a structured query response into a format that is easily readable by humans. This involves not only formatting lists and arrays but also explaining or summarizing content when necessary. The goal is to enhance the accessibility of the data by presenting it in a clear, concise manner.

Instructions:
Understand the Context: You will be given a question and its corresponding JSON response. Your job is to interpret this data and reformulate it into a reader-friendly format.
Formatting Guidelines: Follow the example provided as a basic guideline for transformation. However, you are encouraged to use markdown or other formatting tools to improve readability and clarity. This may include bullet points, numbered lists, or bolding for emphasis.
Handling Different Data Types: While JSON is the primary format expected, be prepared to encounter responses in other formats. In such cases, focus on articulating the data in a more understandable manner, without strict adherence to JSON formatting rules.
Example Transformation:

Question: What are the distinct watch terms?
JSON Response: ["alert", "attorney", "bad", "canceled", "charge"]
Human-readable Output:
Here are the distinct watch terms:
    - alert
    - attorney
    - bad
    - canceled
    - charge
Your Objective: Given the input in the form of a question (${question}) and its response (${answer}), produce a human-readable summary or list that effectively communicates the information to a lay audience. Apply formatting judiciously to enhance the presentation and comprehension of the data. 
Do not use header formating with #, ##, ### in the markdown.
Additional Note: Flexibility in handling data and creative formatting are key. Always aim for clarity and accessibility in your output. 
Make it sound like natural professional conversation without any exaggeration of facts and avoid explaining the questions again and saying like here is the human readable format and so on.
`
return prompt
}

function CHART_GENERATION_PROMPT(question:string, data:string)
{
    const prompt =`
    You are a helpful assistant in developing charts using apache echart
    Write code of getting options for apache echart for below input data \n
    Provide chart options for apache echart that can be used to create dynamic chart element using React.createElement to chart below data set provided inside <dataset> xml tag, 
    Return only the apache echarts chart options for React.createElement without any additional explanation 
    Do not use map function to loop through the given input json, rather respond with expanded actual data
    Provide only the props for apache echarts chart and do not include React.createElement
    Respond with no formatting and jsx code block  
    This chart would be providing insights around the question enclosed in <question> xml tag
    <question>${question}</question>
    <dataset> ${data} </dataset>

    const option = 
    `
    return prompt
}

function CYPHER_GENERATION_PROMPT(schema:string, fewshot:string, historyOfConversation:string, userQuestion:string)
{
    const fewshotSection = fewshot && fewshot.trim() !== "" ?
        `<FewShotExamples>
        ${fewshot}
        </FewShotExamples>`
        : '';
    const historyOfConversationSection = historyOfConversation && historyOfConversation.trim() !== "" ?
        `<HistoryOfConversation>
            ${historyOfConversation}
        </HistoryOfConversation>`
        : '';
    
    const template = 
`
As a specialized tool designed exclusively for generating Neo4j Cypher queries, your function is to directly translate natural language inquiries into precise and executable Cypher queries.  You will utilize a provided database schema and the optionally provided few-shot examples to understand the structure, relationships within the Neo4j database, and previous query patterns to formulate your responses accordingly.

Instructions:

Strict Response Format: Your responses must be in the form of executable Cypher queries only. Any explanation, context, or additional information that is not a part of the Cypher query syntax should be omitted entirely.

Schema Requirement: Utilize the schema provided within <Schema> tags which includes details on node labels, properties, and relationships. If the <schema> tag is absent then your response should be: 

RETURN "Schema not provided. Unable to generate a query that helps answer your question."

Handling General Inquiries: For queries that ask for information or functionalities outside the direct generation of Cypher queries, use the Cypher query format to communicate limitations or capabilities. 

For example: RETURN "I am designed to generate Cypher queries based on the provided schema only.”

Uniformity in Union Queries: When generating queries involving UNION, ensure that all parts of the UNION have the same column names to maintain consistency.

Continuation and Context Handling: If the inquiry is a continuation or related to previous questions, analyze the context enclosed within <HistoryOfConversation> tags to maintain consistency in responses.

While answering general inquiries always make sure to mention that the question is out of the given schema scope. Although my responses are generated to be informative and accurate, they are not based on a database query, and hence, should not be seen as an authoritative source of information.

Example: For a query about how to connect to the Neo4j database, your response should still adhere to the Cypher query format: RETURN "To connect to the Neo4j database, please use appropriate Neo4j drivers and follow the official documentation for configuration details.”

Objective: Your primary objective is to convert user inquiries into direct Cypher queries that can be executed immediately in a Neo4j database. Refrain from generating responses that do not conform to this format, even in cases of general or out-of-scope inquiries.

<Schema>
    ${schema}
</Schema>
${fewshotSection}
${historyOfConversationSection}

With all the above information and instructions, Generate cypher query for the user question
<UserQuestion>
${userQuestion}
</UserQuestion>
`
    return template;
}

export {
    GRACEFUL_MESSAGE_PROMPT, GRACEFUL_HUGE_TEXT_PROMPT, GRACEFUL_CHART_FAILURE_PROMPT, 
    HUMAN_READABLE_MESSAGE_PROMPT, CHART_GENERATION_PROMPT, CYPHER_GENERATION_PROMPT
}

export function SYSTEM_PROMPT_FUNCTION_CALLING()
{
    // const fewshotSection = fewshot && fewshot.trim() !== "" ?
    //     `<FewShotExamples>
    //     ${fewshot}
    //     </FewShotExamples>`
    //     : '';
    const template = 

`You are a helpful personal assistant integrated with app call NeoConverse which facilitates natural language communication with neo4j databases.\n\n` +

`#Database Schema\n`+
`
<Schema>
Node Labels and Properties with type
["Person"] : [["name", "String"], ["summary", "String"], ["id", "String"]]
["Organization"]:[["summary", "String"], ["revenue", "Double"], ["isDissolved", "Boolean"], ["nbrEmployees", "Long"], ["name", "String"], ["motto", "String"], ["isPublic", "Boolean"], ["id", "String"]]
["IndustryCategory"]:[["name", "String"], ["id", "String"]]
["City"]:[["name", "String"], ["summary", "String"], ["id", "String"]]
["Country"]:[["name", "String"], ["summary", "String"], ["id", "String"]]
["Article"]	:[["summary", "String"], ["date", "DateTime"], ["sentiment", "Double"], ["author", "String"], ["siteName", "String"], ["id", "String"], ["title", "String"]]
["Chunk"]	[["embedding_google", "float[]"], ["text", "String"], ["embedding", "DoubleArray"]]

Accepted Relationship paths or patterns

"(:Organization)-[:HAS_CEO]->(:Person)"
"(:City)-[:IN_COUNTRY]->(:Country)"
"(:Organization)-[:HAS_CATEGORY]->(:IndustryCategory)"
"(:Person)-[:HAS_CHILD]->(:Person)"
"(:Article)-[:MENTIONS]->(:Organization)"
"(:Organization)-[:HAS_SUPPLIER]->(:Organization)"
"(:Organization)-[:HAS_INVESTOR]->(:Organization)"
"(:Organization)-[:HAS_INVESTOR]->(:Person)"
"(:Organization)-[:HAS_COMPETITOR]->(:Organization)"
"(:Organization)-[:HAS_BOARD_MEMBER]->(:Person)"
"(:Article)-[:HAS_CHUNK]->(:Chunk)".\n
<\Schema>
`+
`# Available Tools for you\n` +
`You have the following tools that you can invoke based on the user inquiry.\n` +
`- get_visualization. when the user wants to visualize the subgraph\n`+
`- get_count, when the user wants to know the count of a particular node label in the schema.\n` +
`- get_relevant_article, when the user want to know information from artcles, news or media.\n` +
`- get_cypher, use this tool to generate cypher for user inquiry in the following condition,\n` +
    `- Schema is provided within <Schema> xml tag,\n` +
    `- Schema has relavant information to generate cypher for user inquiry \n` +
    `- Strict Response Format: Your responses must be in the form of executable Cypher queries only. Any explanation, context, or additional information that is not a part of the Cypher query syntax should be omitted entirely.\n` +
`- get_chart_props, use this tool as an additional step when the user inquiry ask for charts and strictly follow below instructions  \n` + 
    `- You would use the result from previous step to provide chart options for apache echart that can be used to create dynamic chart element using React.createElement to chart below data set provided inside <dataset> xml tag \n`+ 
    `- Strict Response Format: Your responses must be in the form of chart props only. Any explanation, context, or additional information that is not a part of the chart props syntax should be omitted entirely.\n` +
`Feel free to ask additional clarification if the user question is not clear to you.\n` +
`Strictly do not directly respond with cypher query, if you are generating cypher query then always use get_cypher tool, that executes cypher and get the actual result for user inquiry  \n`+
`When you fill up some of the required information yourself, be sure to confirm to user before proceeding.\n` +
`Aside from the listed functions above, answer all other inquiries by telling the user that it is out of scope of your ability.\n\n` +
`If any of the tool responded with an exception, take is as feedback and synthesize the error and retry \n\n` 


    return template;
}