import { NeoDatabaseConstants } from '../components/database/constants';
import { runNeoApi } from '../components/database/runNeoApi';
import RealEstatePromptProvider from './neo4j/realestate';
import { loadLocalAgents, addAgent, removeAgent } from './localAgents';

export const FrontEndAgentQuery = `
MATCH (dbConnection:DBConnection)-[:DB_HAS_AGENT]->(agent:NeoAgent)
WHERE agent.isActive = true
RETURN { 
    key: agent.agent_name,
    title: agent.title,
    description: agent.description,
    icon: agent.icon,
    dataModelPath: agent.dataModelPath,
    order: agent.order,
    promptParts: {
        dataModel: head([(agent)-[:MODEL_PROMPT]->(model) | model.prompt ]), 
        fewshot: head([(agent)-[:FEWSHOT_PROMPT]->(fewshot) | fewshot.prompt ])
    }
} as agentInfo
ORDER BY agent.order
`;

export const BackEndAgentQuery = `
MATCH (dbConnection:DBConnection)-[:DB_HAS_AGENT]->(agent:NeoAgent)
WHERE agent.isActive = true
RETURN { 
    key: agent.agent_name,
    databaseInfo: dbConnection {.*}
} as agentInfo
`;

const PredefinedPromptProviders = {
    RealEstate: new RealEstatePromptProvider()
}

let remoteAgents = [];
let localAgents = [];

export const getAgents = () => (remoteAgents || []).concat(localAgents || []);
export const getAgentByKey = (key: string) => getAgents().find(agent => agent.key === key);
export const getAgentByName = (title: string) => getAgents().find(agent => agent.title === title);

export const initAgents = async () => {
    remoteAgents = await getRemoteAgents();
    localAgents = loadLocalAgents();
}

export const getRemoteAgents = async () => {
    let result = await runNeoApi(NeoDatabaseConstants.BackendDatabaseKey, FrontEndAgentQuery);
    try {
        let agents = await Promise.all(result?.result?.map(async (row) =>  {
            let agentInfo = row?.agentInfo;
            let promptProvider = PredefinedPromptProviders[agentInfo.key];
            //console.log('agentInfo.key: ', agentInfo.key);
            if (promptProvider) {
                //console.log('using prompt provider');
                agentInfo.promptParts.dataModel = await promptProvider.getDataModel();
                agentInfo.promptParts.fewshot = await promptProvider.getFewshot();
            }
            return agentInfo;
        }));
        return agents
    }
    catch(e)
    {
        return [];
    }
    // return agents;
}

export const getLocalAgents = () => localAgents;

export const saveLocalAgent = (newAgent: any) => {
    const existingIndex = localAgents?.findIndex(data => data.title === newAgent.title)

    if (existingIndex !=null && existingIndex !== -1) {
        localAgents[existingIndex] = newAgent;
    } else {
        if (localAgents == null) {
            localAgents = [];
        }
        localAgents.push(newAgent);
    }

    addAgent(newAgent);
}

export const removeLocalAgent = (title: string) => {
    removeAgent(title);
    localAgents = localAgents.filter(data => data.title !== title);
}
