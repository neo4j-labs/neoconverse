import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import { Model } from "echarts";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt, openAIModel } = (await req.json()) as {
    prompt?: string;
    openAIModel?:string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const system_message = `You are expert in write neo4j cypher queries, You would be given with schema and some additional instruction. 
  Please respond back with exact one cypher query without any further explanation 
  If any of the cypher queries you are writing require UNION, make sure to have same column names in RETURN clause on each part of the query`
  const payload: OpenAIStreamPayload = {
    model: openAIModel??"gpt-4-turbo-preview",
    // model:"gpt-3.5-turbo-16k",
    messages: [
      {role: "system", content: system_message},
      {  role: "user", content: prompt}
    ],
    temperature: 0.0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1500,
    stream: true,
    n: 1,
  };


  const stream = await OpenAIStream(payload);
  // console.log('from server', stream)
  return new Response(stream);
};

//export default withApiAuthRequired(handler);
export default handler;
