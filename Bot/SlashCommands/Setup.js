const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendEmbed } = require('../utils/Setup');

module.exports = {
    name: 'setup',
    description: 'Start Setup Of Ranked System',
    options: [
        {
            name: 'channel',
            description: 'Admin Channel',
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
    const Msg = await Channel.send("Loading ...")
    
    if(interaction.guild.ownerId != interaction.member.id) return interaction.followUp("Only the server owner can run this command!")
    
    Schema.create({
        ID: interaction.guild.id,
        Logs: [
            {
                Timestamp: Date.now(),
                Level: "INFO",
                Message: "Created Guild Data"
            },
            {
                Timestamp: Date.now(),
                Level: "INFO",
                Message: "Linked Setup Message"
            }
        ],
        TwoMans: {
            ResultsChannel: "",
            PanelChannel: "",
            Colour: "",
            Queue: [],
            Status: false
        },
        FourMans: {
            ResultsChannel: "",
            PanelChannel: "",
            Colour: "",
            Queue: [],
            Status: false
        },
        SixMans: {
            ResultsChannel: "",
            PanelChannel: "",
            Colour: "",
            Queue: [],
            Status: false
        },
        Setup: {
            Message: Msg.id,
            Channel: Channel.id
        },
        Admin: {
            Channel: Channel.id,
            Staff: [`${interaction.member.id}`]
        }
    }).then(() => {
        sendEmbed(interaction.guild.id)
    })

    }
}