// services/newsService.js
const axios = require("axios");

const getNewsData = async () => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
    const response = await axios.get(url);
    console.log("News API raw response:", response.data);
    const articles = response.data.articles.slice(0, 3);

    let newsSummary = "📰 Top Headlines:\n";
    articles.forEach((a, i) => {
      newsSummary += `${i + 1}. ${a.title}\n`;
    });

    return newsSummary;
  } catch (error) {
    console.error("News API error:", error.response?.data || error.message);
    return "Sorry, I couldn’t fetch news.";
  }
};

module.exports = { getNewsData };
