const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  DYNAMO_TABLE,
} = require('./env');

const client = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

module.exports = {
  db: docClient,
  TABLE_NAME: DYNAMO_TABLE,
  USERS_TABLE: DYNAMO_TABLE,
  SCENARIOS_TABLE : DYNAMO_TABLE,
};
