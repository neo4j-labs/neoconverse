import { PromptProvider } from "../agent";
import { runNeoApi } from "../../components/database/runNeoApi";

export const RealEstateAgentKey = 'RealEstate';

export default class RealEstatePromptProvider implements PromptProvider {
    async getDataModel(): string {
        let schemaCypher:string = "CALL apoc.meta.stats YIELD labels, relTypes"
        let nodePropsCypher:string = "CALL apoc.meta.nodeTypeProperties({sample:3}) YIELD nodeLabels, propertyName, propertyTypes RETURN nodeLabels, COLLECT(propertyName+':'+propertyTypes[0]) as properties"
  
        //let neoDB = NeoAgents.RealEstate.databaseInfo.databaseName;
        // let schema :any = await run(schemaCypher, process.env.NEXT_PUBLIC_REAL_ESTATE_HOST, process.env.NEXT_PUBLIC_REAL_ESTATE_UNAME, process.env.NEXT_PUBLIC_REAL_ESTATE_PWD,neoDB);
        // let nodeProps:any  = await run(nodePropsCypher, process.env.NEXT_PUBLIC_REAL_ESTATE_HOST, process.env.NEXT_PUBLIC_REAL_ESTATE_UNAME, process.env.NEXT_PUBLIC_REAL_ESTATE_PWD,neoDB);
        let schema :any = await runNeoApi(RealEstateAgentKey, schemaCypher, {});
        let nodeProps:any = await runNeoApi(RealEstateAgentKey, nodePropsCypher, {});
  
        let relTypes = Object.keys(schema.result[0].relTypes);
    
        //console.log('relTypes',relTypes);
        var relTypesFiltered : any[] = [];
        relTypes.forEach((relType) => {
            let regex = /\(\)\-\[\:\w+\]\->\(\)$/;
            if(!regex.test(relType))
            {
              relTypesFiltered.push(relType)
            }
          });
        //console.log('relTypesFiltered',relTypesFiltered);
        var ai_context = '"""\nNeo4j database schema has following labels:' +  Object.keys(schema.result[0].labels).toString() + '\n' +'Neo4j schema has following relationships pattern: ' + relTypesFiltered.toString();
        nodeProps.result.forEach(function(parsedRecord:any) {
          ai_context += '\nNode labels '+parsedRecord.nodeLabels.toString()+ ' has following properties: '+ parsedRecord.properties.toString()
        });

        ai_context += `\nWith above neo4j graph model i want to write cypher queries and follow below best practices
        Please make sure the direction of relationship in cypher queries are matches with relationship pattern explained above
        Please apply toLower(p.{property_name}) contains toLower({searchTerm}) pattern on filtering any properties, Respond with just cypher query strictly please
        `
      
        return ai_context;
    }

    async getFewshot(): string {
        return "";        
    }
}

