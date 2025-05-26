const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController");

// get the latest message in a session
router.get("/latest/:sessionId", messageController.getLastMessage);

// get all messages in a session (no pagination)
router.get("/session/:sessionId/all", messageController.getAllMessages);

// send a new message
router.post("/", messageController.sendMessage);

module.exports = router



