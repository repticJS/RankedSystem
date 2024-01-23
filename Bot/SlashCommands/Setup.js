const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendEmbed } = require('../utils/Setup');

module.exports = {
    name: 'setup',
    description: 'Start Setup Of Ranked System',
    options: [
        {
            name: 'category',
            description: 'The Category you want the ranked system to be handled in!',
            type: "CHANNEL",
            required: true
        },
        {
            name: "channel",
            description: "Staff Channel - Where you will manage the ranked system!",
            type: "CHANNEL",
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */

    run: async(client, interaction, args) => {

    const Channel = interaction.options.getChannel('channel');
    const Category = interaction.options.getChannel('category');
    
    if(interaction.guild.ownerId != interaction.member.id) return interaction.followUp("Only the server owner can run this command!")

    

    
    

    }
}