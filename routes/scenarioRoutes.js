const express = require("express");
const router = express.Router();
const scenarioController = require("../controllers/scenarioController");

// get a specific scenario
router.get("/:scenarioId", scenarioController.getScenarioById);

// get all scenarios (no pagination)
router.get("/all", scenarioController.getAllScenarios);

// create a new scenario
router.post("/", scenarioController.createScenario);

module.exports = router;