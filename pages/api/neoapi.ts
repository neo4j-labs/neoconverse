
//import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import CryptoJS from "crypto-js";
import { NeoDatabaseConstants } from "../../components/database/constants";
import { BackEndAgentQuery } from "../../agents/agentRegistry";
import { Agent } from "../../agents/agent";
import { runCypher } from "../../components/database/callNeo";

export const config = {
  runtime: "edge",
};

// this is to overcome runtime errors where it's looking for window
//   without this you get: err:  [ReferenceError: window is not defined]
if (global && typeof global.window === 'undefined') {
  global.window = {};
  // used in bolt-agent.js
  global.window.navigator = {};
  // we'll pretend that this is our browser
  global.window.navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
}


const NeoDatabaseBackendConfig: Agent = {
  key: NeoDatabaseConstants.BackendDatabaseKey,
  databaseInfo: ("NEXT_PUBLIC_BACKEND_DATABASE" in process.env) ?{
    databaseName: process.env.NEXT_PUBLIC_BACKEND_DATABASE,
    hostUrl: process.env.NEXT_PUBLIC_BACKEND_HOST, 
    username: process.env.NEXT_PUBLIC_BACKEND_UNAME,
    password: process.env.NEXT_PUBLIC_BACKEND_PWD
  }:undefined
}

let NeoAgents: Map<String, Agent> = {};

const initAgents: void = async () => {
  let result = await run(NeoDatabaseConstants.BackendDatabaseKey, BackEndAgentQuery);
  // console.log('neoapi result: ', result);
  result
    .map(row => row.agentInfo)
    .forEach(row => {
      NeoAgents[row.key] = {
        key: row.key,
        databaseInfo: {
          ...row.databaseInfo,
          password: decrypt(row.databaseInfo.password)
        }
      }
      // uncomment this to verify that the db connection passwords are being decrypted successfully
      //console.log(JSON.stringify(NeoAgents, null, 2));
    });
}

const decrypt = (encryptedString) => {
  let bytes = CryptoJS.AES.decrypt(encryptedString, process.env.ENCRYPTION_KEY)
  var decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}

const run = async (agentName:string, cypher:string, options:Map = {}) => {

    let neoAgent = null;
    if (agentName === NeoDatabaseConstants.BackendDatabaseKey) {
      neoAgent = NeoDatabaseBackendConfig;
    } else {
      neoAgent = NeoAgents[agentName];
      if (!neoAgent) {
        // in case an agent has been registered since the app started
        await initAgents();
        neoAgent = NeoAgents[agentName];
        if (!neoAgent) {
          throw new Error(`NeoAgent '${agentName}' is not configured`);
        }
      }
    }

    const databaseInfo = neoAgent.databaseInfo;
    if (!databaseInfo) {
      throw new Error(`NeoAgent '${agentName}' has no configured database`);
    }

    return runCypher(databaseInfo, cypher, options)
}

const handler = async (req: Request): Promise<Response> => {
  //res.status(200).json({ name: 'John Doe' })
  let json = await req.json();
  //console.log('json: ', json);
  const { agentName, cypherQuery, options } = json;
  try {
    //console.log("before run");
    const result = await run(agentName, cypherQuery, options);
    //console.log("result: ", result);
    return Response.json({ result })
  } catch (err) {
    console.log("err: ", err);
    return Response.json({ error: err.toString() }, { status: 500 })
  } 
};

initAgents();

//export default withApiAuthRequired(handler);
export default handler;

