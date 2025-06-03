const express = require("express");
const router = express.Router();
const scenarioController = require("../controllers/scenarioController");

// get a specific scenario
router.get("/:scenarioId", scenarioController.getScenario);

// get all scenarios (no pagination)
router.get("/all", scenarioController.getAllScenarios);

// create a new scenario
router.post("/", scenarioController.createScenario);

// update a scenario
router.put("/:scenarioId", scenarioController.updateScenario);

// delete a scenario
router.delete("/:scenarioId", scenarioController.deleteScenario);

module.exports = router;