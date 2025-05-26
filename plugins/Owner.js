const { cmd } = require('../command');

cmd({
  pattern: "owner",
  desc: "Show bot owner information",
  react: "👤",
  category: "general",
  filename: __filename
}, async (bot, msg, args) => {
  const ownerInfo = "👤 *Bot Owner:*\nName: John Doe\nContact: @johndoe";
  bot.sendMessage(msg.chat.id, ownerInfo, { parse_mode: "Markdown" });
});
