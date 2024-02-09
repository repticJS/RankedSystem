const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

async function checkPlayer_Lobbys(GuildData, discordId) {

    const TwoMansD = await Promise.all(GuildData.TwoMans.Lobby.map(async(lobby) => {
        
        const a = await lobby.Players.map((player) => {
            return player.discordId
        })

        return a;
    }));
    const TwoMansData = TwoMansD.flat().map(String)

    const FourMansD = await Promise.all(GuildData.FourMans.Lobby.map(async(lobby) => {
        
        const a = await lobby.Players.map((player) => {
            return player.discordId
        })

        return a;
    }));
    const FourMansData = FourMansD.flat().map(String)

    const SixMansD = await Promise.all(GuildData.SixMans.Lobby.map(async(lobby) => {
        
        const a = await lobby.Players.map((player) => {
            return player.discordId
        })

        return a;
    }));
    const SixMansData = SixMansD.flat().map(String)
    

    const allPlayers = TwoMansData.concat(FourMansData).concat(SixMansData);
    const check = allPlayers.find(a => a === discordId);
    const isPlayerFound = check !== undefined;

    return isPlayerFound
}

async function checkPlayer(interaction, GameMode) {

    // True = Can't Q
    // False = Can Q

    // Check guild data
    const GuildData = await Schema.findOne({ ID: interaction.guild.id })
    console.log(GuildData)
    if(!GuildData) return true;

    // Check If they are in a lobby
    const checkQ = await checkPlayer_Lobbys(GuildData, interaction.member.id)
    console.log(checkQ)
    return checkQ

}

module.exports = { checkPlayer }