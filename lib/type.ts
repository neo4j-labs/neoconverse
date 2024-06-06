export interface LLMDetails {
    provider?: string;
    openAIKey?: string;
    googleAPIKey?: string;
    awsAccessKeyId?: string;
    awsSecretAccessKey?: string;
    model?:string
  };
  
  export interface Property {
    name: string;
    type: string;
    description: string;
  }
  
  export interface Tool {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: {
        [key: string]: {
          type: string;
          description: string;
        };
      };
      required: string[];
    };
    category: string;
    categorical_input: string;
  }