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

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(data.TwoMans.Status === true ? "2Mans_ClearQ" : "2Mans_Setup")
            .setLabel(data.TwoMans.Status === true ? "2Mans | ClearQ" : "2Mans Setup")
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId(data.FourMans.Status === true ? "4Mans_ClearQ" : "4Mans_Setup")
            .setLabel(data.FourMans.Status === true ? "4Mans | ClearQ" : "4Mans Setup")
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId(data.SixMans.Status === true ? "6Mans_ClearQ" : "6Mans_Setup")
            .setLabel(data.SixMans.Status === true ? "6Mans | ClearQ" : "6Mans Setup")
            .setStyle('SECONDARY')
    );

    const row1 = new MessageActionRow()
    .addComponents(
        new MessageButton() 
            .setCustomId('Admin_ErrorHandling')
            .setLabel("Error Menu")
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('Admin_StaffAdd')
            .setLabel("Add Staff")
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('Admin_RemoveAdd')
            .setLabel("Remove Staff")
            .setStyle('SECONDARY')
    );

    Msg.edit({ embeds: [embed], content: 'Loaded!', components: [row, row1] })

}

module.exports = { sendEmbed };