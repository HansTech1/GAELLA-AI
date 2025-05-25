// command.js
const commands = [];

function cmd(options, handler) {
    commands.push({ ...options, handler });
}

function getCommands() {
    return commands;
}

module.exports = { cmd, getCommands };
