require("dotenv").config();
const db = require("./config/db");
const commandRoutes = require("./routes/commandRoutes");
const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const actionRoutes = require("./routes/actionRoutes");

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3003',
    'https://voicemate-ai-voice-command-dashboard-n.onrender.com',
    'https://voice-mate-ai-voice-command-dashboa-delta.vercel.app/'  
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use("/api/command", commandRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/actions", actionRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
