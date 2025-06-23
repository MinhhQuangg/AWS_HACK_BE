const { db, TABLE_NAME } = require("../config/dynamodb");
const { ulid } = require("ulid")
const {
    PutCommand,
    GetCommand,
    DeleteCommand,
    QueryCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb")

const feedbackRepo = require("./feedbackRepo")

const createSession = async (userId, scenarioId) => {
    const sessionId = ulid()
    const item = {
        PK: `USER#${userId}`,
        SK: `SESSION#${sessionId}`,
        sessionId,
        scenarioId,
        startTime: new Date().toISOString(),
        endTime: null,
        rating: 0
    }

    await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item
    }))

    return item
}

const getSessionBySessionId = async (sessionId) => {
    const res = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI3", 
        KeyConditionExpression: "sessionId = :sessionId",
        ExpressionAttributeValues: {
          ":sessionId": sessionId
        }
    }));

    const session = res.Items?.[0];

    if (!session) return null

    if (session.endTime) {
        const feedback = feedbackRepo.getFeedback(sessionId)
    
        if (feedback) {
          session.feedback = feedback;
        }
      }
    
    return session
}

const getAllSessionsByUserId = async (userId) => {
    const res = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":sk": "SESSION#"
        }
    }))

    return res.Items || []
}

const getSessionsByScenario = async (userId, scenarioId) => {
    const res = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        FilterExpression: "scenarioId = :scenarioId",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":sk": "SESSION#",
            ":scenarioId": scenarioId
        }
    }))
  
    return res.Items || []
}

// Update session fields by userId and sessionId
const updateSession = async (userId, sessionId, updates) => {
    const updateKeys = Object.keys(updates);
    if (updateKeys.length === 0) return null;

    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    const UpdateExpressions = [];

    for (const key of updateKeys) {
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = updates[key];
        UpdateExpressions.push(`#${key} = :${key}`);
    }

    const updateExpression = 'SET ' + UpdateExpressions.join(', ');

    try {
        const res = await db.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: {
                PK: `USER#${userId}`,
                SK: `SESSION#${sessionId}`,
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
                ReturnValues: 'ALL_NEW',
            })
        );

        return res.Attributes;
    } catch (err) {
        console.error('UpdateSession error:', err);
        throw err;
    }
};


const deleteSession = async (userId, sessionId) => {
    await db.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
            PK: `USER#${userId}`,
            SK: `SESSION#${sessionId}`,
        }
    }))   
}

module.exports = {
    createSession,
    getSessionBySessionId,
    getAllSessionsByUserId,
    getSessionsByScenario,
    updateSession,
    deleteSession
}