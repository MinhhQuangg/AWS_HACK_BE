const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { db, TABLE_NAME } = require("../config/dynamodb");
const { getAllMessagesBySession } = require("../db/messageRepo");
const { getScenarioById } = require("../db/scenarioRepo");

const getFeedbackFromDB = async (sessionId) => {
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

const getFeedback = async (sessionId) => {
    const existing = await getFeedbackFromDB(sessionId);
    if (existing) return existing;

    const { getSessionBySessionId } = require("../db/sessionRepo");

    const session = await getSessionBySessionId(sessionId);
    if (!session) throw new Error("Session not found");

    const scenario = await getScenarioById(session.scenarioId); 
    if (!scenario) throw new Error("Scenario not found");

    const messages = await getAllMessagesBySession(sessionId);
    const feedback = await getFeedbackFromAI(messages, scenario);
    if (!feedback) throw new Error("Failed to generate feedback");

    return await saveFeedback(sessionId, feedback);
}

module.exports = { getFeedback, saveFeedback };
