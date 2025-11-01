// // // // services/aiService.js
// // // const axios = require("axios");

// // // const getAIReply = async (text) => {
// // //   const apiKey = process.env.GROQ_API_KEY;
// // //   const url = "https://api.groq.com/openai/v1/chat/completions";

// // //   const response = await axios.post(
// // //     url,
// // //     {
// // //       model: "llama-3.3-70b-versatile",
// // //       messages: [{ role: "user", content: text }],
// // //     },
// // //     {
// // //       headers: { Authorization: `Bearer ${apiKey}` },
// // //     }
// // //   );

// // //   const reply = response.data.choices[0].message.content;
// // //   return reply;
// // // };

// // // module.exports = { getAIReply };

// // // services/aiService.js
// // const axios = require("axios");

// // const getWebSearchResults = async (query) => {
// //   const serpKey = process.env.SERPAPI_KEY;
// //   const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
// //     query
// //   )}&api_key=${serpKey}`;

// //   try {
// //     const response = await axios.get(url);
// //     const results = response.data.organic_results?.slice(0, 3) || [];
// //     const combinedText = results
// //       .map((r) => `${r.title}: ${r.snippet}`)
// //       .join("\n");
// //     return combinedText || "No recent results found.";
// //   } catch (err) {
// //     console.error("Search error:", err);
// //     return "Couldn't fetch live data.";
// //   }
// // };

// // const getAIReply = async (text) => {
// //   const apiKey = process.env.GROQ_API_KEY;
// //   const url = "https://api.groq.com/openai/v1/chat/completions";

// //   // Step 1: Do web search
// //   const searchData = await getWebSearchResults(text);

// //   // Step 2: Combine user query + search data for Groq
// //   const messages = [
// //     {
// //       role: "system",
// //       content:
// //         "You are a helpful AI assistant that can access recent web information.",
// //     },
// //     {
// //       role: "user",
// //       content: `User Query: ${text}\n\nRecent Web Results:\n${searchData}\n\nNow give the final answer using this data.`,
// //     },
// //   ];

// //   // Step 3: Call Groq model
// //   const response = await axios.post(
// //     url,
// //     {
// //       model: "llama-3.3-70b-versatile",
// //       messages,
// //     },
// //     {
// //       headers: { Authorization: `Bearer ${apiKey}` },
// //     }
// //   );

// //   const reply = response.data.choices[0].message.content;
// //   return reply;
// // };

// // module.exports = { getAIReply };

// const axios = require("axios");

// // 🧠 Simple in-memory context store for each user
// const conversationMemory = new Map();

// // 🌐 Web search function (unchanged)
// const getWebSearchResults = async (query) => {
//   const serpKey = process.env.SERPAPI_KEY;
//   const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
//     query
//   )}&api_key=${serpKey}`;

//   try {
//     const response = await axios.get(url);
//     const results = response.data.organic_results?.slice(0, 3) || [];
//     const combinedText = results
//       .map((r) => `${r.title}: ${r.snippet}`)
//       .join("\n");
//     return combinedText || "No recent results found.";
//   } catch (err) {
//     console.error("Search error:", err);
//     return "Couldn't fetch live data.";
//   }
// };

// // 🤖 AI reply with context + formatted response style
// const getAIReply = async (text, userId = "defaultUser") => {
//   const apiKey = process.env.GROQ_API_KEY;
//   const url = "https://api.groq.com/openai/v1/chat/completions";

//   // 🧠 Step 1: Retrieve previous memory (if any)
//   let memory = conversationMemory.get(userId) || [];

//   // 🌍 Step 2: Web search (same as before)
//   const searchData = await getWebSearchResults(text);

//   // 📝 Step 3: Add new user message to memory
//   memory.push({ role: "user", content: text });
//   memory = memory.slice(-6); // keep last 6 messages only

//   // 🧩 Step 4: Construct messages with improved instructions
//   const messages = [
//     {
//       role: "system",
//       content: `You are a helpful, friendly, and structured AI assistant that can access live web information.
// When you reply:
// - Always greet the user naturally (e.g., "Hey there!" or "Sure, here you go!")
// - Give answers in **clear points** or **numbered lists** if possible.
// - Be concise but informative.
// - Use a polite, confident tone.
// - If the question relates to a previous answer (like "pick one from above"), use the context from the memory below.

