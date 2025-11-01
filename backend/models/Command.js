const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  commandText: {
    type: String,
    required: true,
  },
  intent: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Command = mongoose.model("Command", commandSchema);
module.exports = Command;
