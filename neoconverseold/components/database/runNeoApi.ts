
const debugPrintResponses = false;

export const runNeoApi = async (agentName:string, cypher:string, options:Map = {}) => {
    let body = {
      agentName, cypherQuery: cypher
    }
    if (options) {
      body.options = options;
    }
    const response = await fetch("/api/neoapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (debugPrintResponses) {
      console.log("response: ", response)
    }
    
    if (!response.ok) {
      //throw new Error(response.statusText);
      return { results: [{error: response.statusText}] }
    }

    const data = response.body;
    if (debugPrintResponses) {
      console.log("response.body: ", response.body)
    }

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
    if (debugPrintResponses) {
      console.log('response: ', jsonResponse);
    }
    
    return jsonResponse;
  }
