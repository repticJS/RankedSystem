const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');

async function checkPlayer_Queue(guildId, discordId, GameMode) {



}

async function checkPlayer_Lobby(guildId, discordId) {



}

async function checkPlayer_GuildBanned(guildId, discordId) {



}

async function checkPlayer_PermBanned(discordId) {



}

async function checkPlayer(interaction, guildId, discordId, GameMode) {

    // Might be worth getting data from database here and passing it up.
    // So will need to change the params!

    const GuildData = await Schema.findOne({ ID: guildId })

    try {
    // Queue
    const Check1 = checkPlayer_Queue(guildId, discordId, GameMode);
    if(Check1 === true) return interaction.followUp("You are already queued for this gamemode!")

    // Lobby
    const Check2 = checkPlayer_Lobby(guildId, discordId);
    if(Check2 === true) return interaction.followUp("You are in a lobby!")

    // Guild - Banned
    const Check3 = checkPlayer_GuildBanned(guildId, discordId);
    if(Check3 === true) return interaction.followUp("You are banned from queuing in this server!") 

    // Perm - Banned
    const Check4 = checkPlayer_PermBanned(discordId);
    if(Check4 === true) return interaction.followUp("You are banned from queuing!") 
    } catch(error) { 
        console.log(error)
    }

}

async function checkPlayerQStatus(guildID, discordId) {

    // True = Can't Q
    // False = Can Q
    
    const Data = await Schema.findOne({ ID: guildID });
    if(!Data) return true;

    const TwoMansD = await Promise.all(Data.TwoMans.Lobby.map(async(lobby) => {
        
        const a = await lobby.Players.map((player) => {
            return player.discordId
        })

        return a;
    }));
    const TwoMansData = TwoMansD.flat().map(String)

    const FourMansD = await Promise.all(Data.FourMans.Lobby.map(async(lobby) => {
        
        const a = await lobby.Players.map((player) => {
            return player.discordId
        })

        return a;
    }));
    const FourMansData = FourMansD.flat().map(String)

    const SixMansD = await Promise.all(Data.SixMans.Lobby.map(async(lobby) => {
        
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

module.exports = { checkPlayer, checkPlayer_Queue, checkPlayer_Lobby, checkPlayer_GuildBanned, checkPlayer_PermBanned }