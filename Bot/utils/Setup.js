const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

async function sendEmbed(guildId) {

    const data = await Schema.findOne({ ID: guildId });

    const guild = client.guilds.cache.get(guildId);
    const Channel = await guild.channels.cache.get(data.Setup.Channel);
    const Msg = await Channel.messages.fetch(data.Setup.Message);

    const embed = new MessageEmbed()
    .setColor("#fff6ba")
    .setTitle("Ranked System | Setup")
    .setThumbnail("https://imgur.com/0mLDOf8.png")
    .addFields(
		{ name: 'GameMode', value: `2Mans: ${data.TwoMans.Status === true ? "Enabled" : "Disabled"}\n4Mans: ${data.FourMans.Status === true ? "Enabled" : "Disabled"}\n6Mans: ${data.SixMans.Status === true ? "Enabled" : "Disabled"}`, inline: false },
        { name: "Admin", value: `Channel: ${data.Admin.Channel === "" ? "Not Configured": `<#${data.Admin.Channel}>`}\nStaff: ${data.Admin.Staff.map((user) => {
            return `<@${user}>`
        })}`}
	)

    Msg.edit({ embeds: [embed], content: 'Loaded!' })

}

module.exports = { sendEmbed };