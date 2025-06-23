// routes/feedback.js
const express = require("express");
const router = express.Router();
const { getFeedbackHandler } = require("../controllers/feedbackController");

router.get("/:sessionId", getFeedbackHandler);

module.exports = router;
