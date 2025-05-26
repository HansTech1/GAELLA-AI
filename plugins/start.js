const { cmd } = require('../command');

cmd({
  pattern: "start",
  desc: "Start the bot and show welcome message",
  react: "👋",
  category: "general",
  filename: __filename
}, async (bot, msg, args) => {
  const name = msg.from.first_name || "there";

  const welcomeMessage = `👋 Hello ${name}!

Welcome to *GAELLA-AI*! I'm here to assist you with various commands.

You can try:
- /weather [city] – Get the current weather
- /help – See all available commands

Let’s explore together!`;

  bot.sendMessage(msg.chat.id, welcomeMessage, { parse_mode: "Markdown" });
});
