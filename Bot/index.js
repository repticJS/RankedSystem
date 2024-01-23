const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

// Initializing the project
require("./handler")(client);

// Discord Modals
const discordModals = require('discord-modals');
discordModals(client);

// Error Handling
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(client.config.token);
