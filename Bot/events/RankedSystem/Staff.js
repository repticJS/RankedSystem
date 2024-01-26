const client = require('../../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSchema = require('../../Models/Guild');
const { Setup_2Mans } = require('../../utils/2Mans');
const { Setup_4Mans } = require('../../utils/4Mans');
const { Setup_6Mans } = require('../../utils/6Mans');
const { ToggleQueuingStatus, createResultsChannel } = require('../../utils/Admin');

client.on("interactionCreate", async(interaction) => {

    // Check if they are in staff array.
    
   // Setup GameModes
   if(interaction.customId === "2Mans_Enable") {

        await interaction.deferReply({ ephemeral: true }).catch(() => {});
    
        Setup_2Mans(interaction.guild.id)
        interaction.followUp({ content: "Setting Up 2Mans!" })

   } else if(interaction.customId === "4Mans_Enable") {

        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        
        Setup_4Mans(interaction.guild.id)
        interaction.followUp({ content: "Setting Up 4Mans!" })

   } else if(interaction.customId === "6Mans_Enable") {

    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    
        Setup_6Mans(interaction.guild.id)
        interaction.followUp({ content: "Setting Up 6Mans!" })

    } else if(interaction.customId === "Config_QueueingEnabled_Enable") {

        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        ToggleQueuingStatus(true, interaction.guild.id)
        interaction.followUp("Enabled Queueing")

    } else if(interaction.customId === "Config_QueueingEnabled_Disable") {

        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        ToggleQueuingStatus(false, interaction.guild.id)
        interaction.followUp("Disabled Queueing")

    } else if(interaction.customId === "Config_ResultsChannel_Setup") {

        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        createResultsChannel(interaction.guild.id)
        interaction.followUp("Creating Results Channel")
    }

})