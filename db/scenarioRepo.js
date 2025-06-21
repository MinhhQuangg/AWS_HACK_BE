const { db, SCENARIOS_TABLE } = require("../config/dynamodb");
const { QueryCommand, PutCommand, GetCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { ScenarioTopics } = require("../utils/constant")

const createScenario = async (scenarioData) => {
    const item = {
        PK: `SCENARIO#${scenarioData.scenarioId}`,
        SK: 'META',
        scenarioId: scenarioData.scenarioId,
        title: scenarioData.title,
        description: scenarioData.description,
        difficulty: scenarioData.difficulty,
        createdAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
        TableName: SCENARIOS_TABLE,
        Item: item
    }));

    return item;
};

const getScenarioById = async (scenarioId) => {
    const res = await db.send(new GetCommand({
        TableName: SCENARIOS_TABLE,
        Key: {
            PK: `SCENARIO#${scenarioId}`,
            SK: 'META'
        }
    }));

    return res.Item || null;
};

const getAllScenarios = async () => {
    const params = {
        TableName: SCENARIOS_TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "SK = :meta",
        ExpressionAttributeValues: {
          ":meta": "META",
        },
      };

    const res = await db.send(new QueryCommand(params));
    return res.Items;
};

module.exports = {
    createScenario,
    getScenarioById,
    getAllScenarios,
};