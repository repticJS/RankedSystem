const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

async function JoinQueue(guildID, discordId, GameMode) {

    console.log(guildID, discordId, GameMode)

}

async function LeaveQueue(guildID, discordId, GameMode) {

    console.log(guildID, discordId, GameMode)

}

module.exports = { JoinQueue, LeaveQueue };