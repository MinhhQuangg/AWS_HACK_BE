const messageRepo = require("../db/messageRepo");
const sessionRepo = require("../db/sessionRepo");
const sessionRepo = require("../db/sessionRepo");
const aiService = require("../services/aiService"); 
const { MessageRole } = require("../utils/constant");

// POST /
const sendMessage = async (req, res) => {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        // Save user message
        const userMessage = await messageRepo.createMessage(sessionId, MessageRole.USER, message);

        // Get scenarioId from session, then get sessionId
        const session = await sessionRepo.getSession(userId, sessionId);
        const scenarioId = session?.scenarioId;

        const scenario = await scenarioRepo.getScenarioById(scenarioId);
        if (!scenario) {
            return res.status(404).json({ error: "Scenario not found" });
        }
        // Get recent conversation
        const history = await messageRepo.getNRecentMessages(sessionId);

        // AI response
        const aiText = await aiService.getReply(history, scenario);
        const aiMessage = await messageRepo.createMessage(sessionId, MessageRole.AI, aiText);

        res.status(201).json({ userMessage, aiMessage });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /session/:sessionId/all
const getAllMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const messages = await messageRepo.getAllMessagesBySession(sessionId);

        if (!messages || messages.length === 0) {
            return res.status(404).json({ error: "No messages found" });
        }

        res.status(200).json(messages);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// GET /latest/:sessionId
const getLastMessage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const message = await messageRepo.getLastMessage(sessionId);

        if (!message) {
            return res.status(404).json({ error: "No message found" });
        }

        res.status(200).json(message);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getLastMessage,
};
