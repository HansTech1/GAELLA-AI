const { cmd, getCommands } = require('../command');

cmd({
  pattern: "menu",
  desc: "Display the command menu",
  react: "📜",
  category: "general",
  filename: __filename
}, async (bot, msg, args) => {
  const commands = getCommands();
  let menu = "📜 *Command Menu:*\n\n";
  commands.forEach(command => {
    menu += `/${command.pattern} - ${command.desc}\n`;
  });
  bot.sendMessage(msg.chat.id, menu, { parse_mode: "Markdown" });
});
