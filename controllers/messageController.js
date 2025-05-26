const messageRepo = require("../db/messageRepo");

// GET /latest/:sessionId
const getLastMessage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const message = await messageRepo.getLastMessage(sessionId);

        if (!message) {
            return res.status(404).json({ error: "No message found" });
        }

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /
const sendMessage = async (req, res) => {
    const { sessionId, sender, text } = req.body;

    if (!sessionId || !sender || !text) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const message = await messageRepo.createMessage(sessionId, sender, text);
        res.status(201).json(message);
    } catch (err) {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getLastMessage,
};
