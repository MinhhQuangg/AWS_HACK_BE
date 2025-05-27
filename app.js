const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
// app.use("/api/feedback", require("./routes/feedbackRoutes"));
// app.use("/api/scenarios", require("./routes/scenarioRoutes"));

module.exports = app;
