function RandomTeams(array) {
    // Fisher-Yates shuffle algorithm based on the discordId property
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i].discordId, array[j].discordId] = [array[j].discordId, array[i].discordId];
    }
  
    // Split the shuffled array into two teams
    const middleIndex = Math.floor(array.length / 2);
    const Team1 = array.slice(0, middleIndex);
    const Team2 = array.slice(middleIndex);
  
    return { Team1, Team2 };
}

module.exports = { RandomTeams };