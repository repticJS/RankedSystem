const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendEmbed_2Mans } = require('./2Mans');
const { sendEmbed_4Mans } = require('./4Mans');
const { sendEmbed_6Mans } = require('./6Mans');
const { CreateLobby } = require('./HandleLobby');

async function JoinQueue(interaction, GameMode) {    
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const Data = await Schema.findOne({ ID: interaction.guild.id });
    if(!Data) return interaction.followUp("An error has occured!")


    if(Data.Config.LobbyCreationStatus === true) return interaction.followUp("Lobby Creation In Progress. Please wait 10 seconds.")
    if(Data.Config.QueueingEnabled === false) return interaction.followUp("Queueing is Disabled!")

    if(GameMode === "TwoMans") {

        const Check = await Data.TwoMans.Queue.some(item => item.discordId === interaction.member.id);
        if(Check === true) return interaction.followUp("You are already queued!")

        const Q = Data.TwoMans.Queue.concat([
            {
                discordId: interaction.member.id,
                JoinedAt: Date.now()
            }
        ])
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
            interaction.followUp("You have been added to the queue!")
        })

        if(Q.length === 2) {
            CreateLobby(interaction, "TwoMans", Q)
        }

    } else if(GameMode === "FourMans") {

        const Check = await Data.FourMans.Queue.some(item => item.discordId === interaction.member.id);
        if(Check === true) return interaction.followUp("You are already queued!")

        const Q = Data.FourMans.Queue.concat([
            {
                discordId: interaction.member.id,
                JoinedAt: Date.now()
            }
        ])
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            FourMans: {
                ...Data.FourMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_4Mans(interaction.guild.id)
            interaction.followUp("You have been added to the queue!")
        })

        if(Q.length === 4) {
            // Handle Lobby Creation
        }

    } else if(GameMode === "SixMans") {

        const Check = await Data.SixMans.Queue.some(item => item.discordId === interaction.member.id);
        if(Check === true) return interaction.followUp("You are already queued!")

        const Q = Data.SixMans.Queue.concat([
            {
                discordId: interaction.member.id,
                JoinedAt: Date.now()
            }
        ])
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            SixMans: {
                ...Data.SixMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_6Mans(interaction.guild.id)
            interaction.followUp("You have been added to the queue!")
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
    if(Data.Config.LobbyCreationStatus === true) return interaction.followUp("Lobby Creation In Progress. Please wait 10 seconds.")

    if(GameMode === "TwoMans") {

        const Q = Data.TwoMans.Queue.filter(item => item.discordId !== interaction.member.id)
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
            interaction.followUp("You have left the queue!")
        })

    } else if(GameMode === "FourMans") {

        const Q = Data.FourMans.Queue.filter(item => item.discordId !== interaction.member.id)
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            FourMans: {
                ...Data.FourMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_4Mans(interaction.guild.id)
            interaction.followUp("You have left the queue!")
        })

    } else if(GameMode === "SixMans") {

        const Q = Data.SixMans.Queue.filter(item => item.discordId !== interaction.member.id)
        console.log(Q)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            SixMans: {
                ...Data.SixMans,
                Queue: Q
            }
        }).then(() => {
            sendEmbed_6Mans(interaction.guild.id)
            interaction.followUp("You have left the queue!")
        })

    } else {
        return interaction.followUp("An error has occured!")
    }

}

module.exports = { JoinQueue, LeaveQueue };