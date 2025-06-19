const { db, SCENARIOS_TABLE } = require("../config/dynamodb");
const { QueryCommand, PutCommand, GetCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const createScenario = async (scenarioData) => {
    const item = {
        PK: `SCENARIO#${scenarioData.id}`,
        SK: 'META',
        scenarioId: scenarioData.id,
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

const updateScenario = async (scenarioId, updates) => {
    // Build update expression dynamically
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(updates).forEach(([key, value]) => {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    });

    const params = {
        TableName: SCENARIOS_TABLE,
        Key: {
            PK: `SCENARIO#${scenarioId}`,
            SK: 'META'
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const res = await db.send(new UpdateCommand(params));
    return res.Attributes;
};

const deleteScenario = async (scenarioId) => {
    await db.send(new DeleteCommand({
        TableName: SCENARIOS_TABLE,
        Key: {
            PK: `SCENARIO#${scenarioId}`,
            SK: 'META'
        }
    }));
};

module.exports = {
    createScenario,
    getScenarioById,
    getAllScenarios,
    updateScenario,
    deleteScenario
};