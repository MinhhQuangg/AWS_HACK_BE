const { getFeedback } = require("../db/feedbackRepo");

const getFeedbackHandler = async (req, res) => {
    const { sessionId } = req.params;
    const feedback = await getFeedback(sessionId)
    res.json(feedback);
};

module.exports = { getFeedbackHandler };
