const { getFeedbackFromAI } = require("../services/feedbackService");
const { getAllMessagesBySession } = require("../db/messageRepo");
const { getSessionBySessionId } = require("../db/sessionRepo");
const { getScenarioById } = require("../db/scenarioRepo");
const { getFeedback, saveFeedback } = require("../db/feedbackRepo");

const getFeedbackHandler = async (req, res) => {
    const { sessionId } = req.params;

    const existing = await getFeedback(sessionId);
    if (existing) return res.json(existing);

    const session = await getSessionBySessionId(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const scenario = getScenarioById(session.scenarioId); 
    if (!scenario) return res.status(404).json({ error: "Scenario not found" });

    const messages = await getAllMessagesBySession(sessionId);
    const feedback = await getFeedbackFromAI(messages, scenario);

    if (!feedback) return res.status(500).json({ error: "Failed to generate feedback" });

    const saved = await saveFeedback(sessionId, feedback);
    res.json(saved);
};

module.exports = { getFeedbackHandler };
