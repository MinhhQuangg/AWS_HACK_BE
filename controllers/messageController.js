const messageRepo = require("../db/messageRepo");
const aiService = require("../services/aiService"); 
const { MessageRole } = require("../utils/constant");

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

// POST /
const sendMessage = async (req, res) => {
    const { sessionId, text } = req.body;

    if (!sessionId || !text) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const userMessage = await messageRepo.createMessage(sessionId, MessageRole.USER, text);
        
        const aiText = await aiService.getReply(text);
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
        const messages = await messageRepo.getAllMessages(sessionId);

        if (!messages || messages.length === 0) {
            return res.status(404).json({ error: "No messages found" });
        }

        res.status(200).json(messages);
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
