import { ExecuteCypher, cypherCleanup } from "../middleware"

async function getCount({label=""}){
    let query = `MATCH (n:${label}) RETURN COUNT(n) as totalCount `
    let result = await ExecuteCypher(true, false, "Companies",query, {});
    return result;
}

async function getRelevantArticle({searchTerm=""})
{
    let token = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    let model = process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL;
    let query = `WITH genai.vector.encode("${searchTerm}", 'OpenAI', { token: "${token}", model:"${model}" }) AS queryVector
    CALL db.index.vector.queryNodes('news', 3, queryVector) yield node, score
    
    WITH node as c,score
    MATCH (c)<-[:HAS_CHUNK]-(article:Article)
    
    WITH article, collect(distinct c.text) as texts, avg(score) as score
    RETURN apoc.text.regreplace(
    apoc.text.format("Article title: %s sentiment: %f siteName: %s\nsummary: %s\n", 
                     [article.title, article.sentiment, article.siteName, article.summary]) +
    apoc.text.join([ (article)-[:MENTIONS]->(org:Organization) | 
        apoc.text.format("Organization name: %s revenue: %s employees: %s public: %s\nmotto: %s\nsummary: %s\nIndustries: %s\nPeople: \n%s\n",
        [org.name, org.revenue, org.nbrEmployees, org.isPublic, org.motto, org.summary,
        
        apoc.text.join([ (org)-[:HAS_CATEGORY]->(i) | i.name], ", "),
        apoc.text.join([ (org)-[rel]->(p:Person) | 
        
            apoc.text.format("%s: %s %s", 
            [replace(type(rel),"HAS_",""), p.name, p.summary])], "\n")])], "\n") +
    apoc.text.join(texts,"\n"),"\\w+: (null|\n)","") as text, score`
    
    let result = await ExecuteCypher(true, false, "Companies",query, {});
    return result;
}

async function getChartProps({data="" })
{
    return JSON.parse(data);
}

async function getCypher({query=""})
{
    try {
        let cypher = await cypherCleanup(query);
        let result = await ExecuteCypher(true, false, "Companies",cypher, {});
        return result;
    } 
    catch(error) 
    {
        return error
    }
}

async function getVisualization({graphElements=""})
{
    try 
    {
        // let cypher  = 
        // `MATCH path = (o:Organization{name:"${subGraphName}"})<-[]-(a)
        // WITH collect(path) as paths
        // CALL { WITH paths UNWIND paths AS path UNWIND nodes(path) as node RETURN collect(distinct node) as nodes }
        // CALL { WITH paths UNWIND paths AS path UNWIND relationships(path) as rel RETURN collect(distinct rel) as rels }
        // RETURN nodes, rels`

        // let result = await ExecuteCypher(true, false, "Companies",cypher, {});
        // return result;
        return JSON.parse(graphElements);
    }
    catch(error) 
    {
        return error
    }
}

async function getArticleCountBySiteAndMonth({siteName=""})
{
    let siteNameFilter = siteName=="*"?"":`WHERE toLower(a.siteName) = toLower(("${siteName}")`
    let returnClause = siteName!="*"?`RETURN a.siteName, a.date.year as year, a.date.month as month, count(a) as count order by month`
    :`RETURN a.siteName, a.year, COUNT(a) as count order by year LIMIT 10`

    let query = `MATCH (a:Article)-[:MENTIONS]-(o:Organization)-[:HAS_CATEGORY]-(i:IndustryCategory)`+
    `${siteNameFilter}`+
    `${returnClause}`

    let result = await ExecuteCypher(true, false, "Companies",query, {});
    return result;
}
export async function invokeFunctions( function_name="", function_args={} ) {
    
    switch(function_name) {
        case 'get_count':
            return await getCount(function_args)
        case 'get_relevant_article':
            return await getRelevantArticle(function_args)
        case 'get_cypher':
            return await getCypher(function_args)
        case 'get_chart_props':
            return await getChartProps(function_args)
        case 'get_article_count_by_site':
            return await getArticleCountBySiteAndMonth(function_args)
        case 'get_visualization':
            return await getVisualization(function_args)
        default:
            return { error: 'unknown function', message: 'function not found' }
    }

}