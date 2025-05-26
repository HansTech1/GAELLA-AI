const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "anime",
  desc: "Search for anime titles",
  react: "🎌",
  category: "entertainment",
  filename: __filename
}, async (bot, msg, args) => {
  if (args.length === 0) {
    return bot.sendMessage(msg.chat.id, "Please provide an anime title to search.");
  }
  const query = args.join(" ");
  try {
    const res = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(query)}`);
    const anime = res.data.results[0];
    const response = `🎌 *${anime.title}*\nEpisodes: ${anime.episodes}\nScore: ${anime.score}\nSynopsis: ${anime.synopsis}`;
    bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown" });
  } catch (error) {
    bot.sendMessage(msg.chat.id, "❌ Unable to fetch anime information.");
  }
});
