
WITH '{
	"MicrosoftGraph": {
		"key": "MicrosoftGraph",
		"title": "Enron Email Corpus",
		"icon": "/emaildb.png",
		"description": "The data covers how employees communicate, internally & externally via email conversations and flags any watch terms",
		"dataModelPath": "/enron_model.png",
		"databaseInfo": {
			"databaseName": "<your database name>",
			"hostUrl": "<your database host URL>",
			"username": "<database username>",
			"password": "<database password>"
		},
		"order": 1,
		"isActive": true
	},
	"PatientJourney": {
		"key": "PatientJourney",
		"title": "Patient Journey",
		"icon": "/medicalchat.png",
		"description": "Synthetic dataset of 1.2M patient journeys including procedures, prescriptions, conditions",
		"dataModelPath": "/patientjourney_model.png",
		"databaseInfo": {
			"databaseName": "<your database name>",
			"hostUrl": "<your database host URL>",
			"username": "<database username>",
			"password": "<database password>"
		},
		"order": 2,
		"isActive": true
	}
}' as json

WITH apoc.convert.fromJsonMap(json) AS info
UNWIND keys(info) as key
WITH key, info[key] as info
MERGE (agent:NeoAgent {agent_name: key})
SET agent += {
	title: info.title,
	icon: info.icon,
	description: info.description,
	dataModelPath: info.dataModelPath,
	order: info.order,
	isActive: info.isActive
}
MERGE (db:DBConnection {name: key})
SET db += info.databaseInfo
MERGE (db)-[:DB_HAS_AGENT]->(agent)


