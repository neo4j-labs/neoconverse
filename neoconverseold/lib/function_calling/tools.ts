export const getCount = {
    "name": "get_count",
    "description": "Get the count of given node label from neo4j database",
    "parameters": {
      "type": "object",
      "properties": {
        "label": {
          "type": "string",
          "description": "Node label name"
        }
      },
      "required": [
        "label"
      ]
    }
};

export const getRelevantArticles = {
    "name": "get_relevant_article",
    "description": "This function helps skim thought article content and get most similar information around the user ask  ",
    "parameters": {
      "type": "object",
      "properties": {
        "searchTerm": {
          "type": "string",
          "description": "term to search, it could a single word to sentence"
        }
      },
      "required": [
        "searchTerm"
      ]
    }
}

let   cypherIns =  `-Strict Response Format:Make sure to extract the paths into nodes and relationship,  you could use below cypher snippet to extract nodes and relationhsip from path\n`+
`WITH collect(path) as paths
 CALL { WITH paths UNWIND paths AS path UNWIND nodes(path) as node RETURN collect(distinct node) as nodes }
CALL { WITH paths UNWIND paths AS path UNWIND relationships(path) as rel RETURN collect(distinct rel) as rels }
RETURN nodes, rels\n`

export const getCypher = {
    "name": "get_cypher",
    "description": `Use this tool to generate cypher for user inquiry, Always use this tool if you generate cypher query as response, If the cypher query is generated for graph visualization then make sure to return the nodes and relationship using format like below \n ${cypherIns}`,
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "cypher query for user inquiry based on the schema provided to you"
        }
      },
      "required": [
      ]
    }
}

const chartOptionFormat = `{
  "xAxis": {
    "type": "category",
    "data": ["Corrective", "Inspection", "Periodic Maintenance"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "data": [7, 8, 3],
      "type": "bar"
    }
  ]
}`

export const getChartProps = {
    "name": "get_chart_props",
    "description": "This tool generates chart props for apache echarts, and takes the json data as inputs and provides appropiate chart options properties back in a strictly json format"+
    "that can be rendered via apache react echarts dynamically, This tool lets the LLM returns chart props in json format without any additional instructions and formating" +
    " A sample response would like below, and strictly must adhere to this response format"+chartOptionFormat,
    "parameters": {
      "type": "object",
      "properties": {
        "data": {
          "type": "string",
          "description": "data to plotting the charts"
        },
      },
      "required": [
        "data"
      ]
    }
}

export const getArticleCountBySite = {
  "name": "get_article_count_by_site",
  "description": "This function help find article count by year and month for given site name  ",
  "parameters": {
    "type": "object",
    "properties": {
      "siteName": {
        "type": "string",
        "description": "Site name where the arcticles are published"
      }
    },
    "required": [
      "siteName"
    ]
  }
}

export const getVisualization = {
  "name": "get_visualization",
  "description": "This function help find visualize neo4j graph, This tools allows you to execute the function that is relavant to user inquiry and provides you the result back in in the format of list of nodes and relationships. ",
  "parameters": {
    "type": "object",
    "properties": {
      "graphElements": {
        "type": "string",
        "description": "Json of array or nodes and relationships"
      }
    },
    "required": [
      "graphElements"
    ]
  }
}