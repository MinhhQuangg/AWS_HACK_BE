const sessionRepo = require('../db/sessionRepo');

// POST /sessions
const createSession = async (req, res) => {
  const { userId, scenarioId } = req.body;

  if (!userId || !scenarioId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await sessionRepo.createSession(userId, scenarioId);
    res.status(201).json({ status: 'success', data: session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /sessions/:sessionId
const getSessionBySessionId = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await sessionRepo.getSessionBySessionId(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /sessions/:userId
const getAllSessionsByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sessions = await sessionRepo.getAllSessionsByUserId(userId);
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /:userId/scenario/:scenarioId
const getSessionsByScenario = async (req, res) => {
  const { userId, scenarioId } = req.params;

  try {
    const sessions = await sessionRepo.getSessionsByScenario(
      userId,
      scenarioId
    );
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /sessions/:userId/:sessionId
const updateSession = async (req, res) => {
  const { userId, sessionId } = req.params;
  const updates = req.body;

  if (!userId || !sessionId || !updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Missing required fields or body' });
  }

  try {
    const updated = await sessionRepo.updateSession(userId, sessionId, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Session not found or update failed' });
    }

    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE /sessions/:userId/:sessionId
const deleteSession = async (req, res) => {
  const { userId, sessionId } = req.params;

  if (!userId || !sessionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sessionRepo.deleteSession(userId, sessionId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createSession,
  getSessionBySessionId,
  getAllSessionsByUserId,
  getSessionsByScenario,
  updateSession,
  deleteSession,
};
