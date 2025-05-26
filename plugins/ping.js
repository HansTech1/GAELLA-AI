const { cmd } = require('../command');

cmd({
  pattern: "ping",
  desc: "Measure bot response time",
  react: "🏓",
  category: "general",
  filename: __filename
}, async (bot, msg, args) => {
  const start = Date.now();
  const sentMsg = await bot.sendMessage(msg.chat.id, "Pinging...");
  const end = Date.now();
  bot.editMessageText(`🏓 Pong! Response time: ${end - start}ms`, {
    chat_id: msg.chat.id,
    message_id: sentMsg.message_id
  });
});
