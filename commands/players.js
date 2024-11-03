const readability = {
    'farming_1': 'Barn Islands',
    'foraging_1': 'Park',
    'mining_1': 'Gold Mine',
    'mining_2': 'Deep Caverns',
    'mining_3': 'Dwarven Mines',
    'combat_1': "Spider's Den",
    'combat_3': 'End',
    'dynamic': 'Private Island'
}

export default async function(bot, requestedPlayer, player, chat) {
    const response = await fetch(`https://api.hypixel.net/v2/counts?key=${process.env.apiKey}`);
    const json = await response.json();
    if (json.success != true) return;
    let message = [];
    const data = json.games.SKYBLOCK.modes;
    for (let entry in data) {
        const name = entry;
        if (readability[entry]) {
            entry = readability[entry];
        }
        entry = entry.replaceAll('_', ' ');
        let entryParts = entry.split(' ');
        for (let part in entryParts) {
            entryParts[part] = entryParts[part][0].toUpperCase() + entryParts[part].slice(1);
        }
        entry = entryParts.join(' ');
        message.push(entry, data[name]);
    }
    return (chat + message.join(' ').substring(0, 230));
}
