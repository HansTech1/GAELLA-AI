const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "weather",
  desc: "🌤 Get weather information for a location",
  react: "🌤",
  category: "other",
  filename: __filename
}, async (bot, msg, args) => {
  if (args.length === 0) {
    return bot.sendMessage(msg.chat.id, "Please provide a city name. Example: /weather Douala");
  }

  const city = args.join(" ");
  const url = `https://apis.davidcyriltech.my.id/weather?city=${encodeURIComponent(city)}`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (!data.success || !data.data) {
      return bot.sendMessage(msg.chat.id, "❌ Unable to fetch weather data. Please check the city name and try again.");
    }

    const w = data.data;
    const response = `🌍 Weather in ${w.location}, ${w.country}:
- Weather: ${w.weather} (${w.description})
- Temperature: ${w.temperature}
- Feels Like: ${w.feels_like}
- Humidity: ${w.humidity}
- Pressure: ${w.pressure}
- Wind Speed: ${w.wind_speed}
- Coordinates: [${w.coordinates.latitude}, ${w.coordinates.longitude}]`;

    bot.sendMessage(msg.chat.id, response);
  } catch (error) {
    console.error("Weather API error:", error.message);
    bot.sendMessage(msg.chat.id, "⚠️ An error occurred while fetching the weather data.");
  }
});
