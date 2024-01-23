const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

const shortid = require('shortid');
const shuffle = require('fisher-yates-shuffle');
const randomWords = require('random-words');
const { sort } = require ("fast-sort");

async function sendEmbed_2Mans(guildID) {

    const Data = await Schema.findOne({ ID: guildID});
    const Queue = Data.TwoMans.Queue
    const Lobbys = Data.TwoMans.Lobbys


    const embed = new MessageEmbed()
    .setColor(`${Data.TwoMans.Color}`)
    .setTitle('- Ranked System | 2Mans -')

    const maped = Queue.map((item) => {

        return `<@${item}>`

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
            .setCustomId('2Mans_Queue')
            .setLabel("Queue")
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('2Mans_Leave')
            .setLabel("Leave")
            .setStyle('DANGER'),
        new MessageButton()
            .setCustomId('2Mans_Refresh')
            .setLabel("Refresh")
            .setStyle('PRIMARY')
    );

    const row1 = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('2Mans_YourStats')
            .setLabel("Your Stats")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setURL('https://risingphoenix.uk/RankedSystem?Option=2Mans')
        	.setDisabled(false)
            .setLabel("Leaderboard")
            .setStyle('LINK')
    );

    const guild = client.guilds.cache.get(guildID);
    const Channel = await guild.channels.cache.get(Data.TwoMans.PanelChannel);

    const Msg = await Channel.messages.fetch(Data.TwoMans.PanelMessage);
    Msg.edit({ embeds: [embed], components: [row, row1], content: " " })

}

module.exports = { sendEmbed_2Mans };