import neo4j from "neo4j-driver";

export const runCypher = async (databaseInfo:Map, cypher:string, options:Map = {}) => {

    const url:string = databaseInfo.hostUrl;
    const uid:string = databaseInfo.username;
    const pwd: string = databaseInfo.password; 
    const db:string = databaseInfo.databaseName;
    var session:any 

    var driverConfig = {
        disableLosslessIntegers: true,
        userAgent: `neoconverse-api`
    }
    if (!url.match(/bolt\+s/) && !url.match(/bolt\+ssc/)
     && !url.match(/neo4j\+s/) && !url.match(/neo4j\+ssc/)) {
        driverConfig.encrypted = false;
    }

    let driver = neo4j.driver(url, neo4j.auth.basic(uid, pwd), driverConfig);
    if (db) {
        session = driver.session({database:db});
    } else {
        session = driver.session();
    }
    
    //let results = { headers: [], rows: [] };
    let results = [];
    let runResult = null;
    await session.run(cypher, {}, { 
      timeout: 120000, 
      routing: (options.write === true) ? neo4j.routing.WRITE : neo4j.routing.READ
    })
      .then(result => {
        runResult = result;
        result.records.forEach((record, i) => {
          let oneRecord = {};
          // if (i === 0) {
          //   results.headers = record.keys.slice();
          // }
          record.keys.forEach(key => {
            oneRecord[key] = record.get(key);
          })
          //results.rows.push(oneRecord);
          results.push(oneRecord);
        })
      })

    //console.log('runResult: ', runResult);
    if (options && options.returnResultSummary) {
      return {
        summary: (runResult) ? runResult.summary : {},
        results: results
      }
    } else {
      return results;
    }
}
