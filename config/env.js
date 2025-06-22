require("dotenv").config();

module.exports = {
    DYNAMO_TABLE: process.env.DYNAMO_TABLE,
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BEDROCK_CLAUDE_MODEL_ID: process.env.BEDROCK_CLAUDE_MODEL_ID,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    PORT: process.env.PORT || 5000,
  };