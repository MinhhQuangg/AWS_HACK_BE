require("dotenv").config();

module.exports = {
    DYNAMO_TABLE: process.env.DYNAMO_TABLE,
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    PORT: process.env.PORT || 5000,
  };