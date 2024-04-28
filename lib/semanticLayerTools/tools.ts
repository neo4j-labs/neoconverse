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

export const getCypher = {
    "name": "get_cypher",
    "description": "Use this tool to generate cypher for user inquiry, Always use this tool if you generate cypher query as response",
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

export const getChartProps = {
    "name": "get_chart_props",
    "description": "This tools allows you to execute the function that is relavant to user inquiry and provides you the result back in json format, you would then use that result to generate apache echart chart props ",
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
  "description": "This function help find visualize neo4j graph, You should directly pass back the result of this tool to calling function, calling function will use this result to visualize further  ",
  "parameters": {
    "type": "object",
    "properties": {
      "subGraphName": {
        "type": "string",
        "description": "Name of subgraph to visualize"
      }
    },
    "required": [
      "subGraphName"
    ]
  }
}