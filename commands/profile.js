export default async function profileCommand(bot, requestedPlayer, player, chat) {
    const args = requestedPlayer.split(" ")[1];
    requestedPlayer = requestedPlayer.split(" ")[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success || !dataJson.profiles) return (chat + "Invalid player.");
    if (!args) {
        let names = [];
        for (const profile in dataJson.profiles) {
            const text = dataJson.profiles[profile].selected? `${profile}. ${dataJson.profiles[profile].cute_name} (active)` : `${profile}. ${dataJson.profiles[profile].cute_name}`
            names.push(text);
        }
        return (`${chat}${requestedPlayer}'s profiles: ${names.join(', ')}. Use .profile {player} {profile number} to see more.`);
    }

    if (!dataJson.profiles[Number(args)] && args.toLowerCase() != 'default') return (chat + "Invalid profile number.");

    let profile;
    if (args.toLowerCase() == 'default') {
        for (const i in dataJson.profiles) {
            if (dataJson.profiles[i].selected) {
                profile = dataJson.profiles[i];
            }
        }
    }
    else {
        profile = dataJson.profiles[Number(args)];
    }

    const profileType = profile.game_mode? profile.game_mode : 'classic';
    const profileName = profile.cute_name;
    const profileSelected = profile.selected;
    const profileData = profile.members[uuid];
    const serum = profileData.experimentation && profileData.experimentation.serums_drank? profileData.experimentation.serums_drank : 0;
    const jyrre = profileData.winter_player_data? profileData.winter_player_data : 0;
    const profileCreated = profileData.profile.first_join? new Date(profileData.profile.first_join).toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'}) : 'Unknown';
    const deathCount = profileData.player_data.death_count? profileData.player_data.death_count : 0;
    const soulflowCount = profileData.item_data? profileData.item_data.soulflow : 0;
    const fairySouls = profileData.fairy_soul? profileData.fairy_soul.total_collected : 0;

    const message = `${chat}${requestedPlayer} on ${profileName} (${profileType}) Created ${profileCreated}, Selected: ${profileSelected}, Deaths: ${deathCount}, Soulflow: ${soulflowCount}, Serum: ${serum}, Jyrre: ${jyrre}, Fairy souls: ${fairySouls}`;
    return (message);
}