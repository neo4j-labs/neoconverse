
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
    Ask: Can you summarize this data  ?
    Response:
    [{"severity":"CRITICAL","availabilityImpact":"HIGH","exploitabilityScore":3.9,"complexity":"LOW","confidentialityImpact":"HIGH","integrityImpact":"HIGH","affectedSoftware":"Oracle Database 18c","datacenter_location":null,"impactedApps":[["Finacle Core Banking"]],"application_instance_count":0,"impactedDomain":null},{"severity":"CRITICAL","availabilityImpact":"HIGH","exploitabilityScore":3.9,"complexity":"LOW","confidentialityImpact":"HIGH","integrityImpact":"HIGH","affectedSoftware":"Oracle Database 19c","datacenter_location":"Brighton, NY, USA","impactedApps":[["Finacle Core Banking"],["Finacle Corporate Banking Suite"],["Finacle Digital Engagement Suite"],["Finacle Payments Suite"],["Finacle Liquidity Management"]],"application_instance_count":12,"impactedDomain":"mybank.eu.uk"},{"severity":"CRITICAL","availabilityImpact":"HIGH","exploitabilityScore":3.9,"complexity":"LOW","confidentialityImpact":"HIGH","integrityImpact":"HIGH","affectedSoftware":"Oracle Database 19c","datacenter_location":"Southwark, London, UK","impactedApps":[["Finacle Core Banking"],["Finacle Corporate Banking Suite"],["Finacle Digital Engagement Suite"],["Finacle Payments Suite"],["Finacle Liquidity Management"]],"application_instance_count":12,"impactedDomain":"mybank.eu.uk"},{"severity":"CRITICAL","availabilityImpact":"HIGH","exploitabilityScore":3.9,"complexity":"LOW","confidentialityImpact":"HIGH","integrityImpact":"HIGH","affectedSoftware":"Oracle Database 19c","datacenter_location":"Cyberport, Hong Kong, CN","impactedApps":[["Finacle Core Banking"],["Finacle Corporate Banking Suite"],["Finacle Digital Engagement Suite"],["Finacle Payments Suite"],["Finacle Liquidity Management"]],"application_instance_count":24,"impactedDomain":"mybank.apo.hk"},{"severity":"CRITICAL","availabilityImpact":"HIGH","exploitabilityScore":3.9,"complexity":"LOW","confidentialityImpact":"HIGH","integrityImpact":"HIGH","affectedSoftware":"Oracle Database 19c","datacenter_location":"Manhattan, NY, USA","impactedApps":[["Finacle Core Banking"],["Finacle Corporate Banking Suite"],["Finacle Digital Engagement Suite"],["Finacle Payments Suite"],["Finacle Liquidity Management"]],"application_instance_count":12,"impactedDomain":"mybank.us.com"}]
    Output:
    The CVE-2019-17571 has a high impact on the availability of Oracle WebLogic Server across multiple datacenter locations including Jurong East, Singapore; Deerfield, IL, USA; Cyberport, Hong Kong; Jersey City, NJ, USA; and Matsudo, Tokyo, Japan. It affects various applications such as Finacle Core Banking, Finacle Liquidity Management, Finacle Payments Suite, Finacle Digital Engagement Suite, and Finacle Corporate Banking Suite, with a total of 120 application instances impacted across the mentioned locations. The domains affected include mybank.apo.sg, mybank.us.com, mybank.apo.hk, and mybank.apo.jp.
    - ** Common Vulnerability Details**:
        -   Severity: CRITICAL
        -   Availability Impact: HIGH
        -   Exploitability Score: 3.9
        -   Complexity: LOW
        -   Confidentiality Impact: HIGH
        -   Integrity Impact: HIGH
    - **Availability Impact**: HIGH
    - **Affected Software**: Oracle WebLogic Server
    - **Datacenter Locations**:
    - Jurong East, Singapore, SGP
    - Deerfield, IL, USA
    - Cyberport, Hong Kong, CN
    - Jersey City, NJ, USA
    - Matsudo, Tokyo, JP
    - **Impacted Applications**:
    - Finacle Core Banking
    - Finacle Liquidity Management
    - Finacle Payments Suite
    - Finacle Digital Engagement Suite
    - Finacle Corporate Banking Suite
    - **Total Application Instance Count**: 120
    - **Impacted Domains**:
    - mybank.apo.sg
    - mybank.us.com
    - mybank.apo.hk
    - mybank.apo.jp

    This summary highlights the widespread impact of CVE-2019-17571 on Oracle WebLogic Server, affecting critical banking applications across several global datacenters, indicating a significant threat to the availability of these services.
    Ask: ${question}
    Response:
    ${answer}
    Output: `
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