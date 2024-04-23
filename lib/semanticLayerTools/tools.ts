export const getCount = {
    "name": "get_count",
    "description": "Get the count of given from neo4j database",
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
    "description": "Use this tool as a last option to generate cypher for user inquiry ",
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
        "function_name": {
          "type": "string",
          "description": "Available tool to use based on user inquiry"
        },
        "function_args": {
            "type": "string",
            "description": "parameters required for that function call "
          }
      },
      "required": [
      ]
    }
}