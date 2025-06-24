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

/**
 * Downloads the agent data as a JSON file
 */
export function downloadAgentData() {
  const dataArray = JSON.parse(localStorage.getItem(AgentDataDictKey)) || [];

  // Create a blob with the data
  const dataStr = JSON.stringify(dataArray, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'agent-data.json';
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  track(Events.DownloadAgentData, { agentCount: dataArray.length });
}

/**
 * Uploads and imports agent data from a JSON file
 * @param file The JSON file to import
 * @returns Promise that resolves when the import is complete
 */
export function uploadAgentData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const dataArray = JSON.parse(event.target?.result as string);

        // Validate that the data is an array
        if (!Array.isArray(dataArray)) {
          reject(new Error('Invalid data format. Expected an array.'));
          return;
        }

        // Save the data to localStorage
        localStorage.setItem(AgentDataDictKey, JSON.stringify(dataArray));

        track(Events.UploadAgentData, { agentCount: dataArray.length });
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

