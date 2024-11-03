const gamemodes = {
    'ironman': 'Ironman',
    'island': 'Stranded',
    'bingo': 'Bingo'
}

export default async function(bot, requestedPlayer, player, chat) {
    requestedPlayer = requestedPlayer.split(' ')[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success || !dataJson.profiles) return (chat + "Invalid player.");
    let profile;
    for (const i of dataJson.profiles) {
      if (i.selected) profile = i;
    }

    const members = profile.members;
    const gamemode = profile.game_mode? gamemodes[profile.game_mode] : 'Classic';
    const name = profile.cute_name;
    let names = [];
    for (const member of Object.keys(members)) {
        const nameResponse = await fetch(`https://api.mojang.com/user/profile/${member}`);
        const nameJson = await nameResponse.json();
        const name = nameJson.name;
        names.push(name);
    }
    return `${chat}${requestedPlayer}'s ${name} Coop (${gamemode}) | ${names.join(', ')}`;
}