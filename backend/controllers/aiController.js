// controllers/aiController.js
const { getAIReply } = require("../services/aiService");

const getAIResponse = async (text) => {
  try {
    return await getAIReply(text);
  } catch (err) {
    console.error("AI Error:", err);
    return "Sorry, I couldn’t process that.";
  }
};

module.exports = { getAIResponse };
