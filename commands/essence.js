export default async function(bot, requestedPlayer, player, chat) {
    requestedPlayer = requestedPlayer.split(' ')[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success || !dataJson.profiles) return (chat + "Invalid player.");
    let profileData;
    for (const profile of dataJson.profiles) {
      if (profile.selected) profileData = profile.members[uuid];
    }
    
    const essence = profileData.currencies.essence;
    if (!essence) {
        return chat + requestedPlayer + ' has no essence.';
    }
    let essenceArr = [];
    for (const ess in essence) {
        essenceArr.push(`${ess} [${essence[ess].current}]`);
    }

    return chat + requestedPlayer + "'s Essence | " + essenceArr.join(', ');
}