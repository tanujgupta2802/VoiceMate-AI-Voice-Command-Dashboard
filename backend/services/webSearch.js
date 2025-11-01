const { search } = require("duckduckgo-search");

async function performWebSearch(query) {
  try {
    const results = await search(query, { maxResults: 3 });
    return results.map((r) => `${r.title}: ${r.body} (${r.url})`).join("\n");
  } catch (err) {
    console.error("Web search error:", err);
    return "No recent web data found.";
  }
}

module.exports = { performWebSearch };
