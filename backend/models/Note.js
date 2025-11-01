// backend/models/Note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // optional for now
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
