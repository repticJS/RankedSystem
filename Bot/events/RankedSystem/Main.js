const client = require('../../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Guild } = require('discord.js');
const GuildSchema = require('../../Models/Guild');
const { JoinQueue, LeaveQueue } = require('../../utils/PanelHandler');

client.on("interactionCreate", async(interaction) => {

    const Data = await GuildSchema.findOne({ ID: interaction.guild.id });
    
    var GameMode = ""
    if(interaction.channel.id === Data.TwoMans.Channel ) { GameMode = "TwoMans" }
    if(interaction.channel.id === Data.FourMans.Channel ) { GameMode = "FourMans" }
    if(interaction.channel.id === Data.SixMans.Channel ) { GameMode = "SixMans" }

    if(interaction.customId === "Queue") { JoinQueue(interaction.guild.id, interaction.member.id, GameMode) } 
    else if(interaction.customId === "Leave") { LeaveQueue(interaction.guild.id, interaction.member.id, GameMode) }
    
})