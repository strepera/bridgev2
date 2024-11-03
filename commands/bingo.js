export default async function(bot, requestedPlayer, player, chat) {
    requestedPlayer = requestedPlayer.split(' ')[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/bingo?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success) return (chat + "Invalid player.");
    if (!dataJson.events) return (chat + "Player hasn't played bingo.");

    const completedGoals = dataJson.events.reverse()[0].completed_goals.length;
    const currentPoints = dataJson.events.reverse()[0].points;
    const completedEvents = dataJson.events.length;
    let totalPoints = 0;
    for (const event of dataJson.events) {
        totalPoints += event.points;
    }

    return (`${chat}${requestedPlayer}'s bingo stats | Goals completed [Latest ${completedGoals}] Total events [${completedEvents}] Points (Latest ${currentPoints} Total ${totalPoints})`);
}