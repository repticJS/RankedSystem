const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendAdminPanel } = require('../utils/Admin');

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

    var Category_Main = "";
    if(Category) { Category_Main = Category } else {
        // Create Category
    }

    var Channel_Main = "";
    if(Channel) { Channel_Main = Channel } else {
        // Create Channel -> Inside of category
    }

    // Logging Category and Channel
    console.log(Category_Main, Channel_Main)

    // Send Loading Message + Create Data
    const PanelMsg = await Channel_Main.send("Loading ...")
    // Create Data

    Schema.create({
        ID: interaction.guild.id,
        Staff: {
            Channel: Channel_Main.id,
            PanelMsg: PanelMsg.id,
            Users: [`${interaction.member.id}`],
        },
        Config: {
            ResultsChannel: "",
            QueueingEnabled: false,
            BannedPlayers: [],
            PremiumKey: ""
        },
        TwoMans: {
            Status: false,
            Channel: "",
            Color: "#00EAFC",
            Queue: [],
            Lobby: []
        },
        FourMans: {
            Status: false,
            Channel: "",
            Color: "#9B08F2",
            Queue: [],
            Lobby: []
        },
        SixMans: {
            Status: false,
            Channel: "",
            Color: "#F20818",
            Queue: [],
            Lobby: []
        }
    }).then(() => {
        sendAdminPanel(interaction.guild.id)
    })



    }
}