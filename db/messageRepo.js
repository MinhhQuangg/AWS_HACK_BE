const { db, TABLE_NAME } = require("../config/dynamodb");
const { ulid } = require("ulid")
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { MAX_MESSAGES_IN_CACHE } = require("../utils/constant")
const { getMessages, setMessages } = require("../utils/cache")

const createMessage = async (sessionId, sender, message) => {
    const msgId = ulid();
    const item = {
        PK: `SESSION#${sessionId}`,
        SK: `MESSAGE#${msgId}`,
        sender,
        message,
        timestamp: new Date().toISOString()
    };

    await db.send(new PutCommand({
        TableName: TABLE_NAME, 
        Item: item 
    }));

    // Update cache
    const cached = getMessages(sessionId) || [];
    const updated = [...cached, item].slice(-MAX_MESSAGES_IN_CACHE); // last 10
    setMessages(sessionId, updated);

    return item
};

const getLastMessage = async (sessionId) => {
    const res = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": `SESSION#${sessionId}`,
            ":sk": "MESSAGE#",
        },
        ScanIndexForward: false,  
        Limit: 1
    }))

    return res.Items?.[0] || null
}

const getAllMessagesBySession = async (sessionId) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",   // PK exact match SESSION#{id} and SK start with MESSAGE#
        ExpressionAttributeValues: {                                   // to select messages, other session-related items like feedback
            ":pk": `SESSION#${sessionId}`,
            ":sk": "MESSAGE#"
        }
    }

    const res = await db.send(new QueryCommand(params))
    return res.Items;
}

// key format: recentMessages:<sessionId>
const getNRecentMessages = async (sessionId, limit = MAX_MESSAGES_IN_CACHE) => {
    const cached = getMessages(sessionId)      
    if (cached) return cached;

    const result = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
        ":pk": `SESSION#${sessionId}`,
        ":sk": "MESSAGE#"
        },
        Limit: limit,
        ScanIndexForward: false // most recent first
    }))

    const messages = result.Items.reverse(); // oldest first
    setMessages(sessionId, messages);
    return messages;
};

module.exports = {
    createMessage,
    getLastMessage,
    getAllMessagesBySession,
    getNRecentMessages
 }