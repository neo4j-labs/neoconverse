import { track, Events } from '../components/common/tracking';

const AgentDataDictKey = 'AgentDataDict';

export function addAgent(newData: any) {
    let dataArray = JSON.parse(localStorage.getItem(AgentDataDictKey)) || [];
    const existingIndex = dataArray.findIndex(data => data.title === newData.title);

    let event = null;
    if (existingIndex !== -1) {
        dataArray[existingIndex] = newData;
        event = Events.EditAgent;
    } else {
        dataArray.push(newData);
        event = Events.AddAgent;
    }
    localStorage.setItem(AgentDataDictKey, JSON.stringify(dataArray));

    track(event, { 
        saveConvoOn: newData.saveConvo,
        aiService: newData.aiService
    });      
}

export function removeAgent(title: string) {
    let dataArray = JSON.parse(localStorage.getItem(AgentDataDictKey)) || [];

    const agentToRemove = dataArray.find(data => data.title === title); // only used for tracking

    let modifiedArray = dataArray.filter(data => data.title !== title);
    localStorage.setItem(AgentDataDictKey, JSON.stringify(modifiedArray));

    track(Events.RemoveAgent, (agentToRemove) ? { 
        saveConvoOn: agentToRemove.saveConvo,
        aiService: agentToRemove.aiService
    }: {});      
}

export function loadLocalAgents() {
    const savedData = JSON.parse(localStorage.getItem('AgentDataDict')) || null;
    console.log("savedData from local storage", savedData);
    return savedData;
}

