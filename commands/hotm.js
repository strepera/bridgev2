const hotmLevels = [
    1247000,
    847000,
    557000,
    347000,
    197000,
    97000,
    37000,
    12000,
    3000,
    0
];

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toFixed(2);
}

function getHotmLevel(experience) {
    if (experience >= hotmLevels[0]) return hotmLevels.length;
    for (const level in hotmLevels) {
        if (experience > hotmLevels[level]) {
            const currentLevelXP = hotmLevels[level];
            const nextLevelXP = hotmLevels[level - 1];
            return (hotmLevels.length - level + (experience - currentLevelXP) / (nextLevelXP - currentLevelXP)).toFixed(2) + ` (${formatNumber(experience - currentLevelXP)}/${formatNumber(nextLevelXP - currentLevelXP)})`;
        }
    }
}

const crystals = [
    "jade_crystal",
    "amber_crystal",
    "amethyst_crystal",
    "sapphire_crystal",
    "topaz_crystal"
];

function getRuns(data) {
    let lowest = 0;
    if (!data) return 0;
    for (const crystal in data) {
        if (crystals.includes(crystal)) {
            if (lowest > data[crystal].total_placed) {
                return lowest;
            }
            else {
                lowest = data[crystal].total_placed;
            }
        }
    }
    return lowest;
}

function check(value) {
    if (value) {
        return value;
    }
    else {
        return 0;
    }
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
    let profileData;
    for (const profile of dataJson.profiles) {
      if (profile.selected) profileData = profile.members[uuid];
    }

    const achievementResponse = await fetch(`https://api.hypixel.net/v2/player?key=${process.env.apiKey}&uuid=${uuid}`);
    const achievementData = await achievementResponse.json();
    const commissions = check(achievementData.player.achievements.skyblock_hard_working_miner);

    const data = profileData.mining_core;
    const mithrilTotal = check(data.powder_mithril_total);
    const mithrilUsed = check(data.powder_spent_mithril);
    const gemstoneTotal = check(data.powder_gemstone_total);
    const gemstoneUsed = check(data.powder_spent_gemstone);
    const glaciteTotal = check(data.powder_glacite_total);
    const glaciteUsed = check(data.powder_spent_glacite);
    const hotm = getHotmLevel(check(data.experience));
    const runs = getRuns(data.crystals);

    const mithril = `(${formatNumber(mithrilUsed)}/${formatNumber(mithrilUsed + mithrilTotal)})`;
    const gemstone = `(${formatNumber(gemstoneUsed)}/${formatNumber(gemstoneUsed + gemstoneTotal)})`;
    const glacite = `(${formatNumber(glaciteUsed)}/${formatNumber(glaciteUsed + glaciteTotal)})`;

    return (`${chat}${requestedPlayer}'s mining | HOTM ${hotm} Runs ${runs} Commissions ${commissions.toLocaleString()} Mithril ${mithril} Gemstone ${gemstone} Glacite ${glacite}`);
}