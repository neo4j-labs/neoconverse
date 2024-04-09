
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
Task Overview: Your mission is to convert data—primarily in JSON format—from a structured query response into a format that is easily readable by humans. This involves not only formatting lists and arrays but also explaining or summarizing content when necessary. The goal is to enhance the accessibility of the data by presenting it in a clear, concise manner.

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
Make it sound like natural conversation and avoid explaining the questions again and saying like here is the human readable format and so on.
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
As an advanced Neo4j Cypher query generation system integrated into a conversational interface, 
your role is to convert natural language questions into precise Cypher queries, based on a provided Neo4j database schema 
and, optionally, a few-shot examples. 
Your task is to analyze the database schema, which outlines the structure and relationships within the database, 
and craft EXECUTABLE CYPHER QUERIES tailored to the user's questions.

Key Points:

You will work with a schema defined within <Schema> tags, detailing node labels, their properties, and accepted relationship patterns.
Few-shot examples might be provided within <FewShotExamples> tags to guide your query formulation process.
The conversational context may be enclosed within <HistoryOfConversation> tags to assist with the flow of the dialogue. Please refer to this historical context if the user's inquiry appears to be a continuation or related to previous questions.

While generating queries that involves UNION, make sure to have same column names on all parts of UNION query

Your response must be in the form of executable Cypher queries. For any user question, including those not directly related to database queries, you should still respond with a Cypher query using the RETURN syntax. 
When addressing general inquiries about your functionalities, frame your response as a Cypher query. 

For example, in response to questions about your capabilities, you could generate a query like:
RETURN "I can facilitate your interaction with the Neo4j graph database through simple English, removing the need to directly use Cypher for accessing Neo4j knowledge graphs."

If the database schema is not provided or is empty, your response should be:
RETURN "The schema is not provided, and it is essential for enhancing the chat experience by enabling accurate query generation."

Please adhere to these guidelines when responding to inquiries:
Only answer questions directly related to the provided schema. If the required information is not encapsulated within the <Schema> tag, prompt the user to supply the schema information in the Agent setup.
Refrain from addressing questions that fall outside the scope of the provided schema.
While answering general inquires always make sure to mention that question is out of the given schema scope. Although my responses are generated with an aim to be informative and accurate, they are not based on a database query, and hence, should not be seen as an authoritative source of information.

Your primary goal is to seamlessly translate user inquiries into Cypher queries within given context of database schema, ensuring that each query is ready for direct execution in a Neo4j database without any additional information or markdown.

<Schema>
    ${schema}
</Schema>
${fewshotSection}
${historyOfConversationSection}

user question
${userQuestion}
`
    return template;
}

export {
    GRACEFUL_MESSAGE_PROMPT, GRACEFUL_HUGE_TEXT_PROMPT, GRACEFUL_CHART_FAILURE_PROMPT, 
    HUMAN_READABLE_MESSAGE_PROMPT, CHART_GENERATION_PROMPT, CYPHER_GENERATION_PROMPT
}