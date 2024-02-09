const client = require('../index');
const Schema = require('../Models/Guild');
const { sendAdminPanel } = require('../utils/Admin');

client.on("ready", async() => {
    console.log('Bot is online!')

    const data = await Schema.find({});
    if(data.length < 1) return;

    data.forEach((guild) => {
        sendAdminPanel(guild.ID)
        console.log(guild.ID)
    })

})