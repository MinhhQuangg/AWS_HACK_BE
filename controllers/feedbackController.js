const { getFeedbackFromAI } = require("../services/feedbackService");
const { getAllMessagesBySession } = require("../db/messageRepo");
const { getSessionBySessionId } = require("../db/sessionRepo");
const { getScenarioById } = require("../db/scenarioRepo");
const { getFeedbackFromDB } = require("../db/feedbackRepo");

const getFeedbackHandler = async (req, res) => {
    const { sessionId } = req.params;
    const feedback = await getFeedbackFromDB(sessionId)
    res.json(feedback);
};

module.exports = { getFeedbackHandler };
