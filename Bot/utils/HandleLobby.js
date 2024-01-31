const client = require('../index');
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../Models/Guild');
const { sendEmbed_2Mans } = require('./2Mans');
const { sendEmbed_4Mans } = require('./4Mans');
const { sendEmbed_6Mans } = require('./6Mans');

const shortid = require('shortid');
const randomWords = require('random-words');
const { RandomTeams } = require('./TeamSplits');

async function ToggleQStatus(interaction, Status, Data) {

    Schema.findOneAndUpdate({
        ID: interaction.guild.id
    }, {
        Config: {
            ...Data.Config,
            LobbyCreationStatus: Status
        }
    }).then(() => {
        console.log('Temp Disabled Q')
    })

}

async function sendLobbyEmbed(Msg, Data, channel, interaction) {

    const panelEmbed = new MessageEmbed()
    .setColor("BLACK")
    .setTitle(`Lobby ${Data.ID.toLowerCase()} Panel!`)
    .setDescription(`Information for the private match:\nName: **${Data.Name}**\nPassword: **${Data.Password}**\n\n<@${Data.CreatesTheLobby}> Creates the lobby!`)

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('Lobby_Vote_Captains')
            .setLabel("Captains | 0")
            .setDisabled(Data.GameMode === "TwoMans" ? true : false)
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('Lobby_Vote_Balanced')
            .setLabel("Balanced | 0")
            .setDisabled(Data.GameMode === "TwoMans" ? true : false)
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('Lobby_Vote_Random')
            .setLabel("Random | 0")
            .setDisabled(Data.GameMode === "TwoMans" ? true : false)
            .setStyle('SECONDARY')
    );

    Msg.edit({ embeds: [panelEmbed], content: " ", components: [row] })

    // Add Players to Channel -> Needs Doing

    if(Data.GameMode === "TwoMans") {
        // Force Vote -> "Random"
        channel.send("Force Skipping Vote. Please Wait!")
        setTimeout(() => {
            StartLobby_Random(interaction.guild.id, Data.Channel)
        }, 2000)
    } else {
        channel.send(`${Data.Players.map((player) => {
            return `<@${player.discordId}>`
        })} Please Vote!`)
    }

}

async function CreateLobby(interaction, GameMode, Queue) {

    // Generate ID
    const ID = shortid.generate()

    // Log Data
    console.log(Queue)

    // Getting Data
    const Data = await Schema.findOne({ ID: interaction.guild.id });
    if(!Data) return console.log('An Error has Occured!')

    // Temp Disable GameMode Q
    ToggleQStatus(interaction, true, Data)

    // Create Channel
    const category = interaction.guild.channels.cache.get(Data.Config.Category)
    const channel = await category.createChannel(`${GameMode}-${ID}`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [{
            id: interaction.guild.id,
            deny: ["VIEW_CHANNEL"]
        }]
    })

    // Sending Loading Message Into Channel
    const Msg = await channel.send("Loading ...")
    Msg.pin()

    // Creating Lobby Data
    const LobbyData = {
        ID: ID,
        Name: `${GameMode}${Math.floor(Math.random()*(999-100+1)+100)}`,
        Password: randomWords({ exactly: 1 })[0],
        CreatesTheLobby: Queue[Math.floor(Math.random()*Queue.length)].discordId,
        Channel: channel.id,
        Message: Msg.id,
        Players: Queue,
        Team1: [],
        Team2: [],
        GameMode: GameMode,
        Captains: 0,
        Balanced: 0,
        Random: 0
    }

    if(GameMode === "TwoMans") {
        const Lobbys = Data.TwoMans.Lobby.concat(LobbyData)

        Schema.findOneAndUpdate({
            ID: interaction.guild.id
        }, {
            TwoMans: {
                ...Data.TwoMans,
                Lobby: Lobbys,
                Queue: []
            }
        }).then(() => { 
            console.log('Created TwoMans Lobby Data!')
            sendEmbed_2Mans(interaction.guild.id)
        })
    }

    // Sending Lobby Embed
    sendLobbyEmbed(Msg, LobbyData, channel, interaction)

    // Send Lobby Embeds Into Channel
    // As Well as Vote System for "Captains, Balanced or Random"
    // If 2Mans, Force Vote for "Random"
    // Once Vote Ended, edit Message, with Team Embeds. + New Buttons for reporting match
    // Add Players to embed.
}

