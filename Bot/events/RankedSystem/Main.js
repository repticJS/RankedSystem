const client = require('../../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Guild } = require('discord.js');
const GuildSchema = require('../../Models/Guild');
const { JoinQueue, LeaveQueue } = require('../../utils/PanelHandler');
const { sendEmbed_2Mans } = require('../../utils/2Mans');
const { sendEmbed_4Mans } = require('../../utils/4Mans');
const { sendEmbed_6Mans } = require('../../utils/6Mans');

client.on("interactionCreate", async(interaction) => {

    const Data = await GuildSchema.findOne({ ID: interaction.guild.id });
    
    var GameMode = ""
    if(interaction.channel.id === Data.TwoMans.Channel ) { GameMode = "TwoMans" }
    if(interaction.channel.id === Data.FourMans.Channel ) { GameMode = "FourMans" }
    if(interaction.channel.id === Data.SixMans.Channel ) { GameMode = "SixMans" }
    
    if(GameMode === "") return;

    if(interaction.customId === "Queue") { JoinQueue(interaction, GameMode) } 
    else if(interaction.customId === "Leave") { LeaveQueue(interaction, GameMode) }
    else if(interaction.customId === "Refresh") { 
        sendEmbed_2Mans(interaction.guild.id)
        sendEmbed_4Mans(interaction.guild.id)
        sendEmbed_6Mans(interaction.guild.id)
    }
})