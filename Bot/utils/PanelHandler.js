const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendEmbed_2Mans } = require('./2Mans');
const { sendEmbed_4Mans } = require('./4Mans');
const { sendEmbed_6Mans } = require('./6Mans');

async function JoinQueue(interaction, GameMode) {
    
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const Data = await Schema.findOne({ ID: interaction.guild.id });
    if(!Data) return interaction.followUp("An error has occured!")
    
    if(Data.Config.QueueingEnabled === false) return interaction.followUp("Queueing is Disabled!")

    if(GameMode === "TwoMans") {
        const Q = Data.TwoMans.Queue.concat([`${interaction.member.id}`])
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            TwoMans: {
                ...Data.TwoMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_2Mans(interaction.guild.id)
        })

        if(Q.length === 2) {
            // Handle Lobby Creation
        }

    } else if(GameMode === "FourMans") {
        const Q = Data.FourMans.Queue.concat([`${interaction.member.id}`])
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            FourMans: {
                ...Data.TwoMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_4Mans(interaction.guild.id)
        })

        if(Q.length === 4) {
            // Handle Lobby Creation
        }

    } else if(GameMode === "SixMans") {
        const Q = Data.SixMans.Queue.concat([`${interaction.member.id}`])
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            SixMans: {
                ...Data.TwoMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_6Mans(interaction.guild.id)
        })

        if(Q.length === 6) {
            // Handle Lobby Creation
        }

    } else {
        return interaction.followUp("An error has occured!")
    }

}

async function LeaveQueue(interaction, GameMode) {

    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const Data = await Schema.findOne({ ID: interaction.guild.id });
    if(!Data) return interaction.followUp("An error has occured!")

    if(GameMode === "TwoMans") {

    } else if(GameMode === "FourMans") {

    } else if(GameMode === "SixMans") {

    } else {
        return interaction.followUp("An error has occured!")
    }

}

module.exports = { JoinQueue, LeaveQueue };