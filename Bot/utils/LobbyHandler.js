const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendEmbed_2Mans } = require('./2Mans');
const { sendEmbed_4Mans } = require('./4Mans');
const { sendEmbed_6Mans } = require('./6Mans');

async function StartLobby(Players) {

    // Logging Players
    console.log(Players)

    // Create + Save Lobby in Database
    // ID, Username, Password, BlueTeam, OrangeTeam, etc

}

module.exports = {};