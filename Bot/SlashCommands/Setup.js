const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const client = require('../index');
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
            required: false
        },
        {
            name: "channel",
            description: "Staff Channel - Where you will manage the ranked system!",
            type: "CHANNEL",
            required: false
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

    var Category_Main = {};
    if(Category) { Category_Main = Category } else {
    const A = await interaction.guild.channels.create(`Ranked System`, {
        type: "GUILD_CATEGORY"
    })

    Category_Main = A
    }

    var Channel_Main = {};
    if(Channel) { Channel_Main = Channel } else {
    const channel = await Category_Main.createChannel(`🔒┃staff`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [{
            id: interaction.guild.id,
            deny: ["VIEW_CHANNEL"]
        }]
    })

    Channel_Main = channel
    }

    // Logging Category and Channel
    console.log(Category_Main, Channel_Main)

    // Send Loading Message + Create Data
    const PanelMsg = await Channel_Main.send("Loading ....")
    
    const H1 = await interaction.channel.send("✅ -> Start Up Successful.")
    const H2 = await interaction.channel.send("✅ -> Saving Data!")
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
            PremiumKey: "",
            Category: Category_Main.id,
        },
        TwoMans: {
            Status: false,
            Channel: "",
            Color: "#00EAFC",
            Queue: [],
            Lobby: [],
            Message: ""
        },
        FourMans: {
            Status: false,
            Channel: "",
            Color: "#9B08F2",
            Queue: [],
            Lobby: [],
            Message: ""
        },
        SixMans: {
            Status: false,
            Channel: "",
            Color: "#F20818",
            Queue: [],
            Lobby: [],
            Message: ""
        }
    }).then(async() => {
        
        const H3 = await interaction.channel.send("✅ -> Data Saved!")

        setTimeout(() => {

            H1.delete()
            H2.delete()
            H3.delete()

        }, 2000)
        
        sendAdminPanel(interaction.guild.id)
    })



    }
}