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
        return bot.sendMessage(msg.chat.id, "Please provide a location.");
    }

    const location = args.join(" ");
    const apiKey = process.env.OPENWEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    try {
        const res = await axios.get(url);
        const data = res.data;
        const response = `🌍 Weather in ${data.name}, ${data.sys.country}:
- Temp: ${data.main.temp}°C
- Feels like: ${data.main.feels_like}°C
- Weather: ${data.weather[0].description}
- Wind: ${data.wind.speed} m/s`;

        bot.sendMessage(msg.chat.id, response);
    } catch (error) {
        bot.sendMessage(msg.chat.id, "Could not fetch weather info.");
    }
});
