// controllers/newsController.js
const { getNewsData } = require("../services/newsService");

const getNews = async (text) => {
  try {
    return await getNewsData();
  } catch (err) {
    console.error("News Error:", err);
    return "Sorry, could not fetch news right now.";
  }
};

module.exports = { getNews };