function updateObjectById(array, ID, updatedProperties) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].ID === ID) {
        // Update the object's properties
        array[i] = { ...array[i], ...updatedProperties };
        return array; // Object found and updated
      }
    }
    return false; // Object not found
}

async function StartLobby_Random(guildID, ChannelID) {

    console.log("Starting Lobby | Random")

    const Data = await Schema.findOne({ ID: guildID });
    if(!Data) return console.log('An Error has Occured! -> Cant find guild Data')

    // Joining All Lobbys Together
    const TwoMansLobbys = Data.TwoMans.Lobby
    const FourMansLobbys = Data.FourMans.Lobby
    const SixMansLobbys = Data.SixMans.Lobby
    const Lobbys = await TwoMansLobbys.concat(FourMansLobbys).concat(SixMansLobbys)

    const Lobby = await Lobbys.find((a) => a.Channel === ChannelID);
    if(!Lobby) return console.log('An Error Has Occurred! -> Cant find Lobby')

    // Fetch Guild + Channel + Message
    const guild = await client.guilds.cache.get(guildID)
    const Channel = await guild.channels.cache.get(Lobby.Channel)
    const Message = await Channel.messages.fetch(Lobby.Message)

    // Get Teams
    const { Team1, Team2 } = RandomTeams(Lobby.Players)
    console.log(Team1, Team2)

    // Updating Lobby Object
    if(Lobby.GameMode === "TwoMans") {
        const NewLobbyArrays = await updateObjectById(TwoMansLobbys, Lobby.ID, { Team1: Team1, Team2: Team2 });
        
        Schema.findOneAndUpdate({
            ID: guildID
        }, {
            TwoMans: {
                ...Data.TwoMans,
                Lobby: NewLobbyArrays
            }
        }).then(() => {
            console.log('Updated Lobby Arrays')
        })
    } else if(Lobby.GameMode === "FourMans") {
        const NewLobbyArrays = await updateObjectById(FourMansLobbys, Lobby.ID, { Team1: Team1, Team2: Team2 });
        
        Schema.findOneAndUpdate({
            ID: guildID
        }, {
            FourMans: {
                ...Data.FourMans,
                Lobby: NewLobbyArrays
            }
        }).then(() => {
            console.log('Updated Lobby Arrays')
        })
    } else if(Lobby.GameMode === "SixMans") {
        const NewLobbyArrays = await updateObjectById(SixMansLobbys, Lobby.ID, { Team1: Team1, Team2: Team2 });
        
        Schema.findOneAndUpdate({
            ID: guildID
        }, {
            SixMans: {
                ...Data.SixMans,
                Lobby: NewLobbyArrays
            }
        }).then(() => {
            console.log('Updated Lobby Arrays')
        })
    }

    sendLobbyReady(Message, Lobby, Team1, Team2)
    

}

async function sendLobbyReady(Message, Data, Team1, Team2) {

    const Embed1 = new MessageEmbed()
    .setColor("BLACK")
    .setTitle(`Lobby ${Data.ID.toLowerCase()} Panel!`)
    .setDescription(`Information for the private match:\nName: **${Data.Name}**\nPassword: **${Data.Password}**\n\n<@${Data.CreatesTheLobby}> Creates the lobby!`)

    const Team1 = new MessageEmbed()
    .setColor("BLUE")
    .setTitle("Blue Team")
    .setDescription(`${Data.Team1.map((player) => {
        return `<@${player.discordId}>`
    })}`)

    const Team2 = new MessageEmbed()
    .setColor("ORANGE")
    .setTitle("Orange Team")
    .setDescription(`${Data.Team2.map((player) => {
        return `<@${player.discordId}>`
    })}`)

    // Buttons -> Report, Cancel, VoiceChannels, Substitute

    const MainButtons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ReportMatch')
            .setLabel("Report Match")
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('CancelMatch')
            .setLabel("Cancel")
            .setStyle('DANGER')
    );

    const OptionalButtons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('Team1_VoiceChannels')
            .setLabel("Team 1 | Voice Channel")
            .setDisabled(true)
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('Team2_VoiceChannels')
            .setLabel("Team 2 | Voice Channel")
            .setDisabled(true)
            .setStyle('DANGER')
    );

    Message.edit({ embeds: [Embed1, Team1, Team2], components: [MainButtons, OptionalButtons] })
    // Send Teams embed
    // And new Buttons

}

module.exports = { CreateLobby, StartLobby_Random };