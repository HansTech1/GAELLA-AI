const TelegramBot = require('node-telegram-bot-api');
const { getCommands } = require('./command');
const fs = require('fs');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Charger les plugins
fs.readdirSync('./plugins').forEach(file => {
    if (file.endsWith('.js')) {
        require(`./plugins/${file}`);
    }
});

// Dispatcher les commandes
bot.on('message', async (msg) => {
    const text = msg.text;
    if (!text) return;

    const commandList = getCommands();
    for (const cmd of commandList) {
        const match = text.match(new RegExp(`^/${cmd.pattern}(?:\\s+(.*))?$`));
        if (match) {
            const args = match[1] ? match[1].split(' ') : [];

            // Envoyer l'emoji de réaction (s'il existe)
            if (cmd.react) {
                await bot.sendMessage(msg.chat.id, cmd.react);
            }

            try {
                await cmd.handler(bot, msg, args);
            } catch (err) {
                bot.sendMessage(msg.chat.id, "Erreur : " + err.message);
            }
        }
    }
});
