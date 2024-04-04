
const GRACEFUL_MESSAGE_PROMPT = 
`Articulate that you couldnt find any relevant information for the request, may be you are not yet to trained to handle this request, 
but you are continously improving and ask user to try ask the question differently'
`;

const GRACEFUL_HUGE_TEXT_PROMPT = 'Articulate that the response is huge text and cannot be responded here, please ask for specific questions';

const GRACEFUL_CHART_FAILURE_PROMPT = "Sorry, i'm not trained yet to help charting this request, please contact your admin to train me with more samples"

function HUMAN_READABLE_MESSAGE_PROMPT (question:string, answer:string)
{
    const prompt = `
    Transform below data to human readable format with bullets if needed, And summarize it in a sentence or two if possible
    
    Here is the few shot examples with Ask, Response and expected human readable output format enclosed in <examples> xml tag
    <example>
    Question: 
        Get distinct watch terms ?
    Json Answer:
        [\"alert\",\"attorney\",\"bad\",\"canceled\",\"charge\"]
    Human readable format:
        Here are the distinct watch terms
        - "alert"
        - "attorney"
        - "bad"
        - "canceled"
        - "charge"
    </examples>
    Based on the above example generate a human readable format output for below 
    Question: ${question}
    Json Answer::
    ${answer}
    Human readable format: `
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
    Provide only the props for react-google-charts and do not include React.createElement
    Respond with no formatting and jsx code block  
    This chart would be providing insights around the question enclosed in <question> xml tag
    <question>${question}</question>
    <dataset> ${data} </dataset>

    const option = 
    `
    return prompt
}

export {
    GRACEFUL_MESSAGE_PROMPT, GRACEFUL_HUGE_TEXT_PROMPT, GRACEFUL_CHART_FAILURE_PROMPT, 
    HUMAN_READABLE_MESSAGE_PROMPT, CHART_GENERATION_PROMPT
}