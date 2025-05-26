const { cmd } = require('../command');

cmd({
  pattern: "alive",
  desc: "Check if the bot is alive",
  react: "✅",
  category: "general",
  filename: __filename
}, async (bot, msg, args) => {
  bot.sendMessage(msg.chat.id, "✅ Bot is alive and operational!");
});
