const { db, SCENARIOS_TABLE } = require("../config/dynamodb");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ScenarioTopics } = require("../utils/constant")

const getScenarioById = async (scenarioId) => {
    // Return from local constant if it exists
    if (ScenarioTopics.hasOwnProperty(scenarioId)) {
        return {
            scenarioId,
            ...ScenarioTopics[scenarioId]
        };
    }

    // Otherwise, fetch from DynamoDB
    const res = await db.send(new GetCommand({
        TableName: SCENARIOS_TABLE,
        Key: {
            PK: `SCENARIO#${scenarioId}`,
            SK: 'META'
        }
    }));

    return res.Item || null;
};

module.exports = {
    getScenarioById,
};