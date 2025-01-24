
import packageInfo from "../../package.json"; 
import { getUser } from '../../pages/api/authHelper';

const AppName = 'NeoConverse'

const trackingEnabled = process.env.NEXT_PUBLIC_SEGMENT_API_KEY ? true : false;

export const Events = {
    AddAgent: "NEOCONVERSE_ADD_AGENT",
    EditAgent: "NEOCONVERSE_EDIT_AGENT",
    RemoveAgent: "NEOCONVERSE_REMOVE_AGENT",
    AskQuestion: "NEOCONVERSE_ASK_QUESTION"
}

export const track = (eventName, eventParams) => {
    if (trackingEnabled) {
        eventParams = eventParams || {};
        eventParams = { 
            ...eventParams, 
            appName: AppName,
            version: packageInfo.version,
            user: {...getUser().user}
        }
        //console.log('eventParams: ', eventParams);
        window.analytics.track(`${eventName}`, eventParams);
    }
}
