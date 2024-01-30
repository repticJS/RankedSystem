const client = require('../../index');
const Schema = require('../../Models/Guild');
const { sendEmbed_2Mans } = require('../../utils/2Mans');
const { sendEmbed_4Mans } = require('../../utils/4Mans');
const { sendEmbed_6Mans } = require('../../utils/6Mans');

const MaxTimeDifference = 15 * 60 * 1000;
const IntervalTime = 300000;

client.on("ready", async() => {

    setInterval(async() => {

    // Get TimeStamp
    const TimeNow = Date.now();

    const data = await Schema.find({});
    if(data.length < 1) return;


    data.forEach((guild) => {

    console.log("Running Idle System | Server: " + guild.ID)

        // Check 2Mans
        if(guild.TwoMans.Status === true) {
        if(guild.TwoMans.Queue.length > 0) {

        guild.TwoMans.Queue.forEach((player) => {

            const timeDifference = TimeNow - player.JoinedAt;

            if(timeDifference >= MaxTimeDifference) {
                // Dm User 
                
                // Embed
                // Title = "Removed from Q"
                // Field 1 = "GameMode" "TwoMans"
                // Field 2 = "Server": "Server",
                // Field 3 = "Panel Channel": "<#1234>"
                // Powered by repticJS

                // Remove User from Q
                // send Embed
            }

        })}}

        // Check 4Mans
        if(guild.FourMans.Status === true) {
            if(guild.FourMans.Queue.length > 0) {
    
            guild.FourMans.Queue.forEach((player) => {
    
                const timeDifference = TimeNow - player.JoinedAt;
    
                if(timeDifference >= MaxTimeDifference) {
                    // Dm User 
                    
                    // Embed
                    // Title = "Removed from Q"
                    // Field 1 = "GameMode" "FourMans"
                    // Field 2 = "Server": "Server",
                    // Field 3 = "Panel Channel": "<#1234>"
                    // Powered by repticJS

                    // Remove User from Q
                    // send Embed
                }
    
        })}}

        // Check 6Mans
        if(guild.SixMans.Status === true) {
            if(guild.SixMans.Queue.length > 0) {
    
            guild.SixMans.Queue.forEach((player) => {
    
                const timeDifference = TimeNow - player.JoinedAt;
    
                if(timeDifference >= MaxTimeDifference) {
                    // Dm User 
                    
                    // Embed
                    // Title = "Removed from Q"
                    // Field 1 = "GameMode" "SixMans"
                    // Field 2 = "Server": "Server",
                    // Field 3 = "Panel Channel": "<#1234>"
                    // Powered by repticJS

                    // Remove User from Q
                    // send Embed
                }
    
        })}}

    })

    }, IntervalTime)

})