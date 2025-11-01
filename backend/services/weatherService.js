const axios = require("axios");

const getWeatherData = async (city) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    return `🌤️ Weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
  } catch (error) {
    console.error("Weather API Error:", error.message);
    return "Sorry, I couldn’t fetch weather data. Please check the city name.";
  }
};

module.exports = { getWeatherData };
