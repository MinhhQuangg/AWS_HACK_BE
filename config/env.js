require("dotenv").config();

module.exports = {
    DYNAMO_TABLE: process.env.DYNAMO_TABLE,
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    PORT: process.env.PORT || 5000,
  };