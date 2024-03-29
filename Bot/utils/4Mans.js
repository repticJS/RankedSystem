const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

const shortid = require('shortid');
const shuffle = require('fisher-yates-shuffle');
const randomWords = require('random-words');
const { sort } = require ("fast-sort");
const { sendAdminPanel } = require('./Admin');

async function sendEmbed_4Mans(guildID) {

    const Data = await Schema.findOne({ ID: guildID });
    const Queue = Data.FourMans.Queue
    const Lobbys = Data.FourMans.Lobby

    const embed = new MessageEmbed()
    .setColor(`${Data.FourMans.Color}`)
    .setTitle('- Ranked System | 4Mans -')
    .setFooter({ text: 'Powered by repticJS', iconURL: 'https://imgur.com/co7WQ8L.png' });

    const maped = Queue.map((item) => {

        return `<@${item.discordId}>` 

    }).join("\n")

    const maped1 = Lobbys.map((item) => {
        return `<#${item.channelId}>`
    }).join("\n")

    if(Queue.length === 0) {
        embed.addFields({ name: 'Queue', value: `None` })
    } else {
        embed.addFields({ name: 'Queue', value: `${maped}` })
    }

    if(Lobbys.length === 0) {
        embed.addFields({ name: 'Lobbys', value: `None` })
    } else {
        embed.addFields({ name: 'Lobbys', value: `${maped1}` })
    }

    const Top5 = []

   if(Top5 > 0) {
    const dataspliced = await sort(Top5).desc(u => u.MMR);
    const sorted = await dataspliced.splice(0, 5)

    const POS = await sorted.map((item, index) => {
            return `${index + 1}`
    }).join("\n");
    
    const Names = await sorted.map((item, index) => {
        return `<@${item.discordId}>`
    }).join("\n");

    const MMRs = await sorted.map((item, index) => {
        return `${item.MMR}`
    }).join("\n");


    embed.addFields({ name: '᲼', value: `**----- Top 5 Leaderboard -----**` })
    embed.addFields(
		{ name: '#', value: POS, inline: true },
		{ name: 'Name', value: Names, inline: true },
        { name: 'MMR', value: MMRs, inline: true }
	)
   } else {
    embed.addFields({ name: '᲼', value: `**----- Top 5 Leaderboard -----**` })
    embed.addFields(
		{ name: '#', value: " ", inline: true },
		{ name: 'Name', value: " ", inline: true },
        { name: 'MMR', value: " ", inline: true }
	)
   }


    
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('Queue')
            .setLabel("Queue")
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('Leave')
            .setLabel("Leave")
            .setStyle('DANGER'),
        new MessageButton()
            .setCustomId('Refresh')
            .setLabel("Refresh")
            .setStyle('PRIMARY')
    );

    const row1 = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('YourStats')
            .setDisabled(true)
            .setLabel("Your Stats")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setURL('https://risingphoenix.uk/RankedSystem?Option=4Mans')
        	.setDisabled(true)
            .setLabel("Leaderboard")
            .setStyle('LINK')
    );

    const guild = client.guilds.cache.get(guildID);
    const Channel = await guild.channels.cache.get(Data.FourMans.Channel);

    const Msg = await Channel.messages.fetch(Data.FourMans.Message);
    Msg.edit({ embeds: [embed], components: [row, row1], content: " " })

}

async function Setup_4Mans(guildID) {

    const Data = await Schema.findOne({ ID: guildID });
    const guild = client.guilds.cache.get(guildID);
    const category = guild.channels.cache.get(Data.Config.Category)
    
    const channel = await category.createChannel(`🟣┃4mans`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [{
            id: guild.id,
            deny: ["SEND_MESSAGES"]
        }]
    })

    const MSG = await channel.send('Loading ...')

   Schema.findOneAndUpdate({
    ID: guildID
   }, {
    FourMans: {
        Status: true,
        Channel: channel.id,
        Message: MSG.id,
        Queue: [],
        Lobby: [],
        Color: "#9B08F2"
    }
   }).then(() => {
        sendEmbed_4Mans(guildID)
        sendAdminPanel(guildID)
   })

}

module.exports = { sendEmbed_4Mans, Setup_4Mans };