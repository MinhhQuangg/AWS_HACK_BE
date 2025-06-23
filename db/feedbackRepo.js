const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { db, TABLE_NAME } = require("../config/dynamodb");
const { getAllMessagesBySession } = require("../db/messageRepo");
const { getSessionBySessionId } = require("../db/sessionRepo");
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
    if (existing) return existing

    const session = await getSessionBySessionId(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const scenario = await getScenarioById(session.scenarioId); 

    if (!scenario) return res.status(404).json({ error: "Scenario not found" });

    const messages = await getAllMessagesBySession(sessionId);
    const feedback = await getFeedbackFromAI(messages, scenario);

    if (!feedback) return res.status(500).json({ error: "Failed to generate feedback" });

    const saved = await saveFeedback(sessionId, feedback);
    return saved
}

module.exports = { getFeedback, saveFeedback };
