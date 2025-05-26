const axios = require('axios');
const fs = require('fs');
const { cmd } = require('../command');

cmd({
  pattern: "download",
  desc: "Download files from links",
  react: "📥",
  category: "utilities",
  filename: __filename
}, async (bot, msg, args) => {
  if (args.length === 0) {
    return bot.sendMessage(msg.chat.id, "Please provide a URL to download.");
  }
  const url = args[0];
  const fileName = url.split('/').pop();
  const writer = fs.createWriteStream(fileName);
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    response.data.pipe(writer);
    writer.on('finish', () => {
      bot.sendDocument(msg.chat.id, fileName).then(() => {
        fs.unlinkSync(fileName);
      });
    });
    writer.on('error', () => {
      bot.sendMessage(msg.chat.id, "❌ Error downloading the file.");
    });
  } catch (error) {
    bot.sendMessage(msg.chat.id, "❌ Unable to download the file.");
  }
});
