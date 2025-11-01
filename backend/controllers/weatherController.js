// const { getWeatherData } = require("../services/weatherService");

// const getWeatherInfo = async (text) => {
//   const cityMatch = text.match(/in\s([a-zA-Z\s]+)/i);
//   const city = cityMatch ? cityMatch[1].trim() : "Delhi";
//   return await getWeatherData(city);
// };

// module.exports = { getWeatherInfo };
const { getWeatherData } = require("../services/weatherService");

const getWeatherInfo = async (text) => {
  // now supports both "in" and "of"
  const cityMatch = text.match(/(?:in|of)\s([a-zA-Z\s]+)/i);
  const city = cityMatch ? cityMatch[1].trim() : "Delhi";
  return await getWeatherData(city);
};

module.exports = { getWeatherInfo };
