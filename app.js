require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
app.use('/user', express.static('public/user'));

// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use('/api/messages', require('./routes/messageRoutes'));
// app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/scenarios", require("./routes/scenarioRoutes"));
app.use('/api/users', userRoutes);
module.exports = app;
