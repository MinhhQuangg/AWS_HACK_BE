const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { AWS_REGION, DYNAMO_TABLE } = require("./env");

const client = new DynamoDBClient({ region: AWS_REGION || "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

module.exports = { db: docClient, TABLE_NAME: DYNAMO_TABLE };
