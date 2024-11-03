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

    const harpData = profileData.quests.harp_quest;
    const talisman = harpData.claimed_talisman? '✔' : '✖';
    let songs = 0;
    let total = 0;
    for (const song in harpData) {
        if (song.includes('_perfect_completions')) {
            songs++;
        }
        if (song.match(/^(?!.*(?:_best|_perfect))song_([a-z]+)_completions$/)) {
            total+= harpData[song];
        }
    }
    let songsObj = {};
    let wlr = 0;
    for (const song in harpData) {
        let split;
        if (split = song.match(/^song_([a-z]+)_perfect_completions$/)) {
            const splitSong = split[1];
            songsObj[splitSong] = {wins: harpData['song_' + splitSong + '_perfect_completions'], attempts: harpData['song_' + splitSong + '_completions']};
        }
    }
    let wlrs = [];
    for (const song in songsObj) {
        wlrs.push(songsObj[song].wins / songsObj[song].attempts);
    }
    for (const i of wlrs) {
        wlr += i;
    }
    wlr /= wlrs.length;

    return (`${chat}${requestedPlayer}'s harp | Songs [${songs}/13] Average WLR [${wlr.toFixed(2)}] Completions [${total}] Talisman ${talisman}`);
}