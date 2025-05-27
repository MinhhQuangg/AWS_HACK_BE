const { db, TABLE_NAME } = require("../config/dynamodb");
const { ulid } = require("ulid")
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const createMessage = async (sessionId, sender, text) => {
    const msgId = ulid();
    const item = {
      PK: `SESSION#${sessionId}`,
      SK: `MESSAGE#${msgId}`,
      sender,
      text,
      timestamp: new Date().toISOString()
    };

    await db.send(new PutCommand({
        TableName: TABLE_NAME, 
        Item: item 
    }));

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
        ScanIndexForward: false,    // sort res descending order based on SK (time - MESSAGE#<ulid>)
        Limit: 1
    }))

    console.log(res)
    return res.Items?.[0] || null
}

const getAllMessages = async (sessionId) => {
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

module.exports = {
    createMessage,
    getLastMessage,
    getAllMessages
 }