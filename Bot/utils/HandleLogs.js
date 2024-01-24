async function handleInfoLevel(Message, guildID, userID) {

    // Logging Data
    console.log("LOG LEVEL: INFO")
    console.log(Date.now())
    console.log(Message)
    console.log(guildID)
    console.log(userID)

}

module.exports = { handleBasicLogs };