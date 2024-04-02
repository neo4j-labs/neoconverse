
import { talkToLLM } from "../../components/llm/llmCommunication";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {

    const { prompt, provider, model } = (await req.json()) as {
      prompt?: string;
      provider?:string;
      model:string;
    };

    return talkToLLM({ prompt, provider, model, llmKeys: process.env });
}

export default handler;