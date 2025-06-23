const { getFeedbackFromDB } = require("../db/feedbackRepo");

const getFeedbackHandler = async (req, res) => {
    const { sessionId } = req.params;
    const feedback = await getFeedbackFromDB(sessionId)
    res.json(feedback);
};

module.exports = { getFeedbackHandler };
