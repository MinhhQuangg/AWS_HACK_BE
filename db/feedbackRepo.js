const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { db, TABLE_NAME } = require("../config/dynamodb");

const getFeedback = async (sessionId) => {
    const res = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: {
        PK: `SESSION#${sessionId}`,
        SK: "FEEDBACK"
        }
    }));
    return res.Item || null;
};

const saveFeedback = async (sessionId, feedback) => {
    const item = {
        PK: `SESSION#${sessionId}`,
        SK: "FEEDBACK",
        feedback,
        createdAt: new Date().toISOString()
    };

    await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item
    }));

    return item;
};

module.exports = { getFeedback, saveFeedback };
