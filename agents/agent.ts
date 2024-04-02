import { DatabaseConnectionInformation } from "../components/database/databaseConnectionInformation";

export type Agent {
    key: string;
    title?: string;
    icon?: string;
    description?: string;
    dataModelPath?: string;
    promptParts?: PromptParts;
    databaseInfo?: DatabaseConnectionInformation;
    order: Integer;
  }

export type PromptParts {
    dataModel?: string;
    fewshot?: string;
} 

export interface PromptProvider {
  async getDataModel(): string;
  async getFewshot(): string;
}
