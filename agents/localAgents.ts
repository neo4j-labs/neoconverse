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
 * Validates that the agent data meets required criteria
 * @param dataArray The array of agent data to validate
 * @returns An object with validation result and any error message
 */
function validateAgentData(dataArray) {
  // Check that the data is an array
  if (!Array.isArray(dataArray)) {
    return {
      isValid: false,
      error: 'Invalid data format. Expected an array.'
    };
  }

  // Check that each agent has title === key
  for (let i = 0; i < dataArray.length; i++) {
    const agent = dataArray[i];

    // Check that both title and key exist
    if (!agent.title || !agent.key) {
      return {
        isValid: false,
        error: `Agent at index ${i} is missing required title or key field.`
      };
    }

    // Check that title equals key
    if (agent.title !== agent.key) {
      return {
        isValid: false,
        error: `"Agent "${agent.title}" has title and key that don't match. Title: "${agent.title}", Key: "${agent.key}. title and key values must match"`
      };
    }
  }

  return { isValid: true };
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

        // Validate the agent data
        const validation = validateAgentData(dataArray);
        if (!validation.isValid) {
          reject(new Error(validation.error));
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
      reject(new Error('Error reading the file.'));
    };

    reader.readAsText(file);
  });
}


