require("dotenv").config();
const db = require("./config/db");
const commandRoutes = require("./routes/commandRoutes");
const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const actionRoutes = require("./routes/actionRoutes");

const app = express();

app.use(cors());
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