// Here’s the previous chat context for awareness: ${JSON.stringify(
//         memory,
//         null,
//         2
//       )}`,
//     },
//     {
//       role: "user",
//       content: `User Query: ${text}\n\nRecent Web Results:\n${searchData}\n\nNow respond following your structured format.`,
//     },
//   ];

//   // 🚀 Step 5: Call Groq model
//   const response = await axios.post(
//     url,
//     {
//       model: "llama-3.3-70b-versatile",
//       messages,
//     },
//     {
//       headers: { Authorization: `Bearer ${apiKey}` },
//     }
//   );

//   const reply = response.data.choices[0].message.content;

//   // 💾 Step 6: Save AI reply in memory for future context
//   memory.push({ role: "assistant", content: reply });
//   conversationMemory.set(userId, memory);

//   // ✅ Step 7: Return AI reply
//   return reply;
// };

// module.exports = { getAIReply };

const axios = require("axios");

// 🧠 Simple in-memory context store for each user
const conversationMemory = new Map();

// 🌐 Web search function (unchanged)
const getWebSearchResults = async (query) => {
  const serpKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
    query
  )}&api_key=${serpKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.organic_results?.slice(0, 3) || [];
    const combinedText = results
      .map((r) => `${r.title}: ${r.snippet}`)
      .join("\n");
    return combinedText || "No recent results found.";
  } catch (err) {
    console.error("Search error:", err);
    return "Couldn't fetch live data.";
  }
};

// 🤖 AI reply with context + natural conversational style
const getAIReply = async (text, userId = "defaultUser") => {
  const apiKey = process.env.GROQ_API_KEY;
  const url = "https://api.groq.com/openai/v1/chat/completions";

  // 🧠 Step 1: Retrieve previous memory (if any)
  let memory = conversationMemory.get(userId) || [];

  // 🌍 Step 2: Detect if search is needed
  const needsSearch =
    /weather|news|current|today|latest|price|stock|cricket|match|score/i.test(
      text
    );
  let searchData = "";

  if (needsSearch) {
    searchData = await getWebSearchResults(text);
  }

  // 📝 Step 3: Add new user message to memory
  memory.push({ role: "user", content: text });
  memory = memory.slice(-8); // keep last 8 messages for better context

  // 🧩 Step 4: Improved system prompt for natural responses
  const messages = [
    {
      role: "system",
      content: `You are VoiceMate, a friendly and helpful AI assistant. Keep responses natural and conversational.

**Response Guidelines:**
- For simple greetings (hello, hi, hey) → Respond warmly in 1-2 sentences
- For general questions → Give clear, direct answers in 2-4 sentences
- For complex topics → Use bullet points or numbered lists ONLY when truly needed
- Always maintain a friendly, casual tone like talking to a friend
- Avoid unnecessary web search references unless specifically asked
- Keep answers concise - don't over-explain simple things
- Remember previous context from this conversation

**Examples:**
User: "Hello"
You: "Hey there! How can I help you today? 😊"

User: "What's the weather?"
You: "Let me check the latest weather for you. [then provide brief weather info]"

User: "Tell me about AI"
You: "AI stands for Artificial Intelligence - it's technology that enables machines to learn and perform tasks that typically require human intelligence, like understanding language, recognizing images, and making decisions."

Previous conversation context:
${memory
  .slice(-4)
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n")}`,
    },
    {
      role: "user",
      content: searchData ? `${text}\n\nWeb Results: ${searchData}` : text,
    },
  ];

  // 🚀 Step 5: Call Groq model with adjusted parameters
  const response = await axios.post(
    url,
    {
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7, // More natural/creative responses
      max_tokens: 300, // Limit length to keep responses concise
      top_p: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const reply = response.data.choices[0].message.content.trim();

  // 💾 Step 6: Save AI reply in memory for future context
  memory.push({ role: "assistant", content: reply });
  conversationMemory.set(userId, memory);

  // ✅ Step 7: Return AI reply
  return reply;
};

module.exports = { getAIReply };
