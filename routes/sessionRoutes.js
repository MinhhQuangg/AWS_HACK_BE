const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// get session by id
router.get('/session/:sessionId', sessionController.getSessionBySessionId);

// get all sessions by scenarios
router.get(
  '/:userId/scenario/:scenarioId',
  sessionController.getSessionsByScenario
);

// get all sessions by user
router.get('/user/:userId', sessionController.getAllSessionsByUserId);

// create session
router.post('/', sessionController.createSession);

// update session
router.put('/:userId/:sessionId', sessionController.updateSession);

// delete session
router.delete('/:userId/:sessionId', sessionController.deleteSession);

module.exports = router;
