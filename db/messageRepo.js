const { db, TABLE_NAME } = require("../config/dynamodb");
const { ulid } = require('ulid')

const createMessage = async (sessionId, sender, text) => {
    const msgId = ulid()
    const item = {
        PK: `SESSION#${sessionId}`,
        SK: `MESSAGE#${msgId}`,
        sender,
        text,
        timestamp: new Date().toISOString()
    }

    await db.put({ TableName: TABLE_NAME, Item: item})
}

const getMessageBySessionId = async (sessionId) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",   // PK exact match SESSION#{id} and SK start with MESSAGE#
        ExpressionAttributeValues: {                                   // to select messages, other session-related items like feedback
            ":pk": `SESSION#${sessionId}`,
            ":sk": "MESSAGE#"
        }
    }

    const res = await db.query(params)
    return res.Items;
}