
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { GoogleGenerativeAIStream, OpenAIStream, AWSBedrockAnthropicStream, Message, StreamingTextResponse } from 'ai';
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';
import { experimental_buildAnthropicPrompt } from 'ai/prompts';

import { LLMProvider } from "./llmConstants";

export const talkToLLM = async ({ prompt, provider, model, llmKeys, llmFlags = {} }) => {
    if (!prompt) {
        return new Response("No prompt in the request", { status: 400 });
    }
    let stream = new ReadableStream();
  
    switch(provider) {

        case LLMProvider.GCP:
    
            const GOOGLE_API_KEY = llmKeys["GOOGLE_API_KEY"]!;

            // Create an Google GenAI client
            const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

            // Ask Google GenAI model for a stream of generated content given the prompt
            const gcp_stream = await genAI
                .getGenerativeModel({ model: model })
                .generateContentStream(prompt);

            // Convert the response into friendly text-stream
            stream = await GoogleGenerativeAIStream(gcp_stream);
            break;

        case LLMProvider.OPENAI:

            // Create an OpenAI API client (that's edge friendly!)
            const openai = new OpenAI({apiKey: llmKeys.OPENAI_API_KEY, ...llmFlags});
            
            // Ask OpenAI for a streaming completion given the prompt
            const response = await openai.chat.completions.create({
                model: model,
                max_tokens: 2000,
                stream: true,
                messages:
                [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
            });
    
            // Convert the response into a friendly text-stream
            stream = OpenAIStream(response);
            break;

        case LLMProvider.AWS:
            
            // Create an AWS Bedrock client
            const bedrockClient = new BedrockRuntimeClient({
                region: llmKeys.AWS_REGION ?? 'us-east-1',
                credentials: {
                  accessKeyId: llmKeys.AWS_ACCESS_KEY_ID ?? '',
                  secretAccessKey: llmKeys.AWS_SECRET_ACCESS_KEY ?? '',
                },
              });
              
              // Message format expected by bedrock client
            const messages: Pick<Message, "content" | "role">[] = [
                {
                  content: "You are a helpful assistant",
                  role: "system"
                },
                {
                  content: prompt,
                  role: "user"
                }
              ];
    
            // Ask Claude for a streaming chat completion given the prompt
            const bedrockResponse = await bedrockClient.send(
                new InvokeModelWithResponseStreamCommand({
                  modelId: model,
                  contentType: 'application/json',
                  accept: 'application/json',
                  body: JSON.stringify({
                    prompt: experimental_buildAnthropicPrompt(messages),
                    max_tokens_to_sample: 300,
                  }),
                }),
            );
              
            // Convert the response into a friendly text-stream
            stream = AWSBedrockAnthropicStream(bedrockResponse);
            break;
    }
  
    return new Response(stream);
}