const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

async function sendAdminPanel(guildId) {

    const data = await Schema.findOne({ ID: guildId });

    if(!data) return;

    const guild = client.guilds.cache.get(guildId);
    const Channel = await guild.channels.cache.get(data.Staff.Channel);
    const Msg = await Channel.messages.fetch(data.Staff.PanelMsg);

    const embed = new MessageEmbed()
    .setColor("#fff6ba")
    .setTitle("Ranked System | Setup")
    .setThumbnail("https://imgur.com/0mLDOf8.png")
    .addFields(
		{ 
            name: 'GameMode', 
            value: `2Mans: ${data.TwoMans.Status === true ? "Enabled" : "Disabled"}\n4Mans: ${data.FourMans.Status === true ? "Enabled" : "Disabled"}\n6Mans: ${data.SixMans.Status === true ? "Enabled" : "Disabled"}`, 
            inline: false 
        },
        {
            name: 'Config',
            value: `Results Channel: ${data.Config.ResultsChannel === "" ? "Disabled" : "Enabled"}\nQueueing Status: ${data.Config.QueueingEnabled === true ? "Enabled" : "Disabled"}`,
            inline: false
        },
        {
            name: "Staff",
            value: `${data.Staff.Users.map((staff, index) => {
                return `<@${staff}>`
            })}`
        }
        
	)
    .setFooter({ text: 'Powered by repticJS', iconURL: 'https://imgur.com/co7WQ8L.png' });

    // Buttons
    const GameModes = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(`${data.TwoMans.Status === true ? "2Mans_Disable" : "2Mans_Enable"}`)
            .setLabel(`${data.TwoMans.Status === true ? "2Mans | Disable" : "2Mans | Enable"}`)
            .setDisabled(`${data.TwoMans.Status === true ? true : false}`) // Temp
            .setStyle(`${data.TwoMans.Status === true ? "DANGER" : "SUCCESS"}`),
        new MessageButton()
            .setCustomId(`${data.FourMans.Status === true ? "4Mans_Disable" : "4Mans_Enable"}`)
            .setLabel(`${data.FourMans.Status === true ? "4Mans | Disable" : "4Mans | Enable"}`)
            .setDisabled(`${data.FourMans.Status === true ? true : false}`) // Temp
            .setStyle(`${data.FourMans.Status === true ? "DANGER" : "SUCCESS"}`),
        new MessageButton()
            .setCustomId(`${data.SixMans.Status === true ? "6Mans_Disable" : "6Mans_Enable"}`)
            .setLabel(`${data.SixMans.Status === true ? "6Mans | Disable" : "6Mans | Enable"}`)
            .setDisabled(`${data.SixMans.Status === true ? true : false}`) // Temp 
            .setStyle(`${data.SixMans.Status === true ? "DANGER" : "SUCCESS"}`),
    );

    const Config = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(`${data.Config.ResultsChannel === "" ? "Config_ResultsChannel_Setup" : "Config_ResultsChannel_Update"}`)
            .setLabel(`${data.Config.ResultsChannel === "" ? "Results Channel | Enable" : "Results Channel | Disable"}`)
            .setDisabled(`${data.Config.ResultsChannel === "" ? false : true}`) // Temp
            .setStyle(`${data.Config.ResultsChannel === "" ? "SUCCESS" : "DANGER"}`),
        new MessageButton()
            .setCustomId(`${data.Config.QueueingEnabled === false ? "Config_QueueingEnabled_Enable" : "Config_QueueingEnabled_Disable"}`)
            .setLabel(`${data.Config.QueueingEnabled === false ? "Queueing Status | Enable" : "Queueing Status | Disable"}`)
            .setStyle(`${data.Config.QueueingEnabled === false ? "SUCCESS" : "DANGER"}`)
    );

    const Staff = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId("Staff_AddUser")
            .setLabel("Staff | Add User")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("Staff_RemoveUser")
            .setLabel("Staff | Remove User")
            .setStyle("DANGER"),
    );

    try {
        Msg.edit({ embeds: [embed], content: ' ', components: [GameModes, Config, Staff] })
    } catch (error) {
        console.log(error)
    }

}

async function ToggleQueuingStatus(Status, guildID) {

    const data = await Schema.findOne({ ID: guildID })

    Schema.findOneAndUpdate({
        ID: guildID
    }, {
        Config: {
            ...data.Config,
            QueueingEnabled: Status
        }
    }).then(() => {
        sendAdminPanel(guildID)
    })

}

async function createResultsChannel(guildID) {

    const Data = await Schema.findOne({ ID: guildID })

    const guild = client.guilds.cache.get(guildID);
    const category = guild.channels.cache.get(Data.Config.Category)
    
    const channel = await category.createChannel(`📄┃results`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [{
            id: guild.id,
            deny: ["SEND_MESSAGES"]
        }]
    })

    Schema.findOneAndUpdate({
        ID: guildID
    }, {
        Config: {
            ...Data.Config,
            ResultsChannel: channel.id
        }
    }).then(() => {
        sendAdminPanel(guildID)
    })

}

module.exports = { sendAdminPanel, ToggleQueuingStatus, createResultsChannel };