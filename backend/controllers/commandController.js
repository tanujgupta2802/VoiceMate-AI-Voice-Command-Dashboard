// const { getWeatherInfo } = require("./weatherController");
// const { getAIResponse } = require("./aiController");
// const { getNews } = require("./newsController");

// const processCommand = async (req, res) => {
//   try {
//     const { text, userId } = req.body;
//     let intent = "chat";
//     let responseText = "";

//     if (text.toLowerCase().includes("weather")) {
//       intent = "weather";
//       responseText = await getWeatherInfo(text);
//     } else if (text.toLowerCase().includes("news")) {
//       intent = "news";
//       responseText = await getNews();
//     } else {
//       intent = "chat";
//       responseText = await getAIResponse(text); // ✅ fixed
//     }

//     res.json({
//       intent,
//       response: responseText,
//       timestamp: new Date(),
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { processCommand };

const { getWeatherInfo } = require("./weatherController");
const { getAIResponse } = require("./aiController");
const { getNews } = require("./newsController");
const { createNoteHandler } = require("./noteController");

const processCommand = async (req, res) => {
  try {
    const { text, userId } = req.body;
    let intent = "chat";
    let responseText = "";

    if (text.toLowerCase().includes("weather")) {
      intent = "weather";
      responseText = await getWeatherInfo(text);
    } else if (text.toLowerCase().includes("news")) {
      intent = "news";
      responseText = await getNews();
    } else if (text.toLowerCase().includes("note")) {
      intent = "note";

      // extract note content (basic heuristic)
      let content = text;
      const idx = text.toLowerCase().indexOf("note");
      if (idx !== -1) content = text.slice(idx + 4).trim();
      if (!content) content = text;

      // directly call note service
      const { createNote } = require("../services/noteService");
      const note = await createNote({ userId: userId || "anonymous", content });
      responseText = `📝 Note saved: "${note.content}"`;
    } else {
      intent = "chat";
      responseText = await getAIResponse(text);
    }

    res.json({
      intent,
      response: responseText,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { processCommand };
