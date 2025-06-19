const scenarioRepo = require("../db/scenarioRepo");

// GET /:scenarioId
const getScenarioById = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const scenario = await scenarioRepo.getScenarioById(scenarioId);

        if (!scenario) {
            return res.status(404).json({ error: "Scenario not found" });
        }

        res.status(200).json(scenario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /
const createScenario = async (req, res) => {
    const { id, title, difficulty, description } = req.body;

    if (!id || !title || !difficulty || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const scenario = await scenarioRepo.createScenario({
            id,
            title,
            difficulty,
            description
        });
        res.status(201).json(scenario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /all
const getAllScenarios = async (req, res) => {
    try {
        const scenarios = await scenarioRepo.getAllScenarios();

        if (!scenarios || scenarios.length === 0) {
            return res.status(404).json({ error: "No scenarios found" });
        }

        res.status(200).json(scenarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /:scenarioId
const updateScenario = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const updates = req.body;

        // Validate if there are any fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const updatedScenario = await scenarioRepo.updateScenario(scenarioId, updates);

        if (!updatedScenario) {
            return res.status(404).json({ error: "Scenario not found" });
        }

        res.status(200).json(updatedScenario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /:scenarioId
const deleteScenario = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        await scenarioRepo.deleteScenario(scenarioId);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createScenario,
    getScenarioById,
    getAllScenarios,
    updateScenario,
    deleteScenario
};