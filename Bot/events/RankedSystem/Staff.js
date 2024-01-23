const client = require('../../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const GuildSchema = require('../../Models/Guild');
const { sendEmbed_2Mans } = require('../../utils/2Mans');
const { sendEmbed } = require('../../utils/Setup');

client.on("interactionCreate", async(interaction) => {
    
    // Check if user is staff

    // 2Mans
    if(interaction.customId === "2Mans_Setup") {

        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        
        const category = interaction.guild.channels.cache.get(interaction.channel.parentId)
        const channel = await category.createChannel(`🔵┃2mans`, {
            type: "GUILD_TEXT"
        })

        const Msg = await channel.send('Loading ...')

        interaction.followUp(`2Mans Channel: <#${channel.id}>`)

        const data = await GuildSchema.findOne({ ID: interaction.guild.id });

        var Logs = data.Logs;
        Logs.push({
            Timestamp: Date.now(),
            Level: "INFO",
            Message: "Enabled 2Mans"
        })

        GuildSchema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            TwoMans: {
                PanelChannel: channel.id,
                PanelMessage: Msg.id,
                Color: "#00EAFC",
                Status: true,
                Queue: [],
                Lobbys: []
            },
            Logs: Logs
        }).then(() => {
            sendEmbed_2Mans(interaction.guild.id)
            sendEmbed(interaction.guild.id)
        })

    } else if(interaction.customId === "2Mans_ClearQ") [

        

    ]

})