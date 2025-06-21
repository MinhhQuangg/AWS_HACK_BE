const { db, TABLE_NAME } = require("../config/dynamodb");
const { ulid } = require("ulid")
const {
    PutCommand,
    GetCommand,
    DeleteCommand,
    QueryCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb")

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
    
    return res.Items?.[0] || null;
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

    console.log('getAllSessionsByUserId:', res)
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
    deleteSession
}