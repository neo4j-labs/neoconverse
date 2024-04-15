WITH {
MicrosoftGraph: "###
Node Labels and Properties

EmailMessage: conf_neutral:String,sentiment:String,conf_positive:String,conf_negative:String,subject:String,id:String,sentDateTime:DateTime
EmailContent: content:String,id:String
Internal: originalEmail:String,email:String,anonEmail:String
EmailAddress: originalEmail:String,email:String,anonEmail:String
Entity: type:String,subType:String,text:String
SEntity: type:String,text:String
PersonOfInterest: originalEmail:String,email:String
EmailMessage,Forwarded: conf_neutral:String,sentiment:String,conf_positive:String,conf_negative:String,subject:String,id:String,sentDateTime:DateTime
WatchTerm: alt:StringArray,severity:String,term:String,category:String

Accepted graph traversal paths

(:EmailAddress)<-[:FROM]-(:EmailMessage)-[:TO]->(:EmailAddress)
(:PersonOfInterest)<-[:FROM]-(:EmailMessage)-[:TO]->(:PersonOfInterest),
(:EmailMessage)-[:TO]->(:PersonOfInterest),
(:PersonOfInterest)<-[:TO]-(:EmailMessage)
(:EmailAddress)<-[:FROM]-(:EmailMessage:Forwarded)-[:TO]->(:EmailAddress),
(:EmailMessage)-[:CONTENT]->(:EmailContent),
(:EmailMessage)-[:FORWARD_OF]->(:EmailMessage:Forwarded)
(:EmailMessage)-[:WATCH_TERM]->(:WatchTerm),
(:EmailMessage)-[:SUBJECT_ENTITY]->(:Entity)
(:EmailContent)-[:CONTENT_ENTITY]->(:Entity),
(:EmailMessage)-[:CONTENT]->((:EmailContent)-[:CONTENT_ENTITY]->(:Entity),
(:WatchTerm)<-[:WATCH_TERM]-(:EmailMessage)-[:CONTENT]->(:EmailContent)-[:CONTENT_ENTITY]->(:Entity)
###",
//RealEstate: "",
PatientJourney: "###

Node Labels and Properties

Encounter, [date:DateTime, baseCost:Double, code:String, claimCost:Double, patientAge:Long, description:String, end:DateTime, coveredAmount:Double, id:String, class:String, isEnd:Boolean]
Patient:,	[firstName:String, lastName:String, marital:String, ethnicity:String, race:String, gender:String, city:String, deathDate:String, id:String, birthDate:DateTime, SSN:String]
Provider,	[name:String, speciality:String, id:String]
Payer,	[zip:String, name:String, state:String, address:String, id:String, city:String]
Organization,	[name:String, id:String]
Drug,	[description:String, code:String]
Condition,	[description:String, code:String, num:Long]
CarePlan,	[description:String, code:String]
Allergy,	[description:String, code:String]
Address,	[location:Point, address:String]
Procedure,	[description:String, code:String]
Observation,	[6299-2:Double, 9279-1:Double, 6298-4:Double, 20565-8:Double, 29463-7:Double, 72514-3:Double, 1920-8:Double, 72166-2:String, 1751-7:Double, 4548-4:Double, 8867-4:Double, 8302-2:Double, 8462-4:Double, 10834-0:Double, 8480-6:Double, 49765-1:Double, 2571-8:Double, 2947-0:Double, 2885-2:Double, 18262-6:Double, 6768-6:Double, 2093-3:Double, 59576-9:Double, 1742-6:Double, 1975-2:Double, 2339-0:Double, 38483-4:Double, 2069-3:Double, 2085-9:Double, 14959-1:Double, 39156-5:Double, 33914-3:Double]
JourneyPath,	[id:String]

Accepted graph traversal paths

(:Condition)-[:LEADS_TO]->(:Condition)
(:Encounter)-[:HAS_ALLERGY]->(:Allergy)
(:Encounter)-[:HAS_CARE_PLAN]->(:CarePlan)
(:Encounter)-[:HAS_CONDITION]->(:Condition)
(:Encounter)-[:HAS_DRUG]->(:Drug)
(:Encounter)-[:HAS_OBSERVATION]->():Observation
(:Encounter)-[:HAS_PAYER]->(:Payer)
(:Encounter)-[:HAS_PROCEDURE]->(:Procedure)
(:Encounter)-[:HAS_PROVIDER]->(Provider)
(:Encounter)-[:NEXT]->(:Encounter)
(:Organization)-[:HAS_ADDRESS]->(:Address)
(:Patient)-[:HAS_ADDRESS]->(:Address)
(:Patient)-[:HAS_ENCOUNTER]->(:Encounter)
(:Patient)-[:INSURANCE_END]->(:Payer)
(:Patient)-[:INSURANCE_START]->(:Payer)
(:Provider)-[:BELONGS_TO]->(:Organization)
(:Provider)-[:HAS_ADDRESS]->(:Address)

###",
BIGraph: "###
Node Labels and Properties

[Computer, VM],[computerID:String, hostName:String, serialNumber:String, domainName:String, model:String, assetTag:String, vendorName:String]
[Computer, Laptop, Server, ATM],[computerID:String, numCores:Long, hostName:String, numSockets:Long, serialNumber:String, domainName:String, model:String, memoryGB:Long, region:String, vendorName:String]
[NetworkInterface],[computerID:Long, MACaddress:String, interfaceID:String, IPAddress:String, type:String, speedGbps:Long]
[IPAddress],[IPAddress:String, ipType:String]
[Domain],[domainName:String, cityAbbrv:String]
[BusinessOrganization],[orgName:String]
[BusinessFunction],[functionName:String]
[BusinessProcess],[businessProcessName:String, parentFunction:String]
[BusinessActivity],[parentProcess:String, parentFunction:String, businessActivityName:String]
[BusinessTask],[businessTaskID:Long, parentActivity:String, parentFunction:String, parentProcess:String, businessTaskName:String, taskSequence:Long]
[Role],[roleName:String, businessRoleName:String, roleDomain:String]
[Employee],[fullName:String, employeeID:Long, region:String, assignedRegion:String]
[Credentials],[userName:String]
[WorkStream],[parentFunction:String, workStreamName:String]
[BusinessProduct, DataConcept],[dataConceptName:String]
[DataAttribute],[dataConceptName:String, dataAttributeName:String]
[DataConceptClass],[conceptClassName:String]
[DataAttributeDomain],[description:String, attributeDomainName:String]
[Vendor],[vendorName:String]
[SoftwareApplication],[appVersion:String, appName:String, appType:String, appAbbrev:String, patchLevel:String, vendorName:String, appAlias:String, cpeProductName:String]
[ApplicationInstance],[region:String, applicationID:String, instanceName:String]
[Sequence],[seqNum:Long]
[PaymentNetwork],[networkName:String, type:String, networkID:String]
[ExternalFeed],[type:String, feedName:String, direction:String, frequency:String]
[DataTransfer],[method:String, dataTransferName:String]
[Building],[location:String, buildingAbbrev:String, isDataCenter:String, buildingID:String]
[HardwareCluster],[clusterOS:String, podNumber:Long, regionClusterID:Long, clusterID:String, region:String, startRack:Long, buildingClusterID:Long]
[JobFunction],[region:String, jobFunction:String]
[Region],[name:String, region:String, numClusters:Long, numDataCenters:Long]
[Campus],[location:String, campus:String]
[Building, DataCenter],[ipFrag:String, buildingAbbrev:String, dcID:Long, location:String, region:String, isDataCenter:Boolean, buildingID:String]
[Pod],[podNumber:Long, ipFragList:StringArray, buildingID:String]
[Rack],[podNumber:Long, buildingID:String, rackNumber:Long]
[NetworkEquipment, PodRouter, Router, DCSwitch, Switch, DCRouter, Firewall, WANRouter, RackSwitch, ],[role:String, serialNum:String, ports_10Gbe:Long, ports_40Gbe:Long, ports_400Gbe:Long, networkPorts:Long, assetTag:String, numBays:Long, ports_100Gbe:Long, manufacturer:String, ports_25Gbe:Long, rackUnits:Long, series:String, model:String]
[InstanceNode],[vcpuAllocation:Long, nodeNum:Long, applicationID:String, diskGBAllocation:Long, memGBAllocation:Long]
[CVE],[assigner:String, CVE_ID:String, description:String, publishedDate:LocalDateTime, lastModifiedDate:LocalDateTime]
[ProblemType],[problemType:String]
[Reference],[name:String, source:String, url:String, tags:String]
[CPE],[product:String, vulnerable:Boolean, vendor:String, name:String, edition:String, update:String, language:String, cpeType:String, version:String]
[SchemaAttributes],[length:Long, objectName:String, attributeName:String, objectOwner:String, schemaName:String, dataType:String]
[SchemaObject],[schemaName:String, objectName:String, objectOwner:String]
[ArticleAttributes],[articleID:String, attributeName:String]
[Article, Publication],[articalType:String, articleID:String, articleName:String]
[Article, Subscription],[articalType:String, articleID:String, articleName:String]
[DataMovement, ETL, Message],[movementType:String, dataMovementName:String]
[CVE_Impact],[severity:String, exploitabilityScore:Double, complexity:String, impactVersion:String, availabilityImpact:String, baseScore:Double, privilegesRequired:String, userInteraction:String, confidentialityImpact:String, scope:String, integrityImpact:String, CVE_ID:String, vector:String, impactScore:Double]
[CVE_Vector],[vectorString:String]
[CPE_Product],[vendorName:String, englishName:String, cpe_product:String]
[Location],[location:String, crimeRiskScore:Double, snowyWeatherRiskScore:Double]
[CrimeEvent, Event],[eventType:String, crimeEventID:String, crimeRiskScore:Double, eventDate:String]
[Event, WeatherEvent],[snowDepth:String, weatherEventID:String, locationName:String, snowfall:String, PRCP:String, snowyWeatherRiskScore:Double, eventDate:String]

Accepted graph traversal paths

 (:Building, DataCenter, Campus, HardwareCluster)-[:IS_IN_REGION]->(:Region)
 (:SoftwareApplication)-[:SENDS_XFER]->(:DataTransfer)
 (:BusinessFunction)-[:HAS_WORKSTREAMS]->(:WorkStream)
 (:Employee)-[:FILLS_POSITON]->(:JobFunction)
 (:BusinessActivity)-[:FIRST_STEP]->(:BusinessTask)
 (:BusinessActivity)-[:LAST_STEP]->(:BusinessTask)
 (:Article, Subscription, SchemaObject, Publication, BusinessProduct, DataConcept)-[:HAS_ATTRIBUTES]->(:ArticleAttributes, SchemaAttributes, DataAttribute)
 (:ExternalFeed)-[:FEED_REQUEST]->(:DataConcept)
 (:CVE)-[:CVE_PROBLEMS]->(:ProblemType)
 (:BusinessProduct)-[:HAS_RELATIONSHIP]->(:BusinessProduct)
 (:BusinessProduct)-[:HAS_RELATIONSHIP]->(:DataConcept)
 (:DataConcept)-[:HAS_RELATIONSHIP]->(:BusinessProduct)
 (:DataConcept)-[:HAS_RELATIONSHIP]->(:DataConcept)
 (:Message)-[:IMPLEMENTS_XFER]->(:DataTransfer)
 (:DataMovement)-[:IMPLEMENTS_XFER]->(:DataTransfer)
 (:ETL)-[:IMPLEMENTS_XFER]->(:DataTransfer)
 (:Firewall,WANRouter,PodRouter,Router,Switch,DCSwitch,DCRouter,NetworkEquipment,RackSwitch, NetworkInterface)-[:IS_CONNECTED_TO]->(:Firewall,WANRouter,PodRouter,Router,Switch,DCSwitch,DCRouter,NetworkEquipment,RackSwitch, NetworkInterface)
 (:SoftwareApplication)-[:QUERIES_DATA]->(:BusinessProduct)
 (:SoftwareApplication)-[:QUERIES_DATA]->(:DataConcept)
 (:BusinessFunction)-[:HAS_SUBFUNCTION]->(:BusinessFunction)
 (:SoftwareApplication)-[:WRITES_DATA]->(:DataConcept)
 (:SoftwareApplication)-[:WRITES_DATA]->(:BusinessProduct)
 (:InstanceNode)-[:IS_DEPLOYED_ON]->(:Computer)
 (:InstanceNode)-[:IS_DEPLOYED_ON]->(:Server)
 (:InstanceNode)-[:IS_DEPLOYED_ON]->(:VM)
 (:SoftwareApplication)-[:IS_DEPLOYED_ON]->(:Computer)
 (:SoftwareApplication)-[:IS_DEPLOYED_ON]->(:Server)
 (:SoftwareApplication)-[:IS_DEPLOYED_ON]->(:VM)
 (:SoftwareApplication)-[:SUPPORTS_RTE]->(:SoftwareApplication)
 (:ETL)-[:RECEIVES_DATA]->(:ApplicationInstance)
 (:Message)-[:RECEIVES_DATA]->(:ApplicationInstance)
 (:DataMovement)-[:RECEIVES_DATA]->(:ApplicationInstance)
 (:Building)-[:IS_ON_CAMPUS]->(:Campus)
 (:DataCenter)-[:IS_ON_CAMPUS]->(:Campus)
 (:NetworkInterface)-[:HAS_IP_ASSIGNED]->(:IPAddress)
 (:SoftwareApplication)-[:SUPPORTS_PROCESS]->(:BusinessProcess)
 (:Rack)-[:IS_IN_POD]->(:Pod)
 (:HardwareCluster)-[:IS_IN_POD]->(:Pod)
 (:PaymentNetwork)-[:IS_FEED_FROM]->(:ExternalFeed)
 (:Credentials)-[:HAS_ROLES]->(:Role)
 (:Firewall)-[:IS_IN_RACK]->(:Rack)
 (:Server)-[:IS_IN_RACK]->(:Rack)
 (:Router)-[:IS_IN_RACK]->(:Rack)
 (:PodRouter)-[:IS_IN_RACK]->(:Rack)
 (:WANRouter)-[:IS_IN_RACK]->(:Rack)
 (:DCSwitch)-[:IS_IN_RACK]->(:Rack)
 (:RackSwitch)-[:IS_IN_RACK]->(:Rack)
 (:NetworkEquipment)-[:IS_IN_RACK]->(:Rack)
 (:Switch)-[:IS_IN_RACK]->(:Rack)
 (:Computer)-[:IS_IN_RACK]->(:Rack)
 (:DCRouter)-[:IS_IN_RACK]->(:Rack)
 (:BusinessTask)-[:MODIFIES_DATA]->(:BusinessProduct)
 (:BusinessTask)-[:MODIFIES_DATA]->(:DataConcept)
 (:BusinessProcess)-[:MODIFIES_DATA]->(:BusinessProduct)
 (:BusinessProcess)-[:MODIFIES_DATA]->(:DataConcept)
 (:ApplicationInstance)-[:IMPLEMENTS_DM]->(:DataMovement)
 (:ApplicationInstance)-[:IMPLEMENTS_DM]->(:ETL)
 (:ApplicationInstance)-[:IMPLEMENTS_DM]->(:Message)
 (:BusinessOrganization)-[:PERFORMS_PROCESSES]->(:BusinessProcess)
 (:Server)-[:IS_IN_DATACENTER]->(:DataCenter)
 (:Server)-[:IS_IN_DATACENTER]->(:Building)
 (:Computer)-[:IS_IN_DATACENTER]->(:DataCenter)
 (:Computer)-[:IS_IN_DATACENTER]->(:Building)
 (:Pod)-[:IS_IN_DATACENTER]->(:DataCenter)
 (:Pod)-[:IS_IN_DATACENTER]->(:Building)
 (:HardwareCluster)-[:IS_IN_DATACENTER]->(:DataCenter)
 (:HardwareCluster)-[:IS_IN_DATACENTER]->(:Building)
 (:VM)-[:VIRTUAL_IP]->(:IPAddress)
 (:Computer)-[:VIRTUAL_IP]->(:IPAddress)
 (:BusinessProcess)-[:READS_DATA]->(:BusinessTask)
 (:BusinessProcess)-[:READS_DATA]->(:DataConcept)
 (:BusinessProcess)-[:READS_DATA]->(:BusinessProduct)
 (:BusinessProcess)-[:READS_DATA]->(:SoftwareApplication)
 (:BusinessTask)-[:READS_DATA]->(:BusinessTask)
 (:BusinessTask)-[:READS_DATA]->(:DataConcept)
 (:BusinessTask)-[:READS_DATA]->(:BusinessProduct)
 (:BusinessTask)-[:READS_DATA]->(:SoftwareApplication)
 (:BusinessProduct)-[:READS_DATA]->(:BusinessTask)
 (:BusinessProduct)-[:READS_DATA]->(:DataConcept)
 (:BusinessProduct)-[:READS_DATA]->(:BusinessProduct)
 (:BusinessProduct)-[:READS_DATA]->(:SoftwareApplication)
 (:DataConcept)-[:READS_DATA]->(:BusinessTask)
 (:DataConcept)-[:READS_DATA]->(:DataConcept)
 (:DataConcept)-[:READS_DATA]->(:BusinessProduct)
 (:DataConcept)-[:READS_DATA]->(:SoftwareApplication)
 (:CPE)-[:CPE_IMPACTS]->(:SoftwareApplication)
 (:SoftwareApplication)-[:PRODUCES_FEED]->(:ExternalFeed)
 (:DataAttribute)-[:IS_IN_DOMAIN]->(:DataAttributeDomain)
 (:ApplicationInstance)-[:HAS_NODE]->(:InstanceNode)
 (:Employee)-[:HAS_CREDENTIALS]->(:Credentials)
 (:SoftwareApplication)-[:SIMILAR_TO]->(:SoftwareApplication)
 (:SoftwareApplication)-[:DEFINES_SCHEMA]->(:SchemaObject)
 (:SoftwareApplication)-[:SUPPORTS_OS]->(:SoftwareApplication)
 (:Employee)-[:ISSUED_LAPTOP]->(:Computer)
 (:Employee)-[:ISSUED_LAPTOP]->(:Laptop)
 (:Article)-[:HAS_SUBSCRIPTION]->(:SchemaObject)
 (:Subscription)-[:HAS_SUBSCRIPTION]->(:SchemaObject)
 (:ApplicationInstance)-[:USES_APPSERVER]->(:ApplicationInstance)
 (:BusinessActivity)-[:HAS_TASKS]->(:BusinessTask)
 (:ApplicationInstance)-[:INSTANCE_BUILDING]->(:Building)
 (:ApplicationInstance)-[:INSTANCE_BUILDING]->(:DataCenter)
 (:CPE_Product)-[:CPE_VENDOR]->(:Vendor)
 (:CPE)-[:CPE_VENDOR]->(:Vendor)
 (:DataConcept)-[:IS_IN_CLASS]->(:DataConceptClass)
 (:BusinessProduct)-[:IS_IN_CLASS]->(:DataConceptClass)
 (:BusinessTask)-[:TRIGGERS]->(:ExternalFeed)
 (:BusinessTask)-[:TRIGGERS]->(:BusinessTask)
 (:ExternalFeed)-[:TRIGGERS]->(:ExternalFeed)
 (:ExternalFeed)-[:TRIGGERS]->(:BusinessTask)
 (:SoftwareApplication)-[:HAS_VENDOR]->(:Vendor)
 (:SchemaAttributes)-[:SOURCE_ATTRIBUTE]->(:ArticleAttributes)
 (:DataAttributeDomain)-[:IS_SUBDOMAIN_OF]->(:DataAttributeDomain)
 (:BusinessFunction)-[:HAS_PROCESSES]->(:BusinessProcess)
 (:ExternalFeed)-[:FEED_CONTENTS]->(:DataConcept)
 (:CVE_Impact)-[:HAS_VECTOR]->(:CVE_Vector)
 (:_Bloom_Perspective_)-[:_Bloom_HAS_SCENE_]->(:_Bloom_Scene_)
 (:Article)-[:SUBSCRIBES_TO]->(:Article)
 (:Article)-[:SUBSCRIBES_TO]->(:Publication)
 (:Subscription)-[:SUBSCRIBES_TO]->(:Article)
 (:Subscription)-[:SUBSCRIBES_TO]->(:Publication)
 (:BusinessOrganization)-[:IS_RESPONSIBLE_FOR]->(:BusinessFunction)
 (:SoftwareApplication)-[:IS_INTEGRATED_WITH]->(:SoftwareApplication)
 (:ApplicationInstance)-[:INSTANCE_REGION]->(:Region)
 (:ApplicationInstance)-[:SENDS_DATA]->(:DataMovement)
 (:ApplicationInstance)-[:SENDS_DATA]->(:Message)
 (:ApplicationInstance)-[:SENDS_DATA]->(:ETL)
 (:BusinessProcess)-[:IS_IN_WORKSTREAM]->(:WorkStream)
 (:Location)-[:HAS_CRIME_EVENT]->(:Event)
 (:Location)-[:HAS_CRIME_EVENT]->(:CrimeEvent)
 (:SoftwareApplication)-[:CONTROLS_XFER]->(:DataTransfer)
 (:SoftwareApplication)-[:IS_DEPLOYED_WITH]->(:SoftwareApplication)
 (:Employee)-[:ASSIGNED_TO]->(:DataCenter)
 (:Employee)-[:ASSIGNED_TO]->(:Building)
 (:BusinessTask)-[:REQUIRES_ROLES]->(:Role)
 (:JobFunction)-[:REQUIRES_ROLES]->(:Role)
 (:Employee)-[:IS_EMPLOYEE_IN]->(:BusinessOrganization)
 (:ApplicationInstance)-[:USES_RTE]->(:ApplicationInstance)
 (:DataTransfer)-[:RECEIVES_XFER]->(:SoftwareApplication)
 (:VM)-[:IS_HOSTED_ON]->(:HardwareCluster)
 (:Computer)-[:IS_HOSTED_ON]->(:HardwareCluster)
 (:InstanceNode)-[:RUNTIME_ENVIRONMENT]->(:InstanceNode)
 (:CVE)-[:CVE_AFFECTS]->(:CPE)
 (:SchemaObject)-[:HAS_PUBLICATION]->(:Article)
 (:SchemaObject)-[:HAS_PUBLICATION]->(:Publication)
 (:DataTransfer)-[:XFER_CONTENTS]->(:BusinessProduct)
 (:DataTransfer)-[:XFER_CONTENTS]->(:DataConcept)
 (:CPE)-[:REFERS_TO]->(:CPE_Product)
 (:CPE)-[:REFERS_TO]->(:DataAttribute)
 (:CPE)-[:REFERS_TO]->(:BusinessProduct)
 (:CPE)-[:REFERS_TO]->(:DataConcept)
 (:SchemaAttributes)-[:REFERS_TO]->(:CPE_Product)
 (:SchemaAttributes)-[:REFERS_TO]->(:DataAttribute)
 (:SchemaAttributes)-[:REFERS_TO]->(:BusinessProduct)
 (:SchemaAttributes)-[:REFERS_TO]->(:DataConcept)
 (:SchemaObject)-[:REFERS_TO]->(:CPE_Product)
 (:SchemaObject)-[:REFERS_TO]->(:DataAttribute)
 (:SchemaObject)-[:REFERS_TO]->(:BusinessProduct)
 (:SchemaObject)-[:REFERS_TO]->(:DataConcept)
 (:SoftwareApplication)-[:REQUIRES_RTE]->(:SoftwareApplication)
 (:DataCenter)-[:LOCATED_IN]->(:Location)
 (:Building)-[:LOCATED_IN]->(:Location)
 (:CPE_Product)-[:MAPS_TO_APP]->(:SoftwareApplication)
 (:CVE)-[:HAS_IMPACT]->(:CVE_Impact)
 (:ApplicationInstance)-[:IMPLEMENTS_SCHEMA]->(:SchemaObject)
 (:Computer)-[:HAS_NIC]->(:NetworkInterface)
 (:Server)-[:HAS_NIC]->(:NetworkInterface)
 (:BusinessTask)-[:CREATES_DATA]->(:BusinessProduct)
 (:BusinessTask)-[:CREATES_DATA]->(:DataConcept)
 (:ETL)-[:HAS_ARTICLE]->(:Subscription)
 (:ETL)-[:HAS_ARTICLE]->(:Publication)
 (:ETL)-[:HAS_ARTICLE]->(:Article)
 (:DataMovement)-[:HAS_ARTICLE]->(:Subscription)
 (:DataMovement)-[:HAS_ARTICLE]->(:Publication)
 (:DataMovement)-[:HAS_ARTICLE]->(:Article)
 (:Message)-[:HAS_ARTICLE]->(:Subscription)
 (:Message)-[:HAS_ARTICLE]->(:Publication)
 (:Message)-[:HAS_ARTICLE]->(:Article)
 (:ApplicationInstance)-[:USES_DATABASE]->(:ApplicationInstance)
 (:SoftwareApplication)-[:SUPPORTS_TASK]->(:BusinessTask)
 (:SoftwareApplication)-[:SUPPORTS_APPLICATION]->(:SoftwareApplication)
 (:DataConcept)-[:IDENTIFIED_BY]->(:DataAttribute)
 (:BusinessProduct)-[:IDENTIFIED_BY]->(:DataAttribute)
 (:SoftwareApplication)-[:NEXT]->(:BusinessTask)
 (:SoftwareApplication)-[:NEXT]->(:BusinessProcess)
 (:SoftwareApplication)-[:NEXT]->(:BusinessActivity)
 (:SoftwareApplication)-[:NEXT]->(:SoftwareApplication)
 (:BusinessActivity)-[:NEXT]->(:BusinessTask)
 (:BusinessActivity)-[:NEXT]->(:BusinessProcess)
 (:BusinessActivity)-[:NEXT]->(:BusinessActivity)
 (:BusinessActivity)-[:NEXT]->(:SoftwareApplication)
 (:BusinessProcess)-[:NEXT]->(:BusinessTask)
 (:BusinessProcess)-[:NEXT]->(:BusinessProcess)
 (:BusinessProcess)-[:NEXT]->(:BusinessActivity)
 (:BusinessProcess)-[:NEXT]->(:SoftwareApplication)
 (:BusinessTask)-[:NEXT]->(:BusinessTask)
 (:BusinessTask)-[:NEXT]->(:BusinessProcess)
 (:BusinessTask)-[:NEXT]->(:BusinessActivity)
 (:BusinessTask)-[:NEXT]->(:SoftwareApplication)
 (:BusinessProcess)-[:REQUIRES_DATA]->(:BusinessProduct)
 (:BusinessProcess)-[:REQUIRES_DATA]->(:DataConcept)
 (:Location)-[:HAS_WEATHER_EVENT]->(:WeatherEvent)
 (:Location)-[:HAS_WEATHER_EVENT]->(:Event)
 (:ATM)-[:IS_LOCATED_IN]->(:Building)
 (:ATM)-[:IS_LOCATED_IN]->(:DataCenter)
 (:Computer)-[:IS_LOCATED_IN]->(:Building)
 (:Computer)-[:IS_LOCATED_IN]->(:DataCenter)
 (:BusinessOrganization)-[:HAS_SUBORG]->(:BusinessOrganization)
 (:ArticleAttributes)-[:DEST_ATTRIBUTE]->(:SchemaAttributes)
 (:ApplicationInstance)-[:IS_DEPLOYMENT_OF]->(:SoftwareApplication)
 (:Computer)-[:IS_MEMBER_OF]->(:HardwareCluster)
 (:Server)-[:IS_MEMBER_OF]->(:HardwareCluster)
 (:BusinessProcess)-[:HAS_ACTIVITIES]->(:BusinessActivity)
 (:CVE)-[:CVE_REFERENCES]->(:Reference)
 (:CVE)-[:CVE_VECTOR]->(:CVE_Vector)
 (:SoftwareApplication)-[:SYSTEM_OF_RECORD]->(:DataConcept)
 (:SoftwareApplication)-[:SYSTEM_OF_RECORD]->(:BusinessProduct)
 (:ExternalFeed)-[:IS_FEED_TO]->(:PaymentNetwork)
 (:SoftwareApplication)-[:CONSUMES_FEED]->(:SoftwareApplication)
 (:SoftwareApplication)-[:CONSUMES_FEED]->(:ExternalFeed)
 (:ExternalFeed)-[:CONSUMES_FEED]->(:SoftwareApplication)
 (:ExternalFeed)-[:CONSUMES_FEED]->(:ExternalFeed)
 (:CVE)-[:HAS_IMPACT]->(:CVE_Impact)
###
"
} as models

UNWIND keys(models) as key
WITH key, models[key] as model
MERGE (agent:NeoAgent {agent_name: key})
MERGE (modelPrompt:ModelPrompt {name: key})
SET modelPrompt.prompt = model
MERGE (agent)-[:MODEL_PROMPT]->(modelPrompt)
