WITH {
MicrosoftGraph: "Ask: Person of Interest sent emails to external recipients ?
Cypher Query:
MATCH (poi:EmailAddress:PersonOfInterest)<-[:FROM]-(message:EmailMessage)-[:TO]->(recipient),
(message)<-[:FORWARD_OF*1..8]-(forwardedMessage) WHERE message <> forwardedMessage
MATCH (sender)<-[:FROM]-(forwardedMessage)-[:TO]->(fwdRecipient) WHERE NOT fwdRecipient:Internal
RETURN DISTINCT sender.email as person_of_interest_email, fwdRecipient.email as external_recipient_email , forwardedMessage.subject as subject
LIMIT 10
",
PatientJourney: "Ask: Prediabetes disease/condition distribution by race ?
Cypher Query:
MATCH (c:Condition)
WHERE toLower(c.description) contains toLower('Prediabetes')
MATCH (c)-[:HAS_CONDITION]-(e:Encounter)-[:HAS_ENCOUNTER]-(p:Patient)
RETURN c.description, p.race, count(DISTINCT p)"
} as fewshots

UNWIND keys(fewshots) as key
WITH key, fewshots[key] as fewshot
MERGE (agent:NeoAgent {agent_name: key})
MERGE (fewshotPrompt:FewshotPrompt {name: key})
SET fewshotPrompt.prompt = fewshot
MERGE (agent)-[:FEWSHOT_PROMPT]->(fewshotPrompt)
